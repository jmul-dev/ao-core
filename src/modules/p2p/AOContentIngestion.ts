import Debug from "debug";
import path from "path";
import queue, { IQueue } from "queue";
import AOContent, { AOContentState } from "../../models/AOContent";
import AONetworkContent from "../../models/AONetworkContent";
import { IAORouterMessage } from "../../router/AORouter";
import { AORouterInterface } from "../../router/AORouterInterface";
import { AODat_Download_Data } from "../dat/dat";
import { IAOFS_Read_Data } from "../fs/fs";
import {
    AODB_NetworkContentGet_Data,
    AODB_NetworkContentUpdate_Data
} from "../db/db";
import { EventEmitter } from "events";
const debug = Debug("ao:p2p:contentIngestion");

/**
 * Handles incoming content from the p2p network. The process is:
 *
 *  1. Add metadataDatKey to process queue
 *  2. Pull key from process queue
 *  3. Attempt to download the Dat file associated with the metadataDatKey
 *  4. Read the metadata content.json file
 *  5. Insert the metadata into network content db and mark as complete
 *
 */
export default class AOContentIngestion extends EventEmitter {
    public static Events = {
        CONTENT_INGESTED: "content:ingested"
    };
    private ethNetworkId: string;
    private router: AORouterInterface;
    private processingQueue: IQueue;
    private datKeysInQueue: {
        [key: string]: boolean;
    } = {};

    constructor(router: AORouterInterface, ethNetworkId: string) {
        super();
        this.router = router;
        this.ethNetworkId = ethNetworkId;
        // @ts-ignore Types not up to date
        this.processingQueue = queue({
            concurrency: 4,
            autostart: true,
            timeout: 2 * 60000 // 2 min timeout to avoid freezing up the queue
        });
    }

    public addDiscoveredMetadataDatKeyToQueue(metadataDatKey: string) {
        if (this.datKeysInQueue[metadataDatKey] !== true) {
            this.processingQueue.push(
                this._queueHandler.bind(this, metadataDatKey)
            );
            this.datKeysInQueue[metadataDatKey] = true;
        } else {
            //debug('Already added key to ingestion queue: ' + metadataDatKey)
        }
    }

    private _queueHandler(metadataDatKey: string) {
        return new Promise(queueResolver => {
            // failedAttempt = dat was downloaded but failed to import
            // If dat was unreachable we do not consider that failed attempt
            // at this time (node could be offline and we dont want to hit max attempts)
            const resolve = (failedAttempt = false) => {
                if (failedAttempt) {
                    this.router
                        .send("/db/network/content/update", {
                            id: metadataDatKey,
                            update: {
                                $inc: { importAttempts: 1 }
                            }
                        })
                        .catch(debug);
                }
                this.datKeysInQueue[metadataDatKey] = false;
                queueResolver();
            };
            debug(
                `[${metadataDatKey}] processing discovered network content, position in queue: ${
                    this.processingQueue.length
                }`
            );
            // 1. Ping the network content db to see if we have already seen this
            const networkContentQuery: AODB_NetworkContentGet_Data = {
                query: { _id: metadataDatKey }
            };
            this.router
                .send("/db/network/content/get", networkContentQuery)
                .then((contentResponse: IAORouterMessage) => {
                    if (contentResponse.data && contentResponse.data[0]) {
                        const existingNetworkContent: AONetworkContent =
                            contentResponse.data[0];
                        if (existingNetworkContent.status === "imported") {
                            // 2a. Content already exists (TODO: decide if we want to retry?)
                            debug(
                                `[${metadataDatKey}] network content already discovered`
                            );
                            return resolve();
                        } else if (existingNetworkContent.importAttempts > 2) {
                            debug(
                                `[${metadataDatKey}] skipping content import, hit max attempts`
                            );
                            return resolve();
                        } else {
                            debug(
                                `[${metadataDatKey}] import attempt #${
                                    existingNetworkContent.importAttempts
                                }`
                            );
                        }
                    }
                    // 2b. Download the dat file
                    const datDownloadParams: AODat_Download_Data = {
                        key: metadataDatKey
                    };
                    this.router
                        .send("/dat/download", datDownloadParams)
                        .then((downloadResponse: IAORouterMessage) => {
                            const readContentJson: IAOFS_Read_Data = {
                                readPath: path.join(
                                    `content-${this.ethNetworkId}`,
                                    metadataDatKey,
                                    "content.json"
                                )
                            };
                            // 3. Read the content.json (metadata)
                            this.router
                                .send("/fs/read", readContentJson)
                                .then((readResponse: IAORouterMessage) => {
                                    let incrementUpdate = {};
                                    let networkContent: AONetworkContent = {
                                        _id: metadataDatKey,
                                        status: "failed"
                                    };
                                    try {
                                        const contentJson = JSON.parse(
                                            readResponse.data
                                        );
                                        if (contentJson) {
                                            let isValidOrFieldName = AOContent.isValidForImport(
                                                contentJson
                                            );
                                            if (isValidOrFieldName !== true)
                                                throw new Error(
                                                    `missing field ${isValidOrFieldName}`
                                                );
                                            networkContent.status = "imported";
                                            networkContent.content = AOContent.fromObject(
                                                contentJson
                                            );
                                            networkContent.content.state =
                                                AOContentState.DISCOVERED;
                                        }
                                    } catch (error) {
                                        debug(
                                            `[${metadataDatKey}] failed to parse network content's content.json file`,
                                            error
                                        );
                                        // cleanup
                                        this.router
                                            .send("/dat/remove", {
                                                key: metadataDatKey
                                            })
                                            .catch(debug);
                                        incrementUpdate = {
                                            importAttempts: 1
                                        };
                                    } finally {
                                        // 4. Insert into network content db, marked as failed or imported
                                        const updateArgs: AODB_NetworkContentUpdate_Data = {
                                            update: {
                                                $set: networkContent,
                                                $inc: incrementUpdate
                                            },
                                            id: metadataDatKey
                                        };
                                        this.router
                                            .send(
                                                "/db/network/content/update",
                                                updateArgs
                                            )
                                            .then(() => {
                                                if (
                                                    networkContent.status ===
                                                    "imported"
                                                ) {
                                                    debug(
                                                        `[${metadataDatKey}] network content imported, adding to hosts updater queue`
                                                    );
                                                    this.emit(
                                                        AOContentIngestion
                                                            .Events
                                                            .CONTENT_INGESTED,
                                                        metadataDatKey
                                                    );
                                                }
                                            })
                                            .catch(e => {
                                                debug(e);
                                            });
                                        resolve();
                                    }
                                })
                                .catch(error => {
                                    this.router
                                        .send("/dat/remove", {
                                            key: metadataDatKey
                                        })
                                        .catch(error => {
                                            debug(
                                                `[${metadataDatKey}] error removing dat after failed read of content.json`,
                                                error
                                            );
                                        });
                                    debug(
                                        `[${metadataDatKey}] failed to read content.json file.`,
                                        error
                                    );
                                    resolve(true);
                                });
                        })
                        .catch(error => {
                            debug(
                                `[${metadataDatKey}] failed to download metadata dat file, ${
                                    error.message
                                }`
                            );
                            resolve();
                        });
                })
                .catch(error => {
                    debug(
                        `[${metadataDatKey}] failed to get network content.`,
                        error
                    );
                    resolve();
                });
        });
    }
}
