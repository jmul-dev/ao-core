import assert from "assert";
import Debug from 'debug';
const debug = Debug('ao:db');

class Database {
    private videos: Object = {};
    private peers: Object = {};
    private logs: Array<{}> = [];
    public async init() {
        return Promise.resolve();
    }
    public async close() {
        return Promise.resolve();
    }
    public addPeer(peerId: string) {
        this.peers[peerId] = {
            id: peerId,
            dateCreated: Date.now()
        }
    }
    public removePeer(peerId: string) {
        delete this.peers[peerId]
    }
    /**
     * Logs
     */
    public addLog(log) {
        this.logs.push({
            ...log,
            dateCreated: Date.now()
        })
    }
    public getLogs() {
        return this.logs
    }
}

export default Database;