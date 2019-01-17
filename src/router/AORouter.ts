import { ChildProcess, spawn } from "child_process";
import path from "path";
import Debug from "../AODebug";
import { ReadStream, WriteStream } from "fs";
import fs from "fs";
import ffprobeStatic from "ffprobe-static";
import AORouterCoreProcessPretender from "./AORouterCoreProcessPretender";
import {
    AORouterCoreProcessInterface,
    AORouterSubprocessArgs
} from "./AORouterInterface";
import { ICoreOptions } from "../index";
const debug = Debug("ao:router");
const packageJson = require("../../package.json");
// Core modules
const fsPackageJson: IRegistryEntry = require("../modules/fs/package.json");
const dbPackageJson: IRegistryEntry = require("../modules/db/package.json");
const datPackageJson: IRegistryEntry = require("../modules/dat/package.json");
const ethPackageJson: IRegistryEntry = require("../modules/eth/package.json");
const p2pPackageJson: IRegistryEntry = require("../modules/p2p/package.json");
const corePackageJson = {
    name: "ao-core",
    version: packageJson.version,
    publisher: "AO",
    displayName: "AO Core",
    description: "AO Core's main process",
    bin: undefined,
    AO: {
        runUnderCore: true,
        events: ["/core/log", "/core/content/incomingPurchase"]
    }
};

export interface IRegistryEntry {
    name: string;
    version: string;
    publisher: string;
    displayName: string;
    description: string;
    bin: string;
    AO: {
        runUnderCore?: boolean;
        activationEvents?: Array<string>; // Events that trigger new instance
        events: Array<string>;
    };
}

export interface IAORouterMessage {
    routerMessageId?: number; // May not be assigned before it hits the router
    requestId: string; // requestId is assigned in the originating process
    responseId?: string;
    ethAddress?: string;
    event: string;
    data?: any;
    error?: Error | string;
    routerParams?: IAORouterMessageRouterParams;
}
export interface IAORouterMessageRouterParams {
    ignoreLogging?: boolean;
}

/**
 * Process is accounting for both ChildProcess and NodeJS.Process
 */
type Process = NodeJS.Process | ChildProcess | any; // Sorry tsc was not happy with this

/**
 * AORouter
 *
 * There are a few big assumptions being made for simplicty, although these
 * assumptions limit some of the use cases at the moment.
 * 1. There will only be a single instance of each subprocess
 *      Unless: the registry item attaches `activationEvents` in which a new process
 *      will be spawned anytime that event comes through.
 * 2. Each `event` will be handled by a single process
 *
 * Any process wishing to interact with the AORouter should extend the AORouterInterface
 * class, as there is some abstraction over the process messaging.
 *
 *
 * TODO: this is a ways off, but we should distinguish between `events` (consumed by anyone)
 * and `messages` (from one process to another with response)
 */
export default class AORouter extends AORouterCoreProcessInterface {
    private args: ICoreOptions;
    public initialized: boolean = false;
    /**
     * The registry is a store of the available subprocesses
     * and their capabilities.
     */
    private registry: {
        [key: string]: IRegistryEntry;
    } = {};
    /**
     * Helper for registry lookup by event name
     */
    private eventToRegistryEntryName: {
        [key: string]: string;
    } = {};
    /**
     * Helper for process instance lookup by registry name
     */
    private registryEntryNameToProcessInstances: {
        [key: string]: Array<Process>;
    } = {};
    /**
     * Each message that comes in is assigned a number. This
     * number allows us to route arbitrary process messages to
     * the originating process request.
     */
    private messageCount: number = 0;

    // Used by many modules to indicate who we're helping out.
    private activeEthAddress: string = null;

    constructor(args: ICoreOptions) {
        super();
        this.args = args;
    }

    /**
     * Initializes processes under the core router. There is a specific
     * dependency heirarchy that needs to be respected.
     */
    public async start() {
        return new Promise((resolve, reject) => {
            this.registerCoreProcesses();
            this.spawnCoreProcesses()
                .then(() => {
                    resolve();
                })
                .catch(reject);
            this.initialized = true; //Should this be in the above promise?
            // this.registerExtensions()
            this._printRouterState();
        });
    }

    private incomingMessageRouter(
        message: IAORouterMessage,
        from: IRegistryEntry,
        fromProcess: Process
    ) {
        if (
            message.responseId ||
            (message.routerMessageId && !message.responseId)
        ) {
            // NOTE: this is a response to an earlier message, see the AORouter.send
            // method for how that response is handled
        } else if (message.event) {
            // 1. We re-use the router send method to push this off to the proper location
            this.relay(message, from, fromProcess)
                .then((responseMessage: IAORouterMessage) => {
                    // 2. Send this back to the originating process
                    fromProcess.send(responseMessage);
                })
                .catch((err: Error) => {
                    const responseError: IAORouterMessage = {
                        ...message,
                        responseId: message.requestId,
                        error: err instanceof Error ? err.message : err
                    };
                    fromProcess.send(responseError);
                });
        } else {
            debug(`[${from.name}] sent a message with no event`);
        }
    }

    /**
     * Sends a message to the appropriate registered process(es).
     *
     * @param event
     * @param data
     */
    private async relay(
        incomingMessage: IAORouterMessage,
        from: IRegistryEntry,
        fromProcess: Process
    ): Promise<any> {
        const messageId =
            incomingMessage.routerMessageId || ++this.messageCount;
        if (this.messageCount >= Number.MAX_SAFE_INTEGER) {
            this.messageCount = 1;
        }
        const event = incomingMessage.event;
        return new Promise(async (resolve, reject) => {
            // 0. For context, router passes along user id (ethAddress)
            if (incomingMessage.event == "/db/user/init") {
                this.activeEthAddress = incomingMessage.data.ethAddress;
            }
            // 1. Ensure message format (NOTE: we leave data validation up to the event handler)
            const message: IAORouterMessage = {
                routerMessageId: messageId,
                requestId: incomingMessage.requestId,
                ethAddress: this.activeEthAddress,
                event: incomingMessage.event,
                data: incomingMessage.data,
                error: incomingMessage.error
                    ? incomingMessage.error instanceof Error
                        ? incomingMessage.error
                        : new Error(incomingMessage.error)
                    : undefined
            };
            // 2. Make sure we have a registered process that can handle this event
            const entryNameThatCanHandleEvent = this.eventToRegistryEntryName[
                event
            ];
            if (!entryNameThatCanHandleEvent) {
                const err = new Error(
                    "No process entries can handle event: " + event
                );
                debug(err.message);
                reject(err);
                return;
            }
            const receivingRegistryEntry = this.registry[
                entryNameThatCanHandleEvent
            ];
            const existingProcesses = this.registryEntryNameToProcessInstances[
                entryNameThatCanHandleEvent
            ];
            let receivingProcess: Process = null;

            // 3a. If this is an activation event for the entry, lets spawn another instance
            if (
                receivingRegistryEntry.AO.activationEvents &&
                receivingRegistryEntry.AO.activationEvents.indexOf(event) > -1
            ) {
                try {
                    debug(
                        `spinning up instance of ${
                            receivingRegistryEntry.name
                        } for activation event ${event}`
                    );
                    receivingProcess = await this.spawnProcessForEntry(
                        receivingRegistryEntry,
                        { isActivationEvent: true }
                    );
                } catch (e) {
                    debug(e);
                }
            } else if (existingProcesses.length > 0) {
                // 3b. Not an activation event & we have a running process that can handle this event
                receivingProcess = existingProcesses[0];
            } else {
                // 3c. Not an activation event, but no existing process
                try {
                    receivingProcess = await this.spawnProcessForEntry(
                        receivingRegistryEntry
                    );
                } catch (e) {
                    debug(e);
                }
            }
            if (!receivingProcess) {
                reject(
                    new Error(`Unable to locate process for event: ${event}`)
                );
                return;
            }
            // 4. Handle streams
            const messageHasStream = message.data && message.data.stream;
            let readStream: ReadStream;
            let writeStream: WriteStream;
            let reattachStream: Object = null;
            if (messageHasStream) {
                if (message.data.streamDirection == "write") {
                    if (from.name === "ao-core") {
                        readStream = message.data.stream;
                        writeStream = receivingProcess.stdio[3];
                        message.data.stream = true; // cannot send the stream object to subprocess
                        debug("piping stream FROM core TO subprocess");
                    } else if (receivingRegistryEntry.name === "ao-core") {
                        //write from sub to core
                        readStream = fs.createReadStream(null, { fd: 4 });
                        writeStream = new WriteStream();
                        message.data.stream = writeStream;
                        reattachStream = writeStream;
                        debug("piping stream FROM subprocess TO core");
                    } else {
                        //sub to sub
                        readStream = fromProcess.stdio[4];
                        writeStream = receivingProcess.stdio[3];
                        message.data.stream = true; // cannot send the stream object to subprocess
                        debug("piping stream FROM subprocess TO subprocess");
                    }
                } else if (message.data.streamDirection == "read") {
                    if (from.name === "ao-core") {
                        //request core read a sub process
                        readStream = receivingProcess.stdio[4]; //4 is output!
                        writeStream = message.data.stream;
                        reattachStream = writeStream;
                        message.data.stream = true; // cannot send the stream object to subprocess
                    } else if (receivingRegistryEntry.name === "ao-core") {
                        //request sub wants to read a core process
                        readStream = new ReadStream(); //TODO: Figure out how to read from core
                        writeStream = fs.createWriteStream(null, { fd: 3 }); //3 is for input
                    } else {
                        //sub to sub
                        readStream = receivingProcess.stdio[4];
                        writeStream = fromProcess.stdio[3];
                        message.data.stream = true; // cannot send the stream object to subprocess
                    }
                }
                readStream.pipe(writeStream).on("error", err => {
                    debug(`Error piping stream:`, err);
                });
            }
            const startTime = Date.now();
            if (
                !incomingMessage.routerParams.ignoreLogging &&
                process.env.NODE_ENV !== "production"
            ) {
                debug(
                    `routing event    [${message.routerMessageId}][${event}]: ${
                        from.name
                    } -> ${receivingRegistryEntry.name} ${
                        messageHasStream ? "(with stream)" : ""
                    }`
                );
            }
            // 5. Send the request out
            receivingProcess.send(message, (error?: Error) => {
                if (error) {
                    if (messageHasStream) {
                        readStream.unpipe(writeStream);
                    }
                    reject(error);
                    return;
                }
                // 6. Match incoming messages to the requestId, this will be our response
                receivingProcess.on(
                    "message",
                    function receivingProcessResponseHandler(
                        response: IAORouterMessage
                    ) {
                        if (
                            message.routerMessageId === response.routerMessageId
                        ) {
                            const responseTime = Date.now() - startTime;
                            const responseTimeFormated = (
                                responseTime / 1000
                            ).toFixed(2);
                            if (
                                !incomingMessage.routerParams.ignoreLogging &&
                                process.env.NODE_ENV !== "production"
                            ) {
                                debug(
                                    `routing response [${
                                        message.routerMessageId
                                    }][${event}]: ${from.name} <- ${
                                        receivingRegistryEntry.name
                                    }, duration[${responseTimeFormated}s] ${
                                        response.error
                                            ? ", rejecting with error"
                                            : ""
                                    }`
                                );
                            }
                            if (response.error) {
                                reject(response.error);
                            } else {
                                //for certain scenarios, we need to re-attach a read/write stream back to core.
                                if (
                                    messageHasStream &&
                                    from.name === "ao-core" &&
                                    reattachStream
                                ) {
                                    response.data["stream"] = reattachStream;
                                }
                                resolve(response);
                            }
                            receivingProcess.removeListener(
                                "message",
                                receivingProcessResponseHandler
                            );
                        }
                    }
                );
            });
        });
    }

    private registerCoreProcesses() {
        // NOTE: we could pull from the core package.json if we really wanted
        this.registerEntry(corePackageJson);
        this.registerEntry(fsPackageJson);
        this.registerEntry(dbPackageJson);
        this.registerEntry(datPackageJson);
        this.registerEntry(ethPackageJson);
        this.registerEntry(p2pPackageJson);
    }

    private registerEntry(entry: IRegistryEntry) {
        if (this.registry[entry.name]) {
            debug(
                "Registry name collision, possibly duplicate entry name. Not registering...",
                entry
            );
            this._printRouterState();
        } else {
            this.registry[entry.name] = entry;
            this.registry[entry.name].AO.events.forEach(event => {
                if (this.eventToRegistryEntryName[event]) {
                    // Current limitation of AORouter is that there is a one-to-one
                    // relation between registry entry and event
                    const err = new Error(
                        `Registry entry is attempting to listen for an event[${event}] that is already registered by entry[${
                            this.eventToRegistryEntryName[event]
                        }]`
                    );
                    debug(err.message);
                } else {
                    this.eventToRegistryEntryName[event] = entry.name;
                }
            });
            this.registryEntryNameToProcessInstances[entry.name] = [];
        }
    }

    private spawnCoreProcesses(): Promise<any> {
        return new Promise((resolve, reject) => {
            let spawns = [];
            Object.keys(this.registry).forEach((entryName: string) => {
                const registryEntry: IRegistryEntry = this.registry[entryName];
                if (registryEntry.AO.runUnderCore) {
                    spawns.push(() => this.bindCoreProcess(registryEntry));
                } else if (
                    !registryEntry.AO.activationEvents ||
                    registryEntry.AO.activationEvents.length === 0
                ) {
                    spawns.push(() => this.spawnProcessForEntry(registryEntry));
                }
            });
            this._promiseSerial(spawns)
                .then(() => {
                    resolve();
                })
                .catch(reject);
        });
    }

    private _promiseSerial = funcs =>
        funcs.reduce(
            (promise, func) =>
                promise
                    .then(result => {
                        func()
                            .then(result => {
                                if (result) {
                                    Array.prototype.concat.bind(result);
                                }
                            })
                            .catch(debug);
                    })
                    .catch(debug),
            Promise.resolve([])
        );

    private bindCoreProcess(
        entry: IRegistryEntry
    ): Promise<AORouterCoreProcessPretender> {
        return new Promise((resolve, reject) => {
            let coreEntryProcess: AORouterCoreProcessPretender = this.router
                .process;
            coreEntryProcess.on("exit", this.shutdown.bind(this));
            coreEntryProcess.on("message", (message: IAORouterMessage) => {
                if (message.event == "ready") {
                    resolve(coreEntryProcess);
                } else {
                    this.incomingMessageRouter(
                        message,
                        entry,
                        coreEntryProcess
                    );
                }
            });
            this.addProcessIntanceToEntry(entry.name, coreEntryProcess);
            //resolve(coreEntryProcess)
        });
    }

    private spawnProcessForEntry(
        entry: IRegistryEntry,
        options?: { isActivationEvent: boolean }
    ): Promise<ChildProcess | null> {
        return new Promise((resolve, reject) => {
            let processLocation = path.join(__dirname, "modules", entry.bin);
            //processLocation = processLocation.replace('app.asar', 'app.asar.unpacked');  // Sry, but if running within electron the paths are off
            debug(
                `Attempting to spawn process ${
                    entry.name
                } at: ${processLocation}`
            );
            const subprocessArgs: AORouterSubprocessArgs = {
                storageLocation: this.args.storageLocation,
                httpOrigin: this.args.httpOrigin,
                coreOrigin: this.args.coreOrigin,
                corePort: this.args.corePort,
                ffprobeBin: ffprobeStatic.path,
                ethNetworkRpc: this.args.ethNetworkRpc
            };
            let processArgs = [processLocation];
            // Went this route for type checking
            for (const key in subprocessArgs) {
                if (subprocessArgs.hasOwnProperty(key)) {
                    const value = subprocessArgs[key];
                    processArgs.push(`--${key}`);
                    processArgs.push(value);
                }
            }
            processArgs.push("--ao-core");
            let entryProcess: ChildProcess = spawn(
                this.args.nodeBin,
                processArgs,
                {
                    stdio: ["ipc", "inherit", "inherit", "pipe", "pipe"]
                }
            );
            entryProcess.on("error", err => {
                debug(`[${entry.name}] process: error`, err.message);
                // TODO: handle err, log or something
            });
            entryProcess.on("exit", (code?: number) => {
                debug(`[${entry.name}] process: exit`);
                // Currently, if any of the major modules die, our entire system is set to shutdown.
                if (!options.isActivationEvent) {
                    debug(`core subprocess died, killing ao-core...`);
                    this.shutdown();
                    process.exit(); //Kill core process on entryProcess exit
                } else {
                    this.removeProcessInstanceFromEntry(
                        entry.name,
                        entryProcess
                    );
                }
            });
            entryProcess.on("message", (message: IAORouterMessage) => {
                if (message.event == "ready") {
                    resolve(entryProcess);
                } else {
                    this.incomingMessageRouter(message, entry, entryProcess);
                }
            });

            if (entryProcess.pid) {
                this.addProcessIntanceToEntry(entry.name, entryProcess);
            } else {
                debug(new Error("Could not spawn process: " + entry.name));
                resolve(null);
            }
        });
    }

    private addProcessIntanceToEntry(
        entryName: string,
        processInstance: Process
    ) {
        this.registryEntryNameToProcessInstances[entryName].push(
            processInstance
        );
        debug(
            `[${entryName}] adding process instance, instances running: ${
                this.registryEntryNameToProcessInstances[entryName].length
            }`
        );
    }

    private removeProcessInstanceFromEntry(
        entryName: string,
        processInstance: Process
    ) {
        let existingProcesses = this.registryEntryNameToProcessInstances[
            entryName
        ];
        for (let i = 0; i < existingProcesses.length; i++) {
            const existingProcess = existingProcesses[i];
            if (existingProcess === processInstance) {
                debug(
                    `[${entryName}] removing process instance, instances remaining: ${existingProcesses.length -
                        1}`
                );
                this.registryEntryNameToProcessInstances[entryName].splice(
                    i,
                    1
                );
                break;
            }
        }
    }

    private async registerExtensions(): Promise<any> {
        // TODO. load foreign sub processes (extensions)
    }

    public shutdown(): void {
        // Attempt to kill all subprocesses
        Object.keys(this.registry).forEach((entryName: string) => {
            const instances = this.registryEntryNameToProcessInstances[
                entryName
            ];
            if (instances) {
                instances.forEach((processInstance: Process) => {
                    if (processInstance.kill) {
                        processInstance.kill();
                    }
                });
            }
        });
    }

    private _printRouterState() {
        const timestamp = Date.now();
        debug(`=======  AORouter state (${timestamp}) =======`);
        Object.keys(this.registry).forEach((entryName: string) => {
            const entry: IRegistryEntry = this.registry[entryName];
            const instances = this.registryEntryNameToProcessInstances[
                entryName
            ];
            debug(`${entry.displayName} (${entry.name}):`);
            debug(`\tevents: ${entry.AO.events.join(", ")}`);
            debug(`\tinstances: ${instances.length}`);
        });
        debug(`=======  AORouter state (${timestamp}) =======`);
    }
}
