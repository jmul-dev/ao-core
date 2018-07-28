import { EventEmitter } from 'events';
import { IAORouterMessage } from './AORouter';
import { ChildProcess } from 'child_process';
import { ReadStream } from 'tty';
import fs from 'fs';


export interface IAORouterRequest {
    id: string;
    event: string;
    data?: any;
    respond: (data: any) => void;
    reject: (error: Error) => void;
}


/**
 * AOProcessRouter provides an abstraction on top of the 
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
class AOProcessRouter extends EventEmitter {
    private process: ChildProcess | NodeJS.Process | any;
    private debug: Function;
    private moduleName: string;
    private processIdentifier;
    private requestCount = 0;

    constructor(childProcess: ChildProcess, debug: Function, moduleName: string) {
        super();
        this.debug = debug;
        this.processIdentifier = Math.random().toString(36).substring(5);
        this.process = childProcess ? childProcess : process
        this.process.on('message', this._routeMessage.bind(this))
        this.debug(`Router interface initialized for [${moduleName}] with id[${this.processIdentifier}]`)
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
            message.data.stream = fs.createReadStream(null, {fd: 3})
        }
        const incomingRequest: IAORouterRequest = {
            id: message.requestId,
            event: message.event,
            data: message.data,
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
            data: !isReject ? responseData : undefined,
            error: isReject ? responseData : undefined,
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
            if ( data && data.stream ) {
                const readableStream = data.stream
                if ( this.process.stdio ) {
                    this.debug('Attempting to pipe stream to AORouter process via stdio3')
                    readableStream.pipe(this.process.stdio[3])
                } else {
                    this.debug('Attempting to pipe stream to AORouter, no stdio to mess with')
                }
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
 * AORouterInterface
 * 
 * Simple wrapper around the process router for now, but
 * will extend to handle lifecycle events as well.
 */

export default abstract class AORouterInterface {
    router: AOProcessRouter;

    /**
     * @param childProcess Only provide reference to childProcess from ao-core
     */
    constructor(childProcess?: ChildProcess, debug: Function = console.log, moduleName: string = 'unkown') {
        this.router = new AOProcessRouter(childProcess, debug, moduleName)
    }
}