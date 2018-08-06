'use strict';
import { EVENT_LOG, DATA, DATA_TYPES } from './constants';
import AORouter from './router/AORouter';
import { ICoreOptions } from './bin';
import { IAORouterRequest } from './router/AORouterInterface';

import Http from './modules/http/http'

import Debug from 'debug';
const debug = Debug('ao:core');
const error = Debug('ao:core:error');


export interface AOCore_Log_Data {
    message: string;
}

export default class Core {
    public options: ICoreOptions;
    private coreRouter: AORouter;
    private http: Http;

    constructor(args) {
        debug(args)
        this.options = args
        this.coreRouter = new AORouter(args)
        this.coreRouter.init()
        // TODO: setup coreRouter event listeners (eg: http shutdown/error)
        this.coreRouter.router.on('/core/log', this._handleLog.bind(this))
        process.stdin.resume();  // Hack to keep the core processes running
        const httpOptions = {
            ...args
        }
        this.http = new Http(this.coreRouter.router, httpOptions)
    }

    // NOTE: this is useful for sending event logs up to the 
    // electron wrapper (if exists) without going through the http
    // interface. 
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
    }
  
    shutdownWithError(err) {
        error('core shutting down with error\n', err);
        this.coreRouter.shutdown()
        process.exit(1);
    }
    
}