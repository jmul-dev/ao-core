"use strict";
import { EVENT_LOG, NETWORK_CHANGE, DATA, DATA_TYPES } from "./constants";
import AORouter from "./router/AORouter";
import { IAORouterRequest } from "./router/AORouterInterface";
import Http, { IGraphqlResolverContext } from "./http";
import { EventEmitter } from "events";
import path from "path";
import AOUserSession from "./AOUserSession";
import exportDataResolver, {
    IContentExport_Args
} from "./graphql/resolvers/resolveExportData";
import importDataResolver, {
    IContentImport_Args
} from "./graphql/resolvers/resolveImportData";
import registerResolver, {
    IRegister_Args
} from "./graphql/resolvers/resolveRegister";
import fsExtra from "fs-extra";
import Debug, { debugLogFile } from "./AODebug";

const debugLog = Debug("ao:core");
const errorLog = Debug("ao:core:error");

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

export const AOCoreState = Object.freeze({
    INITIAL_STATE: "INITIAL_STATE",
    LOGS_INTIALIZING: "LOGS_INTIALIZING",
    LOGS_INTIALIZED: "LOGS_INTIALIZED",
    ROUTER_INITIALIZING: "ROUTER_INITIALIZING",
    ROUTER_INITIALIZED: "ROUTER_INITIALIZED",
    HTTP_INITIALIZING: "HTTP_INITIALIZING",
    HTTP_INITIALIZED: "HTTP_INITIALIZED",
    SESSION_INITIALIZED: "SESSION_INITIALIZED",
    INITIALIZATION_FAILED: "INITIALIZATION_FAILED",
    SHUTDOWN_ERROR: "SHUTDOWN_ERROR",
    STARTED: "STARTED"
});

export default class Core extends EventEmitter {
    public options: ICoreOptions;
    private coreRouter: AORouter;
    private http: Http;
    private userSession: AOUserSession;
    private state: String;
    public static DEFAULT_OPTIONS = {
        ethAddress: "",
        networkId: "1",
        disableHttpInterface: false,
        corePort: 3003,
        coreOrigin: "http://localhost",
        httpOrigin: "http://localhost:3000",
        storageLocation: path.resolve(__dirname, "..", "data"),
        desktopLocation: undefined,
        nodeBin: process.execPath,
        exportData: "", // Takes a path for where the data is exported to
        importData: "" // Takes a path to the zip file
    };

    constructor(args: ICoreOptions = Core.DEFAULT_OPTIONS) {
        super();
        this.options = Object.assign({}, Core.DEFAULT_OPTIONS, args);
        debugLog(`Starting core with options:`);
        debugLog(this.options);
        process.stdin.resume(); // Hack to keep the core processes running
        process.on("exit", () => {
            if (this.coreRouter) {
                this.coreRouter.shutdown(); //Ensure that all child processes are killed
            }
            debugLog("Core process exiting...");
        });
        process.on("SIGINT", () => {
            process.exit();
        });
        this.state = AOCoreState.INITIAL_STATE;
        this.stateChangeHandler(AOCoreState.INITIAL_STATE);
    }

    /**
     * The core initialization process is handled through this state machine. Each
     * part of the init process will trigger an additional call to `stateChangeHandler`.
     *
     * @param nextState
     * @param errorMessage
     */
    private stateChangeHandler(nextState, errorMessage?) {
        this.state = nextState;
        switch (nextState) {
            case AOCoreState.INITIAL_STATE:
                this.logsInitializer();
                break;
            case AOCoreState.LOGS_INTIALIZED:
                // Logs have been initialized, now we start the core router
                this.coreRouterInitializer();
                break;
            case AOCoreState.ROUTER_INITIALIZED:
                this.sessionInitializer();
                break;
            case AOCoreState.SESSION_INITIALIZED:
                if (!this.options.disableHttpInterface) {
                    this.httpInitializer();
                } else {
                    this.stateChangeHandler(AOCoreState.STARTED);
                }
                break;
            case AOCoreState.HTTP_INITIALIZED:
                this.stateChangeHandler(AOCoreState.STARTED);
                break;
            case AOCoreState.STARTED:
                this.postInitializationWork();
                break;
            case AOCoreState.INITIALIZATION_FAILED:
            case AOCoreState.SHUTDOWN_ERROR:
                // TODO: shutdown?
                this.handleShutdown(errorMessage);
                break;
            default:
                break;
        }
        // TODO: emit state change (pass back up to electron/parent process)
    }

    private logsInitializer() {
        this.state = AOCoreState.LOGS_INTIALIZING;
        if (process.platform === "win32") {
            //Windows has a hard time dealing with filesystem stuff, can't delete something we're writing into.
            this.stateChangeHandler(AOCoreState.LOGS_INTIALIZED);
        } else {
            // Remove previous log file
            const logFilePath = path.join(
                this.options.storageLocation,
                debugLogFile
            );
            fsExtra
                .remove(logFilePath)
                .then(() => {
                    this.stateChangeHandler(AOCoreState.LOGS_INTIALIZED);
                })
                .catch(error => {
                    errorLog(
                        `Error removing previous log file at: ${logFilePath}.`,
                        error
                    );
                    this.stateChangeHandler(
                        AOCoreState.INITIALIZATION_FAILED,
                        `Unable to locate log file`
                    );
                });
        }
    }

    private coreRouterInitializer() {
        this.coreRouter = new AORouter(this.options);
        this.coreRouter
            .init()
            .then(() => {
                // Core router event handlers
                this.coreRouter.router.on(
                    "/core/log",
                    this._handleLog.bind(this)
                );
                this.coreRouter.router.on(
                    "/core/networkIdMismatch",
                    this._handleNetworkIdMismatch.bind(this)
                );
                this.stateChangeHandler(AOCoreState.ROUTER_INITIALIZED);
            })
            .catch(error => {
                errorLog(`Error initializing core router:`, error);
                this.stateChangeHandler(
                    AOCoreState.INITIALIZATION_FAILED,
                    `Unable to start core router`
                );
            });
    }

    private sessionInitializer() {
        this.userSession = new AOUserSession(this.coreRouter.router);
        this.stateChangeHandler(AOCoreState.SESSION_INITIALIZED);
    }

    private httpInitializer() {
        this.http = new Http(
            this.coreRouter.router,
            this.options,
            this.userSession
        );
        this.stateChangeHandler(AOCoreState.HTTP_INITIALIZED);
    }

    private postInitializationWork() {
        this.processCommandLineArgs(this.options);
    }

    private processCommandLineArgs(args: ICoreOptions) {
        const { exportData, importData, ethAddress, networkId } = args;
        const context: IGraphqlResolverContext = {
            router: this.coreRouter.router,
            options: this.options,
            userSession: this.userSession
        };
        const empty: object = {}; //Need an empty object?

        if (ethAddress.length && networkId) {
            const registerArgs: IRegister_Args = {
                inputs: {
                    ethAddress: ethAddress,
                    networkId: networkId
                }
            };
            registerResolver(empty, registerArgs, context, empty)
                .then(() => {
                    debugLog(
                        `ethAddress set as ${ethAddress} and networkId is ${networkId}`
                    );
                })
                .catch(error => {
                    errorLog(error);
                });
        }

        //Exports data
        if (exportData.length) {
            const exportArgs: IContentExport_Args = {
                inputs: { exportPath: exportData }
            };
            exportDataResolver(empty, exportArgs, context, empty)
                .then(() => {
                    debugLog(
                        "Export finished. Export should be at: " + exportData
                    );
                })
                .catch(error => {
                    errorLog("Bad news, export failed: ", error);
                });
        }

        //Imports data
        if (importData.length) {
            const importArgs: IContentImport_Args = {
                inputs: {
                    importPath: importData,
                    commandLine: true
                }
            };
            importDataResolver(empty, importArgs, context, empty)
                .then(() => {
                    debugLog("Import finished. Please restart AO!");
                    this.coreRouter.shutdown();
                    process.exit(0);
                })
                .catch(error => {
                    errorLog("Really bad news, import failed: ", error);
                });
        }
    }

    private handleShutdown(errorMessage?) {
        this.coreRouter.shutdown();
        if (errorMessage) {
            errorLog("core shutting down with error\n", errorMessage);
            process.exit(1);
        } else {
            debugLog(`Core shutting down...`);
        }
    }

    _handleLog(request: IAORouterRequest) {
        const data: AOCore_Log_Data = request.data;
        if (process.send) {
            // If there is a parent process (running within app) we relay
            // all of the logs up.
            process.send({ event: EVENT_LOG, message: data.message });
        } else {
            // TODO: append to a temp log somewhere (make this configurable via command line)
        }
        this.coreRouter.router
            .send("/db/logs/insert", {
                message: data.message,
                createdAt: Date.now()
            })
            .then(request.respond)
            .catch(request.reject);
        this.emit("log", { message: data.message });
    }

    _handleNetworkIdMismatch(request: IAORouterRequest) {
        const { newNetworkId } = request.data;
        if (process.send) {
            process.send({
                event: NETWORK_CHANGE,
                newNetworkId: newNetworkId
            });
        } else {
            //Self kill if network id change happens
            this.stateChangeHandler(
                AOCoreState.SHUTDOWN_ERROR,
                `Core shutting down due to Ethereum network id mismatch. This is likely a result of switching Ethereum networks.`
            );
        }
    }
}
