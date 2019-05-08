"use strict";
import { AO_CONSTANTS } from "ao-library";
import { EventEmitter } from "events";
import fsExtra from "fs-extra";
import path from "path";
import readline from "readline";
import Debug, { debugLogFile } from "./AODebug";
import AOUserSession from "./AOUserSession";
import { DEFAULT_OPTIONS } from "./bin";
import exportDataResolver, {
    IContentExport_Args
} from "./graphql/resolvers/resolveExportData";
import registerResolver, {
    IRegister_Args
} from "./graphql/resolvers/resolveRegister";
import Http, { IGraphqlResolverContext } from "./http";
import { AODB_NetworkInit_Data } from "./modules/db/db";
import { IAOETH_Init_Data } from "./modules/eth/eth";
import { AOP2P_Init_Data } from "./modules/p2p/p2p";
import AORouter, { IAORouterMessage } from "./router/AORouter";
import { IAORouterRequest } from "./router/AORouterInterface";
import { isAddress } from "web3-utils";

const debugLog = Debug("ao:core");
const errorLog = Debug("ao:core:error");
const initializationStateLog = Debug("ao:initialization");

export interface ICoreOptions {
    ethAddress: string;
    ethNetworkRpc: string;
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
    PENDING_ETH_RPC_INPUT: "PENDING_ETH_RPC_INPUT",
    ETH_MODULE_INITIALIZED: "ETH_MODULE_INITIALIZED",
    NETWORK_DB_INITIALIZING: "NETWORK_DB_INITIALIZING",
    NETWORK_DB_INITIALIZED: "NETWORK_DB_INITIALIZED",
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
    PENDING_ETH_RPC_INPUT: "Waiting for ethereum recovery option...",
    ETH_MODULE_INITIALIZED: "Ethereum interface ready",
    NETWORK_DB_INITIALIZING: "Setting up network content database...",
    NETWORK_DB_INITIALIZED: "Network content database ready",
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
    private ethNetworkId: string; // NOTE: this is derived from ethNetworkRpc during /eth/init
    private coreRouter: AORouter;
    private http: Http;
    private userSession: AOUserSession;
    private unhandledRejections: Map<Promise<any>, any>;

    // current state of the core
    private state: String;
    // status of each state
    private states: {
        [key: string]: boolean;
    } = {};
    private runningUnderElectron: boolean;
    public static DEFAULT_OPTIONS = DEFAULT_OPTIONS;

    constructor(args: ICoreOptions) {
        super();
        this.options = Object.assign({}, Core.DEFAULT_OPTIONS, args);
        this.runningUnderElectron =
            typeof process.send === "function" ||
            this.options.nodeBin.indexOf(`ao-desktop`) !== -1;
        debugLog(`Starting core with options:`);
        debugLog(this.options);
        process.stdin.resume(); // Hack to keep the core processes running
        process.on("exit", () => {
            if (this.coreRouter) {
                this.coreRouter.shutdown(); //Ensure that all child processes are killed
            }
            this.unhandledRejections.forEach((p, reason) => {
                debugLog("Unhandled Rejection at:", p, "reason:", reason);
            });
            debugLog(
                `Core process exiting with ${
                    this.unhandledRejections.keys.length
                } unhandled rejections.`
            );
        });
        process.on("SIGINT", () => {
            process.exit();
        });
        process.on("SIGTERM", () => {
            process.exit();
        });
        process.on("warning", function(w) {
            console.log(w.stack || w);
        });
        this.unhandledRejections = new Map();
        process.on("unhandledRejection", (reason, p) => {
            this.unhandledRejections.set(p, reason);
        });
        process.on("rejectionHandled", p => {
            this.unhandledRejections.delete(p);
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
        errorMessage?: string,
        additionalData?: any
    ) {
        initializationStateLog(nextState);
        // Emit state change (pass back up to electron/parent process)
        this.emitLog(AOCoreStateReadableMessages[nextState]).catch(error => {
            errorLog(`Error emitting log`, error);
        });
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
                this.states[AOCoreState.ROUTER_INITIALIZED] = true;
                this.bindCoreRouterEventHandlers();
                this.coreDbInitializer();
                break;
            case AOCoreState.CORE_DBS_INITIALIZED:
                this.states[AOCoreState.CORE_DBS_INITIALIZED] = true;
                this.ethereumNetworkInitializer();
                break;
            case AOCoreState.PENDING_ETH_RPC_INPUT:
                this.listenForEthereumRpcInputResponse(
                    error,
                    errorMessage,
                    additionalData
                );
                break;
            case AOCoreState.ETH_MODULE_INITIALIZED:
                this.states[AOCoreState.ETH_MODULE_INITIALIZED] = true;
                this.networkContentDbInitializer();
                break;
            case AOCoreState.NETWORK_DB_INITIALIZED:
                this.states[AOCoreState.NETWORK_DB_INITIALIZED] = true;
                this.p2pNetworkInitializer();
                break;
            case AOCoreState.P2P_MODULE_INITIALIZED:
                this.states[AOCoreState.P2P_MODULE_INITIALIZED] = true;
                this.datModuleInitializer();
                break;
            case AOCoreState.DAT_MODULE_INITIALIZED:
                this.states[AOCoreState.DAT_MODULE_INITIALIZED] = true;
                this.contentDiscoveryInitializer();
                break;
            case AOCoreState.DISCOVERY_INITIALIZED:
                this.states[AOCoreState.DISCOVERY_INITIALIZED] = true;
                this.sessionInitializer();
                break;
            case AOCoreState.SESSION_INITIALIZED:
                this.states[AOCoreState.SESSION_INITIALIZED] = true;
                if (!this.options.disableHttpInterface) {
                    this.httpInitializer();
                } else {
                    this.stateChangeHandler(AOCoreState.STARTED);
                }
                break;
            case AOCoreState.HTTP_INITIALIZED:
                this.states[AOCoreState.HTTP_INITIALIZED] = true;
                this.stateChangeHandler(AOCoreState.STARTED);
                break;
            case AOCoreState.STARTED:
                this.states[AOCoreState.STARTED] = true;
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
            .then((settingsResponse: IAORouterMessage) => {
                if (settingsResponse.data.ethNetworkRpc) {
                    // User defined RPC overrides default
                    ethNetworkRpc = settingsResponse.data.ethNetworkRpc;
                } else if (this.options.ethNetworkRpc) {
                    // command line argument
                    ethNetworkRpc = this.options.ethNetworkRpc;
                }
                const ethInitParams: IAOETH_Init_Data = { ethNetworkRpc };
                this.coreRouter.router
                    .send("/eth/init", ethInitParams)
                    .then((ethInitResponse: IAORouterMessage) => {
                        this.ethNetworkId = ethInitResponse.data.ethNetworkId;
                        this.stateChangeHandler(
                            AOCoreState.ETH_MODULE_INITIALIZED
                        );
                    })
                    .catch((error: Error) => {
                        // Ethereum provider failed to establish connection,
                        // give user opportunity to provide another rpc endpoint
                        this.stateChangeHandler(
                            AOCoreState.PENDING_ETH_RPC_INPUT,
                            error,
                            "",
                            {
                                lastUsedRpcEndpoint: ethNetworkRpc,
                                settingsRpcEndpoint:
                                    settingsResponse.data.ethNetworkRpc,
                                commandLineRpcEndpoint: this.options
                                    .ethNetworkRpc
                            }
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

    private networkContentDbInitializer() {
        this.stateChangeHandler(AOCoreState.NETWORK_DB_INITIALIZING);
        const networkInitParams: AODB_NetworkInit_Data = {
            ethNetworkId: this.ethNetworkId
        };
        this.coreRouter.router
            .send("/db/network/init", networkInitParams)
            .then(() => {
                this.stateChangeHandler(AOCoreState.NETWORK_DB_INITIALIZED);
            })
            .catch((error: Error) => {
                this.stateChangeHandler(
                    AOCoreState.INITIALIZATION_FAILED,
                    error,
                    `Unable to load network content database`
                );
            });
    }

    /**
     * At this point core has failed to connect to the ethereum network.
     * We give the user the opportunity to provide an additional rpc
     * endpoint to reach the ethereum network with. This may be in the form
     * of a command line input or a frontend input from `ao-frontend`.
     */
    private listenForEthereumRpcInputResponse(
        error,
        errorMessage,
        { lastUsedRpcEndpoint, settingsRpcEndpoint, commandLineRpcEndpoint }
    ) {
        let rpcEndpointOptions = [];
        rpcEndpointOptions.push({
            url: lastUsedRpcEndpoint,
            message: `${lastUsedRpcEndpoint} (last used, failed)`
        });
        rpcEndpointOptions.push({
            url: commandLineRpcEndpoint,
            message: `${commandLineRpcEndpoint} (--ethNetworkRpc)`
        });
        rpcEndpointOptions.push({
            url: settingsRpcEndpoint,
            message: `${settingsRpcEndpoint} (settings)`
        });
        if (this.runningUnderElectron) {
            const onMessageHandler = ({ event, data }) => {
                if (event === AO_CONSTANTS.IPC.AO_ETH_RPC_PROMPT_RESPONSE) {
                    process.removeListener("message", onMessageHandler);
                    debugLog(`AO_ETH_RPC_PROMPT_RESPONSE`, data);
                    this.updateSettingsAndRetryEthInitializer(data);
                }
            };
            process.send({
                event: AO_CONSTANTS.IPC.AO_ETH_RPC_PROMPT,
                data: { lastUsedRpcEndpoint }
            });
            process.on("message", onMessageHandler);
        } else {
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });
            let question = `Would you like to retry with another ethereum provider?\n`;
            for (let i = 0; i < rpcEndpointOptions.length; i++) {
                const option = rpcEndpointOptions[i];
                question += `[${i}] ${option.message}\n`;
            }
            question += `Enter a number or provider url: `;
            const promptForRpc = () => {
                rl.question(question, response => {
                    const trimmedResponse = response.trim();
                    let userInputedRpc;
                    switch (trimmedResponse) {
                        case "0":
                        case "1":
                        case "2":
                            userInputedRpc =
                                rpcEndpointOptions[parseInt(trimmedResponse)]
                                    .url;
                            break;
                        default:
                            // should match a wss url format
                            let matches = trimmedResponse.match(
                                /^(wss:\/\/|ws:\/\/)/
                            );
                            if (matches && matches.length > 0) {
                                userInputedRpc = trimmedResponse;
                            } else {
                                rl.write(
                                    `\nPlease provide a websocket provider in the form of wss:// or ws://\n\n`
                                );
                                setTimeout(promptForRpc, 1000);
                                return null;
                            }
                    }
                    // Run through the eth initializer with the new rpc
                    this.updateSettingsAndRetryEthInitializer(userInputedRpc);
                    rl.close();
                });
            };
            promptForRpc();
        }
    }
    private updateSettingsAndRetryEthInitializer(newRpcEndpoint) {
        // Run through the eth initializer with the new rpc
        this.coreRouter.router
            .send("/db/settings/update", { ethNetworkRpc: newRpcEndpoint })
            .then(() => {
                this.ethereumNetworkInitializer();
            })
            .catch(error => {
                this.stateChangeHandler(
                    AOCoreState.INITIALIZATION_FAILED,
                    error,
                    `Failed to update user settings`
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
                let taoDbKey = response.data.taoDbKey;

                // TODO: remove once taodb key has been moved to contracts
                debugLog(`WARNING, HARDCODED TAODB KEY!`);
                debugLog(`taodb key found in contracts: ${taoDbKey}`);
                taoDbKey =
                    "b95d3ba6b1d193341313ce745c7a951dddfa8f7c287700ec6f7d104091d7c4a2";
                debugLog(`taodb key override: ${taoDbKey}`);

                // 2. Spin up p2p module with the fetched taoDbKey
                const p2pInitData: AOP2P_Init_Data = {
                    dbKey: taoDbKey,
                    ethNetworkId: this.ethNetworkId
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
            .send("/dat/init", { ethNetworkId: this.ethNetworkId })
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
            .then((port: number) => {
                this.emitLog(
                    `AO Core running on port ${port}, accesible from origin ${
                        this.options.httpOrigin
                    }`
                );
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
        const { ethAddress } = args;
        const context: IGraphqlResolverContext = {
            router: this.coreRouter.router,
            options: this.options,
            userSession: this.userSession
        };
        if (isAddress(ethAddress)) {
            // Pull ao name id (required for registration)
            this.coreRouter.router
                .send("/eth/nameId", { ethAddress })
                .then((response: IAORouterMessage) => {
                    const registerArgs: IRegister_Args = {
                        inputs: {
                            ethAddress: ethAddress,
                            aoNameId: response.data.nameId
                        }
                    };
                    registerResolver({}, registerArgs, context, {})
                        .then(() => {
                            debugLog(
                                `Registration succesfull!\n\tethAddress: ${ethAddress}\n\tnameId: ${
                                    response.data.nameId
                                }`
                            );
                        })
                        .catch(error => {
                            errorLog(error);
                        });
                })
                .catch(error => {
                    this.handleShutdown(error);
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
        this.emitLog(data.message)
            .then(request.respond)
            .catch(request.reject);
    }

    private emitLog(message): Promise<any> {
        if (process.send) {
            // If there is a parent process (running within app) we relay
            // all of the logs up.
            process.send({ event: AO_CONSTANTS.IPC.EVENT_LOG, message });
        }
        if (this.listenerCount(AO_CONSTANTS.IPC.EVENT_LOG) > 0) {
            this.emit(AO_CONSTANTS.IPC.EVENT_LOG, { message });
        }
        if (!this.states[AOCoreState.CORE_DBS_INITIALIZED]) {
            // coreRouter/logs db has not been setup yet
            return Promise.resolve();
        }
        return this.coreRouter.router.send("/db/logs/insert", {
            message,
            createdAt: Date.now()
        });
    }
}
