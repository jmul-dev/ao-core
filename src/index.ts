'use strict';
import { EVENT_LOG, DATA, DATA_TYPES } from './constants';
import AORouter from './router/AORouter';
import { IAORouterRequest } from './router/AORouterInterface';
import Http from './http'
import { EventEmitter } from 'events';
import path from 'path';
import AOUserSession from './AOUserSession';
import Debug from './AODebug'
const debug = Debug('ao:core');
const error = Debug('ao:core:error');


export interface ICoreOptions {
    disableHttpInterface: boolean;
    corePort: number;
    coreOrigin: string;
    httpOrigin: string;
    storageLocation: string;
    nodeBin: string;
}

export interface AOCore_Log_Data {
    message: string;
}

export default class Core extends EventEmitter {
    public static DEFAULT_OPTIONS = {
        disableHttpInterface: false,
        corePort: 3003,
        coreOrigin: 'http://localhost',
        httpOrigin: 'http://localhost:3000',
        storageLocation: path.resolve(__dirname, '..', 'data'),
        nodeBin: process.execPath,
    }
    public options: ICoreOptions;
    private coreRouter: AORouter;
    private http: Http;
    private userSession: AOUserSession;

    constructor(args: ICoreOptions = Core.DEFAULT_OPTIONS) {
        super()
        this.options = Object.assign({}, Core.DEFAULT_OPTIONS, args)
        debug(this.options)
        this.coreRouter = new AORouter(this.options)
        this.coreRouter.init()
        this.coreRouter.router.on('/core/log', this._handleLog.bind(this))
        this.userSession = new AOUserSession( this.coreRouter.router )
        this.http = new Http(this.coreRouter.router, this.options, this.userSession)
        process.stdin.resume();  // Hack to keep the core processes running
        process.on('exit', () => {
            this.coreRouter.shutdown()//Ensure that all child processes are killed
            debug('Core process exiting...')
        })
        process.on('SIGINT', () => {
            process.exit()
        })
    }
    
    _handleLog(request: IAORouterRequest) {
        const data: AOCore_Log_Data = request.data
        if ( process.send ) {
            // If there is a parent process (running within app) we relay
            // all of the logs up.
            process.send({event: EVENT_LOG, message: data.message});
        } else {
            // TODO: append to a temp log somewhere (make this configurable via command line)
        }        
        this.coreRouter.router.send('/db/logs/insert', {
            message: data.message,
            createdAt: Date.now()
        }).then(request.respond).catch(request.reject)
        this.emit('log', {message: data.message})
    }
  
    shutdownWithError(err) {
        error('core shutting down with error\n', err);
        this.coreRouter.shutdown()
        process.exit(1);
    }
    
}