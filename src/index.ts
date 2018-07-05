'use strict';
import { EVENT_LOG, DATA, DATA_TYPES } from './constants';
import { spawn, ChildProcess } from "child_process";
import path from 'path';
import express = require('express');
import { json } from "body-parser";
import { graphqlExpress, graphiqlExpress } from "apollo-server-express";
import schema from "./graphql/schema";
import Database from "./storage/database";
import { notEqual } from "assert";
import Debug from 'debug';
import { Server, AddressInfo } from 'net';
import cors from 'cors';
import Registry from './messaging/registry';
import Router from './messaging/router';

const debug = Debug('ao:core');
const error = Debug('ao:core:error');


export default class Core {
    public options: {
        httpPort: number;
        disableHttpInterface: boolean;
    };
    private db: Database;
    private server: Server;
    private subProcesses: Array<ChildProcess>;

    constructor(args) {
        debug(args)
        this.options = args
        this.db = null
        this.server = null
        this.subProcesses = []
    }

    init() {
        this.dbSetup()
        .then(()=> {
            if ( !this.options.disableHttpInterface ) {
                this.httpSetup()
            }
            this.spinUpSubProcesses()
        })
        .catch( (e) => {
            this.shutdownWithError(e)
        })
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
        notEqual(this.db, null, 'http server requires instance of db');
        const expressServer = express();
        const graphqlSchema = schema(this.db);
        expressServer.use('/graphql', cors({origin: 'http://localhost:3000'}), json(), graphqlExpress({ schema: graphqlSchema }));
        expressServer.get('/graphiql', graphiqlExpress({ endpointURL: '/graphql' })); // TODO: enable based on process.env.NODE_ENV
        expressServer.use('/assets', express.static(path.join(__dirname, '../assets')));
        this.server = expressServer.listen(this.options.httpPort, () => {
            const address: AddressInfo = <AddressInfo> this.server.address();
            debug('Express server running on port: ' + address.port);
            this.sendEventLog('Core http server started');
        });
        this.server.on('error', this.shutdownWithError.bind(this));
    }

    shutdownWithError(err) {
        error('core shutting down with error\n', err);
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
    registry:Registry;
    router: Router;
    registry_data: Array<any>;
    spinUpSubProcesses() {
        debug('attempting to spawn sub processes')
        //Maybe pass the registry json itself over at the time of Registry contruction?
        this.registry = new Registry()
        this.registry.initialize( )
        .then( (router:Router) => {
            this.router = router
            this.router.loadProcesses() // IPC server stuff will taken out
            .catch(e => {
                error(e)
            })
        })
        .catch((e) => {
            error(e)
        })
    }
}