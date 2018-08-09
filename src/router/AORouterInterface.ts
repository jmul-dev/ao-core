import { EventEmitter } from 'events';
import { IAORouterMessage } from './AORouter';
import fs from 'fs';
import AORouterCoreProcessPretender from './AORouterCoreProcessPretender';


/**
 * TODO: AOSubprocessRouter & AOCoreProcessRouter are similar enough
 * we should really just extend that functionality out of the abstract
 * AORouterInterface, time permitting.
 */

export interface IAORouterRequest {
    id: string;
    event: string;
    data?: any;
    ethAddress?: string;
    respond: (data: any) => void;
    reject: (error: Error) => void;
}

/**
 * Any class interfacing with the AORouter should handle these
 */
abstract class AORouterInterface {
    abstract send(event: string, data?: any): Promise<any>;
    abstract on(event: string, listener: (message: IAORouterRequest) => void): void;
}


/**
 * AOSubprocessRouter provides an abstraction on top of the 
 * incoming and outgoing process messages. This simplifies
 * the API for subprocesses to interact with AO via the 
 * following two mechanisms:
 * 
 * 1. For sending messages/requests
 *      this.router.send('event', data).then().catch()
 * 
 * 2. For handling incoming requests
 *      this.router.on('event', (incomingRequest) => {
 *          incomingRequest.respond(data)
 *          incomingRequest.reject(error)
 *      })
 */
export class AOSubprocessRouter extends EventEmitter implements AORouterInterface {
    private process: NodeJS.Process;
    private processIdentifier;
    private requestCount = 0;

    constructor() {
        super();
        this.processIdentifier = Math.random().toString(36).substring(5);
        this.process = process
        this.process.on('message', this._routeMessage.bind(this))
    }

    /**
     * _routeMessage is used to wrap the incoming request
     * with a set of callbacks to respond directly to that 
     * request
     * 
     * @param message 
     */
    private _routeMessage(message: IAORouterMessage) {
        if ( message.responseId ) {
            // This is a response to one of our earlier requests, we let 
            // the other event listener handle that
            return;            
        }
        if ( message.data && message.data.stream ) {
            console.log('Subprocess - attempt to create readStream on fd4')
            message.data.stream = fs.createReadStream(null, {fd: 4})
        }
        const incomingRequest: IAORouterRequest = {
            id: message.requestId,
            event: message.event,
            data: message.data || {},
            ethAddress: message.ethAddress,
            respond: this._routeMessageResponse.bind(this, message, false),
            reject: this._routeMessageResponse.bind(this, message, true),
        }
        this.emit(message.event, incomingRequest)
    }

    private _routeMessageResponse(originatingMessage: IAORouterMessage, isReject: boolean, responseData: any) {
        const outgoingResponse: IAORouterMessage = {
            routerMessageId: originatingMessage.routerMessageId,
            requestId: originatingMessage.requestId,
            responseId: originatingMessage.requestId,
            event: originatingMessage.event,
            ethAddress: originatingMessage.ethAddress,
            data: !isReject ? responseData : undefined,
            error: isReject ? (responseData instanceof Error ? responseData.message : responseData) : undefined,
        }
        this.process.send(outgoingResponse)
    }

    /**
     * Send-to-Router is wrapped in a promise for process
     * abstraction and better handling of responses.
     * 
     * @param event 
     * @param data 
     * @returns Promise<any>
     */
    public send(event: string, data?: any): Promise<any> {
        return new Promise((resolve, reject) => {
            const requestId = `${this.processIdentifier}:${++this.requestCount}`;
            const request: IAORouterMessage = {
                requestId,
                event,
                data,
            }            
            if ( data && data.stream ) {
                /**
                 * Reminder: we are sending the stream up to the parent
                 * process (core)
                 */
                const readableStream = data.stream
                const outputStream = fs.createWriteStream(null, {fd: 4})
                readableStream.pipe(outputStream)
                data.stream = true  // We dont pass the stream object through to the router 
            }
            this.process.send(request, (error?: Error) => {
                if ( error ) {
                    // TODO data.stream.unpipe(this.process.stdio[3])
                    return reject(error)
                }
                this.process.on('message', (message: any) => {
                    if ( message.requestId === request.requestId ) {
                        if ( message.error ) {
                            reject(message.error)
                        } else {
                            resolve(message)
                        }
                    }
                })
            })
        })
    }
}

/**
 * Same as AOSubprocessRouter, but since this is running on the same process
 * as the router/core we need to make some modifications.
 */
export class AOCoreProcessRouter extends EventEmitter implements AORouterInterface {
    public process: AORouterCoreProcessPretender;
    private processIdentifier;
    private requestCount = 0;

    constructor() {
        super();
        this.processIdentifier = Math.random().toString(36).substring(5);
        this.process = new AORouterCoreProcessPretender()
        this.process.on('message', this._routeMessage.bind(this))
    }
    
    /**
     * _routeMessage is used to wrap the incoming request
     * with a set of callbacks to respond directly to that 
     * request
     * 
     * @param message 
     */
    private _routeMessage(message: IAORouterMessage) {
        if ( message.responseId ) {
            // This is a response to one of our earlier requests, we let 
            // the other event listener handle that
            return;            
        }
        const incomingRequest: IAORouterRequest = {
            id: message.requestId,
            event: message.event,
            data: message.data || {},
            ethAddress: message.ethAddress,
            respond: this._routeMessageResponse.bind(this, message, false),
            reject: this._routeMessageResponse.bind(this, message, true),
        }
        this.emit(message.event, incomingRequest)
    }

    private _routeMessageResponse(originatingMessage: IAORouterMessage, isReject: boolean, responseData: any) {
        const outgoingResponse: IAORouterMessage = {
            routerMessageId: originatingMessage.routerMessageId,
            requestId: originatingMessage.requestId,
            responseId: originatingMessage.requestId,
            event: originatingMessage.event,
            ethAddress: originatingMessage.ethAddress,
            data: !isReject ? responseData : undefined,
            error: isReject ? (responseData instanceof Error ? responseData.message : responseData) : undefined,
        }
        this.process.send(outgoingResponse)
    }

    /**
     * Send-to-Router is wrapped in a promise for process
     * abstraction and better handling of responses.
     * 
     * @param event 
     * @param data 
     * @returns Promise<any>
     */
    public send(event: string, data?: any): Promise<any> {
        // TODO: if we are sending a stream, make sure our stdio fd is not in use!
        // If so we need to move this onto a queue
        return new Promise((resolve, reject) => {
            const requestId = `${this.processIdentifier}:${++this.requestCount}`;
            const request: IAORouterMessage = {
                requestId,
                event,
                data,
            }
            this.process.send(request, (error?: Error) => {
                if ( error ) {
                    return reject(error)
                }
                this.process.on('message', (message: any) => {
                    if ( message.requestId === request.requestId ) {
                        if ( message.error ) {
                            reject(message.error)
                        } else {
                            resolve(message)
                        }
                    }
                })
            })
        })
    }
}

/**
 * AORouterInterface
 * 
 * Simple wrapper around the process router for now, but
 * will extend to handle lifecycle events as well.
 */

export default abstract class AORouterSubprocessInterface {
    router: AOSubprocessRouter;

    constructor() {
        this.router = new AOSubprocessRouter()
    }
}

export abstract class AORouterCoreProcessInterface {
    router: AOCoreProcessRouter;

    constructor() {
        this.router = new AOCoreProcessRouter()
    }
}