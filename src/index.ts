'use strict';
import { EVENT_LOG, DATA, DATA_TYPES } from './constants';
import AORouter from './router/AORouter';
import { ICoreOptions } from './bin';
import { IAORouterRequest } from './router/AORouterInterface';
import Debug from 'debug';
const debug = Debug('ao:core');
const error = Debug('ao:core:error');


export default class Core {
    public options: ICoreOptions;
    private coreRouter: AORouter;

    constructor(args) {
        debug(args)
        this.options = args
        this.coreRouter = new AORouter(args)
        this.coreRouter.init()
        // TODO: setup coreRouter event listeners (eg: http shutdown/error)
        this.coreRouter.router.on('/core/log', this._handleLog.bind(this))
        process.stdin.resume();  // Hack to keep the core processes running
    }

    _handleLog(request: IAORouterRequest) {
        debug('/core/log', request)
        // request.respond(null)
    }

    sendEventLog(message) {
        if ( process.send ) {
            // If there is a parent process (running within app) we relay
            // all of the logs up.
            process.send({event: EVENT_LOG, message: message});
        } else {
            // TODO: append to a temp log somewhere (make this configurable via command line)
        }
        // TODO: implement db calls
        this.coreRouter.router.send('/db/core/store', {
            table: 'logs',
            data: {
                message,
                dateCreated: Date.now()
            }
        })
    }
  
    shutdownWithError(err) {
        error('core shutting down with error\n', err);
        this.coreRouter.shutdown()
        process.exit(1);
    }
    
}