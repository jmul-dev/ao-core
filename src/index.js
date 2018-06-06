'use strict';
import * as CONSTANTS from './constants';
import { spawn } from "child_process";
import express from "express";
import { json } from "body-parser";
import { graphqlExpress, graphiqlExpress } from "apollo-server-express";
import graphql from "graphql";
import schema from "./graphql/schema";
import Database from "./storage/database";
import { notEqual } from "assert";
import { join } from "path";
import IpcServer from "./interfaces/ipc-server";
import Debug from 'debug';
const debug = Debug('ao:core')
const error = Debug('ao:core:error')


export const AO_CONSTANTS = CONSTANTS;

export default class Core extends IpcServer {
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
            process.send({event: AO_CONSTANTS.EVENT_LOG, message: message});
        } else {
            // TODO: append to a temp log somewhere (make this configurable via command line)
        }
        this.db.Log.create({message: message});
    }
    ipcLogListener() {
        this.ipc.server.on(AO_CONSTANTS.EVENT_LOG, this.sendEventLog.bind(this));
    }
    ipcListenersThatPropogateToDb() {
        notEqual(this.db, null, 'ipcListenersThatPropogateToDb called without db instantiated')
        this.ipc.server.on(AO_CONSTANTS.DATA, (data) => {           
            switch(data.type) {
                case AO_CONSTANTS.DATA_TYPES.PEER_CONNECTED:
                    return this.db.Peer.findOrCreate({where: {id: data.peerId}})
                case AO_CONSTANTS.DATA_TYPES.PEER_DISCONNECTED:
                    return this.db.Peer.destroy({where: { id: data.peerId }})
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
        expressServer.use('/graphql', json(), graphqlExpress({ schema: graphqlSchema }));
        expressServer.get('/graphiql', graphiqlExpress({ endpointURL: '/graphql' })); // TODO: enable based on process.env.NODE_ENV
        this.server = expressServer.listen(this.options.httpPort, () => {
            debug('Express server running on port: ' + this.server.address().port);
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
        const dbConnecitonPromise = this.db === null ? Promise.resolve() : this.db.close()
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