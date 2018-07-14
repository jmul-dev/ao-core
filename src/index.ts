'use strict';
import { EVENT_LOG, DATA, DATA_TYPES } from './constants';
import { ChildProcess } from "child_process";
import Debug from 'debug';
import { Server } from 'net';
import Registry from './messaging/registry';
import Router from './messaging/router';

const debug = Debug('ao:core');
const error = Debug('ao:core:error');

//Main classes
import Database from "./main/database";
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
        this.registry = new Registry()
        this.registry.initialize( )
        .then( (router:Router) => {
            this.router = router
        })
        .then( this.dbSetup.bind(this) )
        .then( this.spinUpSubProcesses.bind(this) )
        .then( this.httpSetup.bind(this) )
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
            this.db = new Database( this.router )
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

    httpSetup() {
        return new Promise((resolve, reject) => {
            if ( !this.options.disableHttpInterface ) {
                this.http = new Http( 
                    this.db, 
                    this.router,
                    this.options,
                    this.sendEventLog,
                    this.shutdownWithError
                )
                this.http.init()
                .then((server:Server) => {
                    this.server = server
                    resolve()
                })
                .catch(e => {
                    reject(e)
                })
            }
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
            
            this.router.loadProcesses()
            .then(() => {
                resolve()
            })
            .catch(e => {
                reject(e)
            })
        })
    }
}