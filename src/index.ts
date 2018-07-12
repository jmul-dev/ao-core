'use strict';
import { EVENT_LOG, DATA, DATA_TYPES } from './constants';
import { spawn, ChildProcess } from "child_process";
import path from 'path';
import express = require('express');
import { json } from "body-parser";
import { graphqlExpress, graphiqlExpress } from "apollo-server-express";
import { apolloUploadExpress } from 'apollo-upload-server'
import schema from "./graphql/schema";
import Database from "./storage/database";
import { notEqual } from "assert";
import Debug from 'debug';
import { Server, AddressInfo } from 'net';
import cors from 'cors';
import Registry from './messaging/registry';
import Router from './messaging/router';
import Message from './messaging/message';

const debug = Debug('ao:core');
const error = Debug('ao:core:error');

//test
import md5 from 'md5'
import fs from 'fs'
import Http from './main/http';


export default class Core {
    public options: {
        httpPort: number;
        disableHttpInterface: boolean;
    };
    private db: Database;
    private http: Http;
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
            
            this.spinUpSubProcesses()
            .then( () => {
                //we've made above promise based since we need the router to be present for this shiz
                if ( !this.options.disableHttpInterface ) {
                    this.http = new Http( 
                        this.db, 
                        this.router,
                        this.options,
                        this.sendEventLog,
                        this.shutdownWithError
                    )
                    this.http.init()
                    .then((server) => {
                        //this.server = server
                    })
                    .catch(e => error )

                }
            })
            .catch(e => {
                error(e)
            })
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
    async spinUpSubProcesses() {
        return new Promise( (resolve,reject) => {
            debug('attempting to spawn sub processes')
            //Maybe pass the registry json itself over at the time of Registry contruction?
            this.registry = new Registry()
            this.registry.initialize( )
            .then( (router:Router) => {
                this.router = router
                this.router.loadProcesses()
                .then(() => {
                    resolve()
                })
                .catch(e => {
                    reject(e)
                    error(e)
                })
            })
            .catch((e) => {
                reject(e)
                error(e)
            })
        })
    }
}