import queue, { IQueue } from 'queue';
import Debug from '../../AODebug';
import AOUserSession from '../../AOUserSession';
import AONetworkContent from '../../models/AONetworkContent';
import { IAORouterMessage } from "../../router/AORouter";
import { AORouterInterface } from "../../router/AORouterInterface";
import { AODB_NetworkContentGet_Data, AODB_NetworkContentUpdate_Data } from "../db/db";
import { NetworkContentHostEntry } from './p2p';
const debug = Debug('ao:p2p:contentHostsUpdater')


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
        [key: string]: boolean
    } = {};

    constructor(router: AORouterInterface, getContentHostsFormatted: Function) {
        this.router = router
        this.getContentHostsFormatted = getContentHostsFormatted
        // @ts-ignore Types not up to date
        this.processingQueue = queue({
            concurrency: 2,
            autostart: true,
        });
    }

    public addContentKeyToQueue(metadataDatKey: string) {
        if (this.datKeysInQueue[metadataDatKey] !== true) {
            this.processingQueue.push(this._queueHandler.bind(this, metadataDatKey))
            this.datKeysInQueue[metadataDatKey] = true            
        }
    }

    private _queueHandler(metadataDatKey: string) {
        return new Promise((resolve, reject) => {
            const resolver = () => {
                this.datKeysInQueue[metadataDatKey] = false
                resolve()
            }
            // 1. Fetch existing piece of content from the local network content db
            const networkContentQuery: AODB_NetworkContentGet_Data = {
                query: { _id: metadataDatKey }
            }
            this.router.send('/db/network/content/get', networkContentQuery).then((contentResponse: IAORouterMessage) => {
                if (contentResponse.data && contentResponse.data[0]) {
                    const existingNetworkContent: AONetworkContent = contentResponse.data[0]
                    this.getContentHostsFormatted(existingNetworkContent.content).then((contentHosts: Array<NetworkContentHostEntry>) => {
                        // 3. Parse the content hosts and update stats
                        const now = new Date();
                        const recentlySeenHosts = contentHosts.filter((host: NetworkContentHostEntry) => {
                            const hostTimestamp = new Date( parseInt(host.timestamp) );
                            return now.getTime() - hostTimestamp.getTime() < AOUserSession.CONTENT_DISCOVERY_UPDATE_INTERVAL;
                        })
                        const networkContentUpdate: AODB_NetworkContentUpdate_Data = {
                            id: existingNetworkContent._id,
                            update: {
                                $set: {
                                    lastSeenContentHost: contentHosts[0],
                                    totalHosts: contentHosts.length,
                                    recentlySeenHostsCount: recentlySeenHosts.length
                                }
                            }
                        }
                        this.router.send('/db/network/content/update', networkContentUpdate).then(() => {
                            resolver()
                        }).catch(error => {
                            debug(`Error updating network content hosts information: ${error.message}`)
                            resolver()
                        })
                    }).catch(error => {
                        debug(`${metadataDatKey} Error grabbing content hosts: ${error.message}`)
                        resolver()
                    })
                } else {
                    debug(`${metadataDatKey} Content not found, unable to update host stats...`)
                    resolver()
                }
            }).catch(error => {
                resolver()
            })
        })
    }
}