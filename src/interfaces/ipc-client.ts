'use strict';
import { IPC } from "node-ipc";
import { IPC_SERVER_ID } from "../constants.js";
import { EventEmitter } from "events";

class IpcClient extends EventEmitter {
    ipcServerId: string;
    ipc: IPC;
    constructor(clientId: string, serverId: string) {
        super()
        this.ipcServerId = serverId
        this.ipc = new IPC();
        this.ipc.config.id = clientId;
        this.ipc.config.silent = true;
        this.ipc.retry = 1500;
        this.ipc.connectTo(this.ipcServerId, () => {            
            this.ipc.of[this.ipcServerId].on('connect', () => {
                this.emit('ipc:client:connect')
            })
        })        
    }
    ipcClient() {
        return this.ipc.of[this.ipcServerId]
    }
}
export default IpcClient;