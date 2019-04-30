import queue, { IQueue } from "queue";
import Debug from "../../AODebug";
import AOUserSession from "../../AOUserSession";
import AONetworkContent from "../../models/AONetworkContent";
import { IAORouterMessage } from "../../router/AORouter";
import { AORouterInterface } from "../../router/AORouterInterface";
import {
    AODB_NetworkContentGet_Data,
    AODB_NetworkContentUpdate_Data
} from "../db/db";
import { NetworkContentHostEntry } from "./p2p";
const debug = Debug("ao:p2p:hostsUpdater");

/**
 * Handles updating of content hosts state within the network.
 * 1. Updates "last seen host"
 * 2. Updates "# hosts"
 * 3. Updates "# hosts seen recently"
 */
export default class AOContentHostsUpdater {
    private router: AORouterInterface;
    private getContentHostsFormatted: Function;
    private processingQueue: IQueue;
    private datKeysInQueue: {
        [key: string]: boolean;
    } = {};

    constructor(router: AORouterInterface, getContentHostsFormatted: Function) {
        this.router = router;
        this.getContentHostsFormatted = getContentHostsFormatted;
        // @ts-ignore Types not up to date
        this.processingQueue = queue({
            concurrency: 4,
            autostart: true,
            timeout: 30000 // 30 sec timeout to avoid freezing up the queue
        });
    }

    public addContentKeyToQueue(metadataDatKey: string) {
        if (this.datKeysInQueue[metadataDatKey] !== true) {
            this.processingQueue.push(
                this._queueHandler.bind(this, metadataDatKey)
            );
            this.datKeysInQueue[metadataDatKey] = true;
        }
    }

    private _queueHandler(metadataDatKey: string) {
        return new Promise((resolve, reject) => {
            const resolver = () => {
                this.datKeysInQueue[metadataDatKey] = false;
                resolve();
            };
            // debug(
            //     `[${metadataDatKey}] content hosts updater, position in queue: ${this
            //         .processingQueue.length - 1}`
            // );
            // 1. Fetch existing piece of content from the local network content db
            const networkContentQuery: AODB_NetworkContentGet_Data = {
                query: { _id: metadataDatKey }
            };
            this.router
                .send("/db/network/content/get", networkContentQuery, {
                    ignoreLogging: true
                })
                .then((contentResponse: IAORouterMessage) => {
                    if (contentResponse.data && contentResponse.data[0]) {
                        const existingNetworkContent: AONetworkContent =
                            contentResponse.data[0];
                        this.getContentHostsFormatted(
                            existingNetworkContent.content
                        )
                            .then(
                                (
                                    contentHosts: Array<NetworkContentHostEntry>
                                ) => {
                                    // 3. Parse the content hosts and update stats
                                    const now = new Date();
                                    const recentlySeenHosts = contentHosts.filter(
                                        (host: NetworkContentHostEntry) => {
                                            const hostTimestamp = new Date(
                                                parseInt(host.timestamp)
                                            );
                                            return (
                                                now.getTime() -
                                                    hostTimestamp.getTime() <
                                                AOUserSession.CONTENT_DISCOVERY_UPDATE_INTERVAL
                                            );
                                        }
                                    );
                                    const lastSeen = contentHosts[0]
                                        ? timeSince(
                                              new Date(
                                                  parseInt(
                                                      contentHosts[0].timestamp
                                                  )
                                              ).valueOf()
                                          )
                                        : "never";
                                    debug(
                                        `[${metadataDatKey}] last host seen [${lastSeen}]`
                                    );
                                    const networkContentUpdate: AODB_NetworkContentUpdate_Data = {
                                        id: existingNetworkContent._id,
                                        update: {
                                            $set: {
                                                lastSeenContentHost:
                                                    contentHosts[0],
                                                totalHosts: contentHosts.length,
                                                recentlySeenHostsCount:
                                                    recentlySeenHosts.length
                                            }
                                        }
                                    };
                                    this.router
                                        .send(
                                            "/db/network/content/update",
                                            networkContentUpdate,
                                            { ignoreLogging: true }
                                        )
                                        .then(() => {
                                            resolver();
                                        })
                                        .catch(error => {
                                            debug(
                                                `[${metadataDatKey}] Error updating network content hosts information: ${
                                                    error.message
                                                }`
                                            );
                                            resolver();
                                        });
                                }
                            )
                            .catch(error => {
                                debug(
                                    `${metadataDatKey} Error grabbing content hosts: ${
                                        error.message
                                    }`
                                );
                                resolver();
                            });
                    } else {
                        debug(
                            `${metadataDatKey} Content not found, unable to update host stats...`
                        );
                        resolver();
                    }
                })
                .catch(error => {
                    resolver();
                });
        });
    }
}

function timeSince(date: number) {
    var seconds = Math.floor((Date.now() - date) / 1000);
    var interval = Math.floor(seconds / 31536000);
    if (interval > 1) {
        return interval + " years";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
        return interval + " months";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
        return interval + " days";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
        return interval + " hours";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
        return interval + " minutes";
    }
    return Math.floor(seconds) + " seconds";
}
