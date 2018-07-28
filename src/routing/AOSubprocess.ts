import { EventEmitter } from 'events';
import { IAORouterMessage } from './AORouter';
import { ChildProcess } from 'child_process';


export interface IAOIncomingRequest {
    id: number;
    event: string;
    data?: any;
    respond: (data: any) => void;
    reject: () => void;
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
    private requestCount = 0;

    constructor(childProcess?: ChildProcess) {
        super();
        this.process = childProcess ? childProcess : process
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
        const incomingRequest: IAOIncomingRequest = {
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
            data: isReject ? {
                error: responseData
            } : responseData
        }
        this.process.send(outgoingResponse)
    }

    /**
     * Router send is wrapped in a promise for process
     * abstraction and better handling of responses.
     * 
     * @param event 
     * @param data 
     * @returns Promise<any>
     */
    public send(event: string, data?: any): Promise<any> {
        return new Promise((resolve, reject) => {
            const requestId = ++this.requestCount;
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

export default abstract class AORouterInterface {
    router: AOProcessRouter;

    /**
     * @param childProcess Only provide reference to childProcess from ao-core
     */
    constructor(childProcess?: ChildProcess) {
        this.router = new AOProcessRouter(childProcess)
    }
}