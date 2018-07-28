import { ChildProcess, spawn } from "child_process";
import path from 'path';
import Debug from 'debug';
import EventEmitter from 'events';
const debug = Debug('ao:router');
const packageJson = require('../../package.json');


export interface IRegistryEntry {
    name: string;
    version: string;
    publisher: string;
    displayName: string;
    description: string;
    main: string;
    AO: {
        activationEvents?: Array<string>;  // Events that trigger new instance
        events: Array<string>;
        privaleged: boolean;
    },
}

export interface IAORouterMessage {
    routerMessageId?: number;  // May not be assigned before it hits the router
    requestId: number;  // requestId is assigned in the originating process
    responseId?: number;
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
 * 2. Each `route` will be handled by a single process
 */
class AORouter {
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

    constructor() {        
        this.registerCoreProcesses()
        this.spawnCoreProcesses()
        // this.registerExtensions()   
        this._printRouterState()     
    }
    
    /**
     * Sends a message to the appropriate registered process(es). 
     * 
     * @param event 
     * @param data 
     */
    async send(incomingMessage: IAORouterMessage, from: IRegistryEntry): Promise<any> {
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
                return reject(err)
            }
            const registryEntry = this.registry[entryNameThatCanHandleEvent]
            const existingProcesses = this.registryEntryNameToProcessInstances[entryNameThatCanHandleEvent]
            let correspondingProcess: Process = null            
            if ( registryEntry.AO.activationEvents && registryEntry.AO.activationEvents.indexOf(event) > -1 ) {
                // 3a. If this is an activation event for the entry, lets spawn another instance
                correspondingProcess = this.spawnProcessForEntry(registryEntry)
            } else if ( existingProcesses.length > 0 ) {
                // 3b. Not an activation event & we have a running process that can handle this event
                correspondingProcess = existingProcesses[0]
            } else {
                // 3c. Not an activation event, but no existing process
                correspondingProcess = this.spawnProcessForEntry(registryEntry)
            }
            const startTime = Date.now()
            debug(`routing event    [${message.routerMessageId}][${event}]: ${from.name} -> ${registryEntry.name}`)
            // 4. Send the request out 
            correspondingProcess.send(message, (error?: Error) => {
                if ( error ) {
                    return reject(error)
                }
                // 5. Match incoming messages to the requestId, this will be our response
                correspondingProcess.on('message', function correspondingProcessResponseHandler(response: IAORouterMessage) {
                    if ( message.routerMessageId === response.routerMessageId ) {
                        const responseTime = Date.now() - startTime
                        const responseTimeFormated = (responseTime / 1000).toFixed(2)
                        debug(`routing response [${message.routerMessageId}][${event}]: ${from.name} <- ${registryEntry.name}, duration[${responseTimeFormated}s]`)
                        if ( response.error ) {
                            reject(response.error)
                        } else {
                            resolve(response)
                        }
                        correspondingProcess.removeListener('message', correspondingProcessResponseHandler)
                    }
                })
            })
        })
    }

    private registerCoreProcesses() {
        // A unique entry in the stack, this is the controlling parent process
        // of ao-core.
        this.registerEntry({
            name: 'ao-core',
            version: packageJson.version,
            publisher: 'AO',
            displayName: 'AO Core',
            description: 'AO Core\'s main process',
            main: undefined,
            AO: {
                events: [
                    '/core/log'
                ],
                privaleged: true,
            },
        })
        this.registerEntry({
            name: 'test',
            version: packageJson.version,
            publisher: 'AO',
            displayName: 'Test',
            description: 'Test process that connects AO to the world',
            main: './TestProcess.js',
            AO: {
                events: [
                    '/test/debug'
                ],
                privaleged: true,
            },
        })
        // 1. load AO core's subprocesses (privaleged). Manually for now
        // TODO: register these the same way we would extensions
        // this.registry['p2p'] = {
        //     name: 'p2p',
        //     version: packageJson.version,
        //     publisher: 'AO',
        //     displayName: 'P2P',
        //     description: 'P2P process that connects AO to the world',
        //     main: '../p2p/p2p.js',
        //     AO: {
        //         routes: [
        //             '/p2p/peers/count',
        //             '/p2p/peer'
        //         ]
        //     },
        //     privaleged: true,
        // }
    }

    private registerEntry(entry: IRegistryEntry) {
        if ( this.registry[entry.name] ) {
            debug('Registry name collision, possibly duplicate entry name. Not registering...', entry)
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
            if ( registryEntry.name === 'ao-core' ) {
                this.bindCoreProcess(registryEntry)
            } else {
                this.spawnProcessForEntry(registryEntry)
            }
        })
    }
    private bindCoreProcess(entry: IRegistryEntry): NodeJS.Process {
        let entryProcess: Process = process
        entryProcess.on('exit', this.shutdown.bind(this))
        entryProcess.on('message', (message: IAORouterMessage) => {
            this.incomingMessageRouter(message, entry, entryProcess)
        })
        this.addProcessIntanceToEntry(entry.name, entryProcess)        
        return entryProcess
    }
    private spawnProcessForEntry(entry: IRegistryEntry): ChildProcess {
        const processLocation = path.join(__dirname, entry.main);
        const processArgs = [processLocation, '--AO']
        let entryProcess: ChildProcess = spawn(process.execPath, processArgs, {
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
        this.addProcessIntanceToEntry(entry.name, entryProcess)        
        return entryProcess
    }

    private addProcessIntanceToEntry(entryName: string, processInstance: Process) {
        this.registryEntryNameToProcessInstances[entryName].push(processInstance);
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
        // TODO. load foreign sub processes (extensions) (registry information in package.json files)
    }

    private incomingMessageRouter(message: IAORouterMessage, from: IRegistryEntry, fromProcess: Process) {
        if ( message.responseId ) {
            // NOTE: this is a response to an earlier message, see the AORouter.send 
            // method for how that response is handled
        } else if (message.event) {
            // 1. We re-use the router send method to push this off to the proper location
            this.send(message, from).then((responseMessage: IAORouterMessage) => {
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

    private shutdown(): void {
        // TODO: attempt to kill all subprocesses
    }

    private _printRouterState() {
        const timestamp = Date.now()
        debug(`=======  AORouter state (${timestamp}) =======`)
        const registeredEntries = Object.keys(this.registry).forEach((entryName: string) => {
            const entry: IRegistryEntry = this.registry[entryName]
            const instances = this.registryEntryNameToProcessInstances[entryName]
            debug(`${entry.displayName}:`)
            debug(`\tevents: ${entry.AO.events.join(', ')}`)
            debug(`\tinstances: ${instances.length}`)
        })
        debug(`=======  AORouter state (${timestamp}) =======`)
    }
}

if (require.main === module) {    
    new AORouter();
}