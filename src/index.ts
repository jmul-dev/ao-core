'use strict';
import { EVENT_LOG, NETWORK_CHANGE, DATA, DATA_TYPES } from './constants';
import AORouter from './router/AORouter';
import { IAORouterRequest } from './router/AORouterInterface';
import Http, { IGraphqlResolverContext } from './http'
import { EventEmitter } from 'events';
import path from 'path';
import AOUserSession from './AOUserSession';
import exportDataResolver, { IContentExport_Args } from './graphql/resolvers/resolveExportData'
import importDataResolver, { IContentImport_Args } from './graphql/resolvers/resolveImportData';
import registerResolver, { IRegister_Args } from './graphql/resolvers/resolveRegister';
import fsExtra from 'fs-extra'
import Debug, { debugLogFile } from './AODebug'

const debug = Debug('ao:core');
const error = Debug('ao:core:error');


export interface ICoreOptions {
    ethAddress: string;
    networkId: string;
    disableHttpInterface: boolean;
    corePort: number;
    coreOrigin: string;
    httpOrigin: string;
    storageLocation: string;
    nodeBin: string;
    exportData: string;
    importData: string;
}

export interface AOCore_Log_Data {
    message: string;
}

export interface AOCore_NetworkIdMismatch_Data {
    newNetworkId: string;
}

export default class Core extends EventEmitter {
    public static DEFAULT_OPTIONS = {
        ethAddress: '',
        networkId: '1',
        disableHttpInterface: false,
        corePort: 3003,
        coreOrigin: 'http://localhost',
        httpOrigin: 'http://localhost:3000',
        storageLocation: path.resolve(__dirname, '..', 'data'),
        desktopLocation: undefined,
        nodeBin: process.execPath,
        exportData: '', // Takes a path for where the data is exported to
        importData: '', // Takes a path to the zip file
    }
    public options: ICoreOptions;
    private coreRouter: AORouter;
    private http: Http;
    private userSession: AOUserSession;

    constructor(args: ICoreOptions = Core.DEFAULT_OPTIONS) {
        super()
        this.options = Object.assign({}, Core.DEFAULT_OPTIONS, args)
        debug(this.options)
        // Overwriting previous debug logs before starting
        if(process.platform === "win32") {
            //Windows has a hard time dealing with filesystem stuff, can't delete something we're writing into.
            this._init(args)
        } else {
            fsExtra.remove(path.join(this.options.storageLocation, debugLogFile)).then(() => {
                this._init(args)
            }).catch(console.log)
        }
    }
    private _init(args) {
        this.coreRouter = new AORouter(this.options)
        this.coreRouter.init().then(() => {
            this.coreRouter.router.on('/core/log', this._handleLog.bind(this))
            this.coreRouter.router.on('/core/networkIdMismatch', this._handleNetworkIdMismatch.bind(this))
            this.userSession = new AOUserSession(this.coreRouter.router)
            this.http = new Http(this.coreRouter.router, this.options, this.userSession)
            //Used to handle things like data exports and other command line only options
            this._handleCommandline(args)
        }).catch(debug)
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
        if (process.send) {
            // If there is a parent process (running within app) we relay
            // all of the logs up.
            process.send({ event: EVENT_LOG, message: data.message });
        } else {
            // TODO: append to a temp log somewhere (make this configurable via command line)
        }
        this.coreRouter.router.send('/db/logs/insert', {
            message: data.message,
            createdAt: Date.now()
        }).then(request.respond).catch(request.reject)
        this.emit('log', { message: data.message })
    }

    _handleNetworkIdMismatch(request: IAORouterRequest) {
        const { newNetworkId } = request.data
        if (process.send) {
            process.send( {
                event: NETWORK_CHANGE,
                newNetworkId: newNetworkId
            })
        } else {
            //Self kill if network id change happens
            this.shutdownWithError(new Error('networkId changed'))
        }
    }

    _handleCommandline(args: ICoreOptions) {
        const { exportData, importData, ethAddress, networkId } = args
        const context: IGraphqlResolverContext = {
            router: this.coreRouter.router,
            options: this.options,
            userSession: this.userSession
        }
        const empty: object = {} //Need an empty object?

        if (ethAddress.length && networkId) {
            const registerArgs: IRegister_Args = {
                inputs: {
                    ethAddress: ethAddress,
                    networkId: networkId
                }
            }
            registerResolver(empty, registerArgs, context, empty).then(() => {
                debug(`ethAddress set as ${ethAddress} and networkId is ${networkId}`)
            }).catch((error) => {
                error(error)
            })
        }

        //Exports data
        if (exportData.length) {
            const exportArgs: IContentExport_Args = {
                inputs: { exportPath: exportData }
            }
            exportDataResolver(empty, exportArgs, context, empty).then(() => {
                debug('Export finished. Export should be at: ' + exportData)
            }).catch((error) => {
                error('Bad news, export failed: ', error)
            })
        }

        //Imports data
        if (importData.length) {
            const importArgs: IContentImport_Args = {
                inputs: {
                    importPath: importData,
                    commandLine: true
                }
            }
            importDataResolver(empty, importArgs, context, empty).then(() => {
                debug('Import finished. Please restart AO!')
                this.coreRouter.shutdown()
                process.exit(0);
            }).catch((error) => {
                error('Really bad news, import failed: ', error)
            })
        }
    }

    shutdownWithError(err) {
        error('core shutting down with error\n', err);
        this.coreRouter.shutdown()
        process.exit(1);
    }

}