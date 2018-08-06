import { ChildProcess, spawn } from "child_process";
import path from 'path';
import Debug from 'debug';
import { ReadStream, WriteStream } from "fs";
import fs from 'fs';
import AORouterCoreProcessPretender from "./AORouterCoreProcessPretender";
import { AORouterCoreProcessInterface } from "./AORouterInterface";
import { ICoreOptions } from "../bin";
const debug = Debug('ao:router');
const packageJson = require('../../package.json');
// Core modules
const fsPackageJson: IRegistryEntry = require('../modules/fs/package.json');
const httpPackageJson: IRegistryEntry = require('../modules/http/package.json');
const dbPackageJson: IRegistryEntry = require('../modules/db/package.json');
const datPackageJson: IRegistryEntry = require('../modules/dat/package.json');
const p2pPackageJson: IRegistryEntry = require('../modules/p2p/package.json');
const corePackageJson = {
    name: 'ao-core',
    version: packageJson.version,
    publisher: 'AO',
    displayName: 'AO Core',
    description: 'AO Core\'s main process',
    bin: undefined,
    AO: {
        runUnderCore: true,
        events: [
            '/core/log'
        ],
    },
}

export interface IRegistryEntry {
    name: string;
    version: string;
    publisher: string;
    displayName: string;
    description: string;
    bin: string;
    AO: {
        runUnderCore?: boolean;
        activationEvents?: Array<string>;  // Events that trigger new instance
        events: Array<string>;
    },
}

export interface IAORouterMessage {
    routerMessageId?: number;  // May not be assigned before it hits the router
    requestId: string;  // requestId is assigned in the originating process
    responseId?: string;
    event: string;    
    data?: any;
    error?: Error;
}

/**
 * Process is accounting for both ChildProcess and NodeJS.Process
 */
type Process = NodeJS.Process | ChildProcess | any // Sorry tsc was not happy with this

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

    constructor(args: ICoreOptions) {
        super()
        this.args = args;        
    }

    public init() {
        this.registerCoreProcesses()
        this.spawnCoreProcesses()
        this.initialized = true
        // this.registerExtensions()   
        this._printRouterState()
    }

    private incomingMessageRouter(message: IAORouterMessage, from: IRegistryEntry, fromProcess: Process) {
        if ( message.responseId || message.routerMessageId && !message.responseId ) {
            // NOTE: this is a response to an earlier message, see the AORouter.send 
            // method for how that response is handled
        } else if (message.event) {
            // 1. We re-use the router send method to push this off to the proper location
            this.relay(message, from, fromProcess).then((responseMessage: IAORouterMessage) => {
                // 2. Send this back to the originating process
                fromProcess.send(responseMessage)
            }).catch((err: Error) => {
                const responseError: IAORouterMessage = {
                    ...message,
                    responseId: message.requestId,
                    data: {
                        error: err
                    }                    
                }
                fromProcess.send(responseError)
            })
        } else {
            debug(`[${from.name}] sent a message with no event`)
        }
    }
    
    /**
     * Sends a message to the appropriate registered process(es). 
     * 
     * @param event 
     * @param data 
     */
    private async relay(incomingMessage: IAORouterMessage, from: IRegistryEntry, fromProcess: Process): Promise<any> {
        const messageId = incomingMessage.routerMessageId || ++this.messageCount;
        const event = incomingMessage.event
        return new Promise((resolve, reject) => {
            // 1. Ensure message format (NOTE: we leave data validation up to the event handler)
            const message: IAORouterMessage = {
                routerMessageId: messageId,
                requestId: incomingMessage.requestId,
                event: incomingMessage.event,
                data: incomingMessage.data,
            }
            // 2. Make sure we have a registered process that can handle this event
            const entryNameThatCanHandleEvent = this.eventToRegistryEntryName[event]
            if ( !entryNameThatCanHandleEvent ) {
                const err = new Error('No process entries can handle event: ' + event)
                debug(err.message)
                reject(err)
                return;
            }
            const receivingRegistryEntry = this.registry[entryNameThatCanHandleEvent]
            const existingProcesses = this.registryEntryNameToProcessInstances[entryNameThatCanHandleEvent]
            let receivingProcess: Process = null            
            if ( receivingRegistryEntry.AO.activationEvents && receivingRegistryEntry.AO.activationEvents.indexOf(event) > -1 ) {
                // 3a. If this is an activation event for the entry, lets spawn another instance
                receivingProcess = this.spawnProcessForEntry(receivingRegistryEntry)
            } else if ( existingProcesses.length > 0 ) {
                // 3b. Not an activation event & we have a running process that can handle this event
                receivingProcess = existingProcesses[0]
            } else {
                // 3c. Not an activation event, but no existing process
                receivingProcess = this.spawnProcessForEntry(receivingRegistryEntry)
            }
            if ( !receivingProcess ) {
                reject(new Error(`Unable to locate process for event: ${event}`))
                return;
            }
            // 4. Handle streams
            const messageHasStream = message.data && message.data.stream
            let readStream: ReadStream;
            let writeStream: WriteStream;
            if ( messageHasStream ) {                
                if ( from.name === 'ao-core' ) {
                    readStream = message.data.stream
                    writeStream = receivingProcess.stdio[4]
                    message.data.stream = true // cannot send the stream object to subprocess
                    debug('piping stream FROM core TO subprocess')
                } else if ( receivingRegistryEntry.name === 'ao-core' ) {
                    readStream = fs.createReadStream(null, {fd: 3})
                    writeStream = new WriteStream()
                    message.data.stream = writeStream
                    debug('piping stream FROM subprocess TO core')
                } else {
                    //sub to sub
                    readStream = fromProcess.stdio[4]
                    writeStream = receivingProcess.stdio[3]
                    message.data.stream = true // cannot send the stream object to subprocess
                    debug('piping stream FROM subprocess TO subprocess')
                }
                readStream.pipe(writeStream)
            }
            const startTime = Date.now()
            debug(`routing event    [${message.routerMessageId}][${event}]: ${from.name} -> ${receivingRegistryEntry.name} ${messageHasStream ? '(with stream)' : ''}`)
            // 5. Send the request out 
            receivingProcess.send(message, (error?: Error) => {
                if ( error ) {
                    if ( messageHasStream ) {
                        readStream.unpipe(writeStream)
                    }
                    reject(error)
                    return;
                }
                // 6. Match incoming messages to the requestId, this will be our response
                receivingProcess.on('message', function receivingProcessResponseHandler(response: IAORouterMessage) {
                    if ( message.routerMessageId === response.routerMessageId ) {
                        const responseTime = Date.now() - startTime
                        const responseTimeFormated = (responseTime / 1000).toFixed(2)
                        debug(`routing response [${message.routerMessageId}][${event}]: ${from.name} <- ${receivingRegistryEntry.name}, duration[${responseTimeFormated}s]`)
                        if ( response.error ) {
                            reject(response.error)
                        } else {
                            resolve(response)
                        }
                        receivingProcess.removeListener('message', receivingProcessResponseHandler)
                    }
                })
            })
        })
    }


    private registerCoreProcesses() {
        // NOTE: we could pull from the core package.json if we really wanted
        this.registerEntry(corePackageJson)
        this.registerEntry(fsPackageJson)
        this.registerEntry(dbPackageJson)
        this.registerEntry(datPackageJson)
        this.registerEntry(p2pPackageJson)
    }

    private registerEntry(entry: IRegistryEntry) {
        if ( this.registry[entry.name] ) {            
            debug('Registry name collision, possibly duplicate entry name. Not registering...', entry)
            this._printRouterState()
        } else {
            this.registry[entry.name] = entry
            this.registry[entry.name].AO.events.forEach(event => {
                if ( this.eventToRegistryEntryName[event] ) {
                    // Current limitation of AORouter is that there is a one-to-one
                    // relation between registry entry and event
                    const err = new Error(`Registry entry is attempting to listen for an event[${event}] that is already registered by entry[${this.eventToRegistryEntryName[event]}]`)
                    debug(err.message)
                } else {
                    this.eventToRegistryEntryName[event] = entry.name
                }
            })
            this.registryEntryNameToProcessInstances[entry.name] = [];
        }
    }

    private spawnCoreProcesses() {
        Object.keys(this.registry).forEach((entryName: string) => {
            const registryEntry: IRegistryEntry = this.registry[entryName]
            if ( registryEntry.AO.runUnderCore ) {
                this.bindCoreProcess(registryEntry)
            } else if ( !registryEntry.AO.activationEvents || registryEntry.AO.activationEvents.length === 0 ) {
                this.spawnProcessForEntry(registryEntry)
            }
        })
    }

    private bindCoreProcess(entry: IRegistryEntry): AORouterCoreProcessPretender {        
        let coreEntryProcess: AORouterCoreProcessPretender = this.router.process
        coreEntryProcess.on('exit', this.shutdown.bind(this))
        coreEntryProcess.on('message', (message: IAORouterMessage) => {
            this.incomingMessageRouter(message, entry, coreEntryProcess)
        })
        this.addProcessIntanceToEntry(entry.name, coreEntryProcess)        
        return coreEntryProcess
    }

    private spawnProcessForEntry(entry: IRegistryEntry): ChildProcess | null {
        const processLocation = path.join(__dirname, '../modules', entry.bin);
        const processArgs = [
                processLocation, 
                '--storageLocation', this.args.storageLocation, 
                '--httpOrigin', this.args.httpOrigin, 
                '--coreOrigin', this.args.coreOrigin,
                '--corePort', this.args.corePort+"",//Stupid hack around typescript
                '--ao-core'
            ]
        let entryProcess: ChildProcess = spawn(process.execPath, processArgs
            , {
            stdio: ['ipc', 'inherit', 'inherit', 'pipe', 'pipe'],            
        })
        entryProcess.on('error', (err) => {
            debug(`[${entry.name}] process: error`, err.message)
            // TODO: handle err, log or something
        })
        entryProcess.on('close', (code?: number) => {
            debug(`[${entry.name}] process: close`)
            this.removeProcessInstanceFromEntry(entry.name, entryProcess)
            // TODO: cleanup references to this instance, notify anyone if necessary
        })
        entryProcess.on('message', (message: IAORouterMessage) => {
            this.incomingMessageRouter(message, entry, entryProcess)
        })
        if ( entryProcess.pid ) {
            this.addProcessIntanceToEntry(entry.name, entryProcess)        
            return entryProcess
        } else {
            debug(new Error('Could not spawn process: ' + entry.name))
            return null
        }
    }

    private addProcessIntanceToEntry(entryName: string, processInstance: Process) {        
        this.registryEntryNameToProcessInstances[entryName].push(processInstance);
        debug(`[${entryName}] adding process instance, instances running: ${this.registryEntryNameToProcessInstances[entryName].length}`)
    }

    private removeProcessInstanceFromEntry(entryName: string, processInstance: Process) {
        let existingProcesses = this.registryEntryNameToProcessInstances[entryName]
        for (let i = 0; i < existingProcesses.length; i++) {
            const existingProcess = existingProcesses[i];
            if ( existingProcess === processInstance ) {
                debug(`[${entryName}] removing process instance, instances remaining: ${existingProcesses.length - 1}`)
                this.registryEntryNameToProcessInstances[entryName] = existingProcesses.splice(i, 1)
                break;
            }
        }
    }

    private async registerExtensions(): Promise<any> {
        // TODO. load foreign sub processes (extensions)
    }

    public shutdown(): void {
        // TODO: attempt to kill all subprocesses
    }

    private _printRouterState() {
        const timestamp = Date.now()
        debug(`=======  AORouter state (${timestamp}) =======`)
        const registeredEntries = Object.keys(this.registry).forEach((entryName: string) => {
            const entry: IRegistryEntry = this.registry[entryName]
            const instances = this.registryEntryNameToProcessInstances[entryName]
            debug(`${entry.displayName} (${entry.name}):`)
            debug(`\tevents: ${entry.AO.events.join(', ')}`)
            debug(`\tinstances: ${instances.length}`)
        })
        debug(`=======  AORouter state (${timestamp}) =======`)
    }
}
