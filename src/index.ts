'use strict';
import { EVENT_LOG, DATA, DATA_TYPES } from './constants';
import { spawn, ChildProcess } from "child_process";
import express = require('express');
import { json } from "body-parser";
import { graphqlExpress, graphiqlExpress } from "apollo-server-express";
import schema from "./graphql/schema";
import Database from "./storage/database";
import { notEqual } from "assert";
import { join } from "path";
import IpcServer from "./interfaces/ipc-server";
import Debug from 'debug';
import { Server, AddressInfo } from 'net';
import cors from 'cors';
const debug = Debug('ao:core');
const error = Debug('ao:core:error');


export default class Core extends IpcServer {
    public options: {
        httpPort: number;
        ipcServerId: string;
        disableHttpInterface: boolean;
    };
    private db: Database;
    private server: Server;
    private subProcesses: Array<ChildProcess>;
    constructor(args) {
        debug(args)
        super(args.ipcServerId)
        this.options = args
        this.db = null
        this.server = null
        this.subProcesses = []
    }
    sendEventLog(message) {
        if ( process.send ) {
            // If there is a parent process (running within app) we relay
            // all of the logs up.
            process.send({event: EVENT_LOG, message: message});
        } else {
            // TODO: append to a temp log somewhere (make this configurable via command line)
        }
        this.db.addLog({message: message});
    }
    ipcLogListener() {
        this.ipc.server.on(EVENT_LOG, this.sendEventLog.bind(this));
    }
    ipcListenersThatPropogateToDb() {
        notEqual(this.db, null, 'ipcListenersThatPropogateToDb called without db instantiated')
        this.ipc.server.on(DATA, (data) => {           
            switch(data.type) {
                case DATA_TYPES.PEER_CONNECTED:
                    return this.db.addPeer(data.peerId)
                case DATA_TYPES.PEER_DISCONNECTED:
                    return this.db.removePeer(data.peerId)
                default:
                    return null
            }
        });
    }
    dbSetup() {
        return new Promise((resolve, reject) => {
            this.db = new Database()
            this.db.init().then(() => {
                debug('database instance created')
                this.sendEventLog('Core database connected');
                resolve()
            }).catch(err => {
                error('error creating database instance', err)
                reject(err)
            })
        })
        
    }
    /**
     * Note that the http server depends on both the ipc server AND the database
     */
    httpSetup() {
        notEqual(this.ipc, null, 'http server requires instance of ipc server');
        notEqual(this.db, null, 'http server requires instance of db');
        const expressServer = express();
        const graphqlSchema = schema(this.db);
        expressServer.use('/graphql', cors({origin: 'http://localhost:3000'}), json(), graphqlExpress({ schema: graphqlSchema }));
        expressServer.get('/graphiql', graphiqlExpress({ endpointURL: '/graphql' })); // TODO: enable based on process.env.NODE_ENV
        this.server = expressServer.listen(this.options.httpPort, () => {
            const address: AddressInfo = <AddressInfo> this.server.address();
            debug('Express server running on port: ' + address.port);
            this.sendEventLog('Core http server started');
        });
        this.server.on('error', this.shutdownWithError.bind(this));
    }
    shutdownWithError(err) {
        error('core shutting down with error\n', err);
        if ( this.ipc && this.ipc.server )
            this.ipc.server.stop();
        if ( this.server !== null && this.server.close )
            this.server.close();
        const dbConnecitonPromise: PromiseLike<void> = this.db === null ? Promise.resolve() : this.db.close()
        dbConnecitonPromise.then(() => {
            for (let i = 0; i < this.subProcesses.length; i++) {
                const subprocess = this.subProcesses[i];
                subprocess.kill();
            }
            process.exit(1);
        })
    }
    spinUpSubProcesses() {
        debug('attempting to spawn sub processes')
        const p2pSubProcess = spawn('node', [join(__dirname, '../dist/p2p/index.js'), '--ipcServerId', this.options.ipcServerId], {stdio: ['inherit', 'inherit', 'inherit']})
        p2pSubProcess.on('error', (err) => {
            error('p2pSubProcess failed to start: ', err)
        })
        p2pSubProcess.on('close', (code) => {
            debug('p2pSubProcess closed on us with code: ', code)
        })
        this.subProcesses.push(p2pSubProcess)
    }
}