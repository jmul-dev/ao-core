import { EventEmitter } from "events";
import { IAORouterMessage } from "./AORouter";

/**
 * AORouterCoreProcessPretender
 * 
 * In order to keep the AORouter clean, we are making the core router
 * interface appear as a "process", or at least have the same 
 * methods that the subprocesses would use to communicate up to
 * the router.
 */
export default class AORouterCoreProcessPretender extends EventEmitter {

    send(message: IAORouterMessage, callback?: (error?: Error) => void): boolean {
        this.emit('message', message)
        if ( typeof callback === 'function' )
            callback()
        return true;
    }

}