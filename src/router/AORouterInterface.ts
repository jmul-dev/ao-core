import { EventEmitter } from "events";
import { IAORouterMessage, IAORouterMessageRouterParams } from "./AORouter";
import fs from "fs";
import AORouterCoreProcessPretender from "./AORouterCoreProcessPretender";

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
export abstract class AORouterInterface {
    abstract send(
        event: string,
        data?: any,
        routerParams?: IAORouterMessageRouterParams
    ): Promise<any>;
    abstract on(
        event: string,
        listener: (message: IAORouterRequest) => void
    ): void;
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
export class AOSubprocessRouter extends EventEmitter
    implements AORouterInterface {
    private process: NodeJS.Process;
    private processIdentifier;
    private requestCount = 0;

    constructor() {
        super();
        this.processIdentifier = Math.random()
            .toString(36)
            .substring(5);
        this.process = process;
        this.process.setMaxListeners(32);
        this.process.on("message", this._routeMessage.bind(this));
        this.process.on("warning", function(w) {
            console.log(w.stack || w);
        });
        const initMessage = { event: "ready" };
        this.process.send(initMessage);
    }

    /**
     * _routeMessage is used to wrap the incoming request
     * with a set of callbacks to respond directly to that
     * request
     *
     * @param message
     */
    private _routeMessage(message: IAORouterMessage) {
        if (message.responseId) {
            // This is a response to one of our earlier requests, we let
            // the other event listener handle that
            return;
        }
        if (this.listenerCount(message.event) < 1) {
            console.warn(
                `No event listeners found for incoming event: ${message.event}`
            );
            return;
        }
        if (message.data && message.data.stream) {
            try {
                message.data.stream = fs.createReadStream(null, {
                    fd: 3,
                    autoClose: false
                });
            } catch (error) {
                console.log(
                    `Error attaching read stream to fd:3, ${error.message}`
                );
                this._routeMessageResponse(message, true, {});
                return;
            }
        }
        const incomingRequest: IAORouterRequest = {
            id: message.requestId,
            event: message.event,
            data: message.data || {},
            ethAddress: message.ethAddress,
            respond: this._routeMessageResponse.bind(this, message, false),
            reject: this._routeMessageResponse.bind(this, message, true)
        };
        this.emit(message.event, incomingRequest);
    }

    private _routeMessageResponse(
        originatingMessage: IAORouterMessage,
        isReject: boolean,
        responseData: any
    ) {
        const outgoingResponse: IAORouterMessage = {
            routerMessageId: originatingMessage.routerMessageId,
            requestId: originatingMessage.requestId,
            responseId: originatingMessage.requestId,
            event: originatingMessage.event,
            ethAddress: originatingMessage.ethAddress,
            data: !isReject ? responseData : undefined,
            error: isReject ? serializeError(responseData) : undefined
        };
        if (this.process && this.process.send)
            this.process.send(outgoingResponse);
        else
            console.warn(
                "AOSubprocessRouter possibly used in wrong context. Expected parent process."
            );
    }

    /**
     * Send-to-Router is wrapped in a promise for process
     * abstraction and better handling of responses.
     *
     * @param event
     * @param data
     * @returns Promise<any>
     */
    public send(
        event: string,
        data?: any,
        routerParams?: IAORouterMessageRouterParams
    ): Promise<any> {
        return new Promise((resolve, reject) => {
            if (!this.process || !this.process.send)
                return console.warn(
                    "AOSubprocessRouter possibly used in wrong context. Expected parent process."
                );
            const requestId = `${this.processIdentifier}:${++this
                .requestCount}`;
            const request: IAORouterMessage = {
                requestId,
                event,
                data,
                routerParams: routerParams || {}
            };
            if (data && data.stream) {
                /**
                 * Reminder: we are sending the stream up to the parent
                 * process (core)
                 */
                const readableStream = data.stream;
                const outputStream = fs.createWriteStream(null, {
                    fd: 4,
                    autoClose: true
                });
                readableStream.pipe(outputStream);
                data.stream = true; // We dont pass the stream object through to the router
            }
            this.process.send(request, (error?: Error) => {
                if (error) {
                    // TODO data.stream.unpipe(this.process.stdio[3])
                    return reject(error);
                }
                const messageResponseListener = (message: any) => {
                    if (message.requestId === request.requestId) {
                        this.process.removeListener(
                            "message",
                            messageResponseListener
                        );
                        if (message.error) {
                            reject(deserializeError(message.error));
                        } else {
                            resolve(message);
                        }
                    }
                };
                this.process.addListener("message", messageResponseListener);
            });
        });
    }
}

/**
 * Same as AOSubprocessRouter, but since this is running on the same process
 * as the router/core we need to make some modifications.
 */
export class AOCoreProcessRouter extends EventEmitter
    implements AORouterInterface {
    public process: AORouterCoreProcessPretender;
    private processIdentifier;
    private requestCount = 0;

    constructor() {
        super();
        this.processIdentifier = Math.random()
            .toString(36)
            .substring(5);
        this.process = new AORouterCoreProcessPretender();
        this.process.setMaxListeners(32);
        this.process.on("message", this._routeMessage.bind(this));
        this.send("ready");
    }

    /**
     * _routeMessage is used to wrap the incoming request
     * with a set of callbacks to respond directly to that
     * request
     *
     * @param message
     */
    private _routeMessage(message: IAORouterMessage) {
        if (message.responseId) {
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
            reject: this._routeMessageResponse.bind(this, message, true)
        };
        this.emit(message.event, incomingRequest);
    }

    private _routeMessageResponse(
        originatingMessage: IAORouterMessage,
        isReject: boolean,
        responseData: any
    ) {
        const outgoingResponse: IAORouterMessage = {
            routerMessageId: originatingMessage.routerMessageId,
            requestId: originatingMessage.requestId,
            responseId: originatingMessage.requestId,
            event: originatingMessage.event,
            ethAddress: originatingMessage.ethAddress,
            data: !isReject ? responseData : undefined,
            error: isReject ? serializeError(responseData) : undefined
        };
        this.process.send(outgoingResponse);
    }

    /**
     * Send-to-Router is wrapped in a promise for process
     * abstraction and better handling of responses.
     *
     * @param event
     * @param data
     * @returns Promise<any>
     */
    public send(
        event: string,
        data?: any,
        routerParams?: IAORouterMessageRouterParams
    ): Promise<any> {
        // TODO: if we are sending a stream, make sure our stdio fd is not in use!
        // If so we need to move this onto a queue
        return new Promise((resolve, reject) => {
            const requestId = `${this.processIdentifier}:${++this
                .requestCount}`;
            const request: IAORouterMessage = {
                requestId,
                event,
                data,
                routerParams: routerParams || {}
            };
            this.process.send(request, (error?: Error) => {
                if (error) {
                    return reject(error);
                }
                const messageResponseListener = (message: any) => {
                    if (message.requestId === request.requestId) {
                        this.process.removeListener(
                            "message",
                            messageResponseListener
                        );
                        if (message.error) {
                            reject(deserializeError(message.error));
                        } else {
                            resolve(message);
                        }
                    }
                };
                this.process.addListener("message", messageResponseListener);
            });
        });
    }
}

// These arguments are passed to each subprocess when spawned by the AORouter
export interface AORouterSubprocessArgs {
    storageLocation: string;
    httpOrigin: string;
    coreOrigin: string;
    corePort: number;
    ethNetworkRpc: string;
    debug?: Function;
}

/**
 * AORouterInterface
 *
 * Simple wrapper around the process router for now, but
 * will extend to handle lifecycle events as well.
 */
export default abstract class AORouterSubprocessInterface {
    router: AOSubprocessRouter;
    private unhandledRejections: Map<Promise<any>, any>;

    constructor(routerArgs: AORouterSubprocessArgs) {
        this.router = new AOSubprocessRouter();
        this.unhandledRejections = new Map();
        process.on("unhandledRejection", (reason, p) => {
            this.unhandledRejections.set(p, reason);
        });
        process.on("rejectionHandled", p => {
            this.unhandledRejections.delete(p);
        });
        process.on("uncaughtException", error => {
            routerArgs.debug("Uncaught exception:", error);
        });
        process.on("SIGINT", () => {
            process.exit();
        });
        process.on("SIGTERM", () => {
            process.exit();
        });
        process.on("exit", () => {
            this.unhandledRejections.forEach((p, reason) => {
                routerArgs.debug(
                    "Unhandled Rejection at:",
                    p,
                    "reason:",
                    reason
                );
            });
            routerArgs.debug(
                `process exiting with ${
                    this.unhandledRejections.size
                } unhandled rejections.`
            );
        });
        // Keep subprocess running even if event loop empties
        // This prevents from early termination of a process
        // that may still handle/receive events while being idle.
        // process.stdin.resume();
    }
}

export abstract class AORouterCoreProcessInterface {
    router: AOCoreProcessRouter;

    constructor() {
        this.router = new AOCoreProcessRouter();
    }
}

export interface SerializedError {
    type: "__error";
    name: string;
    message: string;
    stack: string;
}

export function serializeError(error?: Error): SerializedError {
    let err = error instanceof Error ? error : new Error(error);
    return {
        type: "__error",
        name: err.name,
        message: err.message,
        stack: err.stack
    };
}
export function deserializeError(serialized?: SerializedError): Error {
    if (!serialized || serialized.type !== "__error") return serialized;
    let error = new Error();
    error.name = serialized.name;
    error.message = serialized.message;
    error.stack = serialized.stack;
    return error;
}
