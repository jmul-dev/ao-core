import Debug from "debug";
import path from 'path';
import queue, { IQueue } from 'queue';
import AOContent, { AOContentState } from "../../models/AOContent";
import AONetworkContent from '../../models/AONetworkContent';
import { IAORouterMessage } from "../../router/AORouter";
import { AORouterInterface } from "../../router/AORouterInterface";
import { AODat_Download_Data } from "../dat/dat";
import { IAOFS_Read_Data } from "../fs/fs";
const debug = Debug('ao:p2p:contentIngestion')


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
export default class AOContentIngestion {
    private router: AORouterInterface;
    private processingQueue: IQueue;
    private datKeysInQueue: Array<string> = [];

    constructor(router: AORouterInterface) {
        this.router = router
        // @ts-ignore Types not up to date
        this.processingQueue = queue({
            concurrency: 2,
            autostart: true,
        });
    }

    public addDiscoveredMetadataDatKeyToQueue(metadataDatKey: string) {
        if (this.datKeysInQueue.indexOf(metadataDatKey) === -1)
            this.processingQueue.push(this._queueHandler.bind(this, metadataDatKey))
    }

    private _queueHandler(metadataDatKey: string) {
        return new Promise((resolve, reject) => {
            debug(`Processing discovered network content: ${metadataDatKey} [qlength=${this.processingQueue.length}]`)
            // 1. Ping the network content db to see if we have already seen this
            this.router.send('/db/network/content/get', { _id: metadataDatKey }).then((contentResponse: IAORouterMessage) => {
                if (contentResponse.data && contentResponse.data[0]) {
                    const existingNetworkContent: AONetworkContent = contentResponse.data[0]
                    // 2a. Content already exists (TODO: decide if we want to retry?)
                    resolve()
                } else {
                    // 2b. Download the dat file
                    const datDownloadParams: AODat_Download_Data = { key: metadataDatKey, resolveOnDownloadCompletion: true }
                    this.router.send('/dat/download', datDownloadParams).then((downloadResponse: IAORouterMessage) => {
                        const readContentJson: IAOFS_Read_Data = {
                            readPath: path.join('content', metadataDatKey, 'content.json')
                        }
                        // 3. Read the content.json (metadata)
                        this.router.send('/fs/read', readContentJson).then((readResponse: IAORouterMessage) => {
                            let networkContent: AONetworkContent = {
                                _id: metadataDatKey,
                                status: 'failed'
                            }
                            try {
                                const contentJson = JSON.parse(readResponse.data)
                                if (contentJson) {
                                    networkContent.status = 'imported'
                                    networkContent.content = AOContent.fromObject(contentJson)
                                    networkContent.content.state = AOContentState.DISCOVERED
                                }
                            } catch (error) {
                                debug(error)
                                debug(`Unable to add network content ${metadataDatKey}, failed to parse metadata file.`)
                            } finally {
                                // 4. Insert into network content db, marked as failed or imported
                                this.router.send('/db/network/content/insert', networkContent)
                                .then(resolve)
                                .catch(e => {
                                    debug(e)
                                })
                            }
                        }).catch(error => {
                            debug(`Unable to add network content ${metadataDatKey}, failed to read metadata file.`,error)
                            resolve()
                        })
                    }).catch(error => {
                        debug(`Unable to add network content ${metadataDatKey}, failed to download metadata dat file.`,error)
                        resolve()
                    })
                }
            }).catch(error => {
                debug(`Unable to add network content ${metadataDatKey}, failed to get network content.`,error)
                resolve()
            })
        })
    }
}