"use strict";
import { EVENT_LOG, NETWORK_CHANGE, DATA, DATA_TYPES } from "./constants";
import AORouter, { IAORouterMessage } from "./router/AORouter";
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
import { IAOETH_Init_Data } from "./modules/eth/eth";
import { AOP2P_Init_Data } from "./modules/p2p/p2p";

const debugLog = Debug("ao:core");
const errorLog = Debug("ao:core:error");
const initializationStateLog = Debug("ao:initialization");

export interface ICoreOptions {
    ethAddress: string;
    ethNetworkId: string;
    ethNetworkRpc: string;
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
    CORE_DBS_INITIALIZING: "CORE_DBS_INITIALIZING",
    CORE_DBS_INITIALIZED: "CORE_DBS_INITIALIZED",
    ETH_MODULE_INITIALIZING: "ETH_MODULE_INITIALIZING",
    ETH_MODULE_INITIALIZED: "ETH_MODULE_INITIALIZED",
    P2P_MODULE_INITIALIZING: "P2P_MODULE_INITIALIZING",
    P2P_MODULE_INITIALIZED: "P2P_MODULE_INITIALIZED",
    DAT_MODULE_INITIALIZING: "DAT_MODULE_INITIALIZING",
    DAT_MODULE_INITIALIZED: "DAT_MODULE_INITIALIZED",
    DISCOVERY_INITIALIZING: "DISCOVERY_INITIALIZING",
    DISCOVERY_INITIALIZED: "DISCOVERY_INITIALIZED",
    HTTP_INITIALIZING: "HTTP_INITIALIZING",
    HTTP_INITIALIZED: "HTTP_INITIALIZED",
    SESSION_INITIALIZED: "SESSION_INITIALIZED",
    INITIALIZATION_FAILED: "INITIALIZATION_FAILED",
    SHUTDOWN_ERROR: "SHUTDOWN_ERROR",
    STARTED: "STARTED"
});

const AOCoreStateReadableMessages = {
    INITIAL_STATE: "Starting core...",
    LOGS_INTIALIZING: "Setting up logs...",
    LOGS_INTIALIZED: "Log ready",
    ROUTER_INITIALIZING: "Setting up core router...",
    ROUTER_INITIALIZED: "Core router ready",
    CORE_DBS_INITIALIZING: "Setting up core databases...",
    CORE_DBS_INITIALIZED: "Core databases ready",
    ETH_MODULE_INITIALIZING: "Setting up ethereum interface...",
    ETH_MODULE_INITIALIZED: "Ethereum interface ready",
    P2P_MODULE_INITIALIZING: "Connecting to AO's peer network...",
    P2P_MODULE_INITIALIZED: "AO's peer network connected",
    DAT_MODULE_INITIALIZING: "Setting up AO's file sharing interface...",
    DAT_MODULE_INITIALIZED: "AO's file sharing interface ready",
    DISCOVERY_INITIALIZING: "Begining network discovery...",
    DISCOVERY_INITIALIZED: "Network discovery started",
    HTTP_INITIALIZING: "Spinning up core http interface...",
    HTTP_INITIALIZED: "Core http interface ready",
    SESSION_INITIALIZED: "Session created",
    INITIALIZATION_FAILED: "Core initialization failed",
    SHUTDOWN_ERROR: "AO shutting down...",
    STARTED: "AO ready to moon"
};

export default class Core extends EventEmitter {
    public options: ICoreOptions;
    private coreRouter: AORouter;
    private http: Http;
    private userSession: AOUserSession;
    private state: String;
    public static DEFAULT_OPTIONS = {
        ethAddress: "",
        ethNetworkId: "1",
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

    constructor(args: ICoreOptions) {
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
     * The switch statement is in chronilogical order and should be pretty easy to follow.
     *
     * @param nextState
     * @param error
     * @param errorMessage
     */
    private stateChangeHandler(
        nextState: string,
        error?: Error,
        errorMessage?: string
    ) {
        initializationStateLog(nextState);
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
                this.bindCoreRouterEventHandlers();
                this.coreDbInitializer();
                break;
            case AOCoreState.CORE_DBS_INITIALIZED:
                this.ethereumNetworkInitializer();
                break;
            case AOCoreState.ETH_MODULE_INITIALIZED:
                this.p2pNetworkInitializer();
                break;
            case AOCoreState.P2P_MODULE_INITIALIZED:
                this.datModuleInitializer();
                break;
            case AOCoreState.DAT_MODULE_INITIALIZED:
                this.contentDiscoveryInitializer();
                break;
            case AOCoreState.DISCOVERY_INITIALIZED:
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
                errorLog(errorMessage);
                errorLog(error);
                this.handleShutdown(errorMessage);
                break;
            default:
                break;
        }
        // Emit state change (pass back up to electron/parent process)
        if (process.send) {
            process.send({
                event: EVENT_LOG,
                message: AOCoreStateReadableMessages[nextState]
            });
        }
    }

    private logsInitializer() {
        this.stateChangeHandler(AOCoreState.LOGS_INTIALIZING);
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
                        `Error removing previous log file at: ${logFilePath}.`
                    );
                    this.stateChangeHandler(
                        AOCoreState.INITIALIZATION_FAILED,
                        error,
                        `Unable to locate log file`
                    );
                });
        }
    }

    /**
     * Core is split into several sub-processes that are managed by the AORouter.
     * There is a bit of dependency flow here, so once the processes are running
     * we will chain a few calls before things are good to go.
     */
    private coreRouterInitializer() {
        this.stateChangeHandler(AOCoreState.ROUTER_INITIALIZING);
        this.coreRouter = new AORouter(this.options);
        this.coreRouter
            .start()
            .then(() => {
                this.stateChangeHandler(AOCoreState.ROUTER_INITIALIZED);
            })
            .catch(error => {
                this.stateChangeHandler(
                    AOCoreState.INITIALIZATION_FAILED,
                    error,
                    `Unable to start core router`
                );
            });
    }

    private bindCoreRouterEventHandlers() {
        this.coreRouter.router.on("/core/log", this._handleLog.bind(this));
        this.coreRouter.router.on(
            "/core/networkIdMismatch",
            this._handleNetworkIdMismatch.bind(this)
        );
    }

    private coreDbInitializer() {
        this.stateChangeHandler(AOCoreState.CORE_DBS_INITIALIZING);
        this.coreRouter.router
            .send("/db/init")
            .then(() => {
                this.stateChangeHandler(AOCoreState.CORE_DBS_INITIALIZED);
            })
            .catch((error: Error) => {
                this.stateChangeHandler(
                    AOCoreState.INITIALIZATION_FAILED,
                    error,
                    `Unable to load core databases`
                );
            });
    }

    private ethereumNetworkInitializer() {
        // NOTE: eth network initialization depends on information from the core settings db,
        // which should be ensured by the state machine ie: CORE_DBS_INITIALIZED
        this.stateChangeHandler(AOCoreState.ETH_MODULE_INITIALIZING);
        let ethNetworkRpc = undefined;
        this.coreRouter.router
            .send("/db/settings/get")
            .then((response: IAORouterMessage) => {
                if (response.data.ethNetworkRpc) {
                    // User defined RPC overrides default
                    ethNetworkRpc = response.data.ethNetworkRpc;
                } else if (this.options.ethNetworkRpc) {
                    // command line argument
                    ethNetworkRpc = this.options.ethNetworkRpc;
                }
                const ethInitParams: IAOETH_Init_Data = { ethNetworkRpc };
                this.coreRouter.router
                    .send("/eth/init", ethInitParams)
                    .then((response: IAORouterMessage) => {
                        this.stateChangeHandler(
                            AOCoreState.ETH_MODULE_INITIALIZED
                        );
                    })
                    .catch((error: Error) => {
                        this.stateChangeHandler(
                            AOCoreState.INITIALIZATION_FAILED,
                            error,
                            `An error occured while attempting to connect to the Ethereum network`
                        );
                    });
            })
            .catch((error: Error) => {
                this.stateChangeHandler(
                    AOCoreState.INITIALIZATION_FAILED,
                    error,
                    `Unable to read user settings`
                );
            });
    }

    /**
     * Initialization of the P2P network (taodb)
     */
    private p2pNetworkInitializer() {
        this.stateChangeHandler(AOCoreState.P2P_MODULE_INITIALIZING);
        // 1. We need to pull the taodb key from the settings contract
        this.coreRouter.router
            .send("/eth/settings/taoDbKey")
            .then((response: IAORouterMessage) => {
                const taoDbKey = response.data.taoDbKey;
                // 2. Spin up p2p module with the fetched taoDbKey
                const p2pInitData: AOP2P_Init_Data = {
                    dbKey: taoDbKey
                };
                this.coreRouter.router
                    .send("/p2p/init", p2pInitData)
                    .then(() => {
                        this.stateChangeHandler(
                            AOCoreState.P2P_MODULE_INITIALIZED
                        );
                    })
                    .catch((error: Error) => {
                        this.stateChangeHandler(
                            AOCoreState.INITIALIZATION_FAILED,
                            error,
                            `Unable to initialize AO's peer network`
                        );
                    });
            })
            .catch((error: Error) => {
                this.stateChangeHandler(
                    AOCoreState.INITIALIZATION_FAILED,
                    error,
                    `Unable to reach the AO network settings`
                );
            });
    }

    private datModuleInitializer() {
        this.stateChangeHandler(AOCoreState.DAT_MODULE_INITIALIZING);
        this.coreRouter.router
            .send("/dat/init")
            .then((response: IAORouterMessage) => {
                this.stateChangeHandler(AOCoreState.DAT_MODULE_INITIALIZED);
            })
            .catch((error: Error) => {
                this.stateChangeHandler(
                    AOCoreState.INITIALIZATION_FAILED,
                    error,
                    `Unable to initialize the AO file sharing protocol`
                );
            });
    }

    private contentDiscoveryInitializer() {
        this.stateChangeHandler(AOCoreState.DISCOVERY_INITIALIZING);
        this.coreRouter.router
            .send("/p2p/beginDiscovery")
            .then(() => {
                this.stateChangeHandler(AOCoreState.DISCOVERY_INITIALIZED);
            })
            .catch((error: Error) => {
                this.stateChangeHandler(
                    AOCoreState.INITIALIZATION_FAILED,
                    error,
                    `Unable to start AO's peer network discovery`
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
        this.http
            .start()
            .then(() => {
                this.stateChangeHandler(AOCoreState.HTTP_INITIALIZED);
            })
            .catch((error: Error) => {
                this.stateChangeHandler(
                    AOCoreState.INITIALIZATION_FAILED,
                    error,
                    `Unable to start AO's http interface`
                );
            });
    }

    private postInitializationWork() {
        this.processCommandLineArgs(this.options);
    }

    private processCommandLineArgs(args: ICoreOptions) {
        const { exportData, importData, ethAddress, ethNetworkId } = args;
        const context: IGraphqlResolverContext = {
            router: this.coreRouter.router,
            options: this.options,
            userSession: this.userSession
        };
        const empty: object = {}; //Need an empty object?

        if (ethAddress.length && ethNetworkId) {
            const registerArgs: IRegister_Args = {
                inputs: {
                    ethAddress: ethAddress,
                    networkId: ethNetworkId
                }
            };
            registerResolver(empty, registerArgs, context, empty)
                .then(() => {
                    debugLog(
                        `ethAddress set as ${ethAddress} and networkId is ${ethNetworkId}`
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
                new Error(`Ethereum network id mismatch`),
                `Core shutting down due to Ethereum network id mismatch. This is likely a result of switching Ethereum networks.`
            );
        }
    }
}
