'use strict';
import { IPC } from "node-ipc";
import EventEmitter from "events";

class IpcServer extends EventEmitter {
    constructor(serverId) {
        super()
        this.ipc = new IPC();
        this.ipc.config.id = serverId;
        this.ipc.config.silent = true;
        this.ipc.serve();
        this.ipc.server.start();
        this.ipc.server.on('error', () => {
            this.emit('ipc:server:error', error)
        });
        this.ipc.server.on('start', () => {
            this.emit('ipc:server:start')
        });
    }
}
export default IpcServer;