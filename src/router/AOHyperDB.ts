import aodb from "aodb";
import discovery from "discovery-swarm";
import swarmDefaults from "dat-swarm-defaults";
import Debug from "../AODebug";
import { IAOStatus } from "../models/AOStatus";
const debug = Debug("ao:taodb");

export interface AO_Hyper_Options {
    dbKey: string;
    dbPath: string;
}

export interface HDB_ListValueRow {
    key: string;
    splitKey: Array<string>;
    value: any;
}

export default class AOHyperDB {
    private aodb: aodb;
    private dbKey: string;
    private dbPath: string;
    private swarm: discovery;
    public connectionStatus: IAOStatus = "DISCONNECTED";

    //Init is separate from the constructor since we don't know all use cases until other modules are fully loaded (say web3/eth address)
    public init(hyperOptions: AO_Hyper_Options) {
        this.connectionStatus = "CONNECTING";
        return new Promise((resolve, reject) => {
            this.dbKey = hyperOptions.dbKey;
            this.dbPath = hyperOptions.dbPath;
            this.aodb = aodb(this.dbPath, this.dbKey, {
                valueEncoding: "json",
                reduce: (a, b) => a
            });
            this.aodb.on("ready", () => {
                debug(`connected`);
                this.connectionStatus = "CONNECTED";
                this.swarm = discovery(
                    swarmDefaults({
                        id: this.dbKey,
                        stream: peer => {
                            return this.aodb.replicate();
                        }
                    })
                );
                this.swarm.join(this.dbKey);
                this.swarm.on("connection", this.onConnection.bind(this));
                resolve();
            });
        });
    }

    /**
     * Auto-authorize new peers for write access
     * @param peer
     */
    private onConnection(peer) {
        debug("swarm peer connected: " + peer.id.toString("hex"));
        if (!peer.remoteUserData) {
            debug("peer missing user data");
            return;
        }

        let remotePeerKey;
        try {
            remotePeerKey = Buffer.from(peer.remoteUserData);
        } catch (err) {
            debug(err);
            return;
        }

        this.aodb.authorized(remotePeerKey, (err, auth) => {
            if (err) {
                debug(err);
                return;
            }
            if (!auth) {
                this.aodb.authorize(remotePeerKey, err => {
                    if (err) {
                        debug(`Failed to authorize remote peer:`, err);
                        return;
                    }
                    debug(
                        remotePeerKey.toString("hex"),
                        "was just authorized!"
                    );
                });
            } else {
                debug(remotePeerKey.toString("hex"), "authorized");
            }
        });
    }

    public peersConnected() {
        return this.swarm ? this.swarm.connected : 0;
    }

    public insert({
        key,
        value,
        writerSignature,
        writerAddress,
        schemaKey,
        options = {}
    }) {
        return new Promise((resolve, reject) => {
            try {
                let optionsWithSchemaKey = {
                    ...options,
                    schemaKey
                };
                this.aodb.put(
                    key,
                    value,
                    writerSignature,
                    writerAddress,
                    optionsWithSchemaKey,
                    (err?: Error) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve();
                        }
                    }
                );
            } catch (error) {
                reject(error);
            }
        });
    }

    public query(key: string, options?: object) {
        return new Promise((resolve, reject) => {
            this.aodb.get(key, options, (err: Error, node) => {
                if (err) {
                    reject(err);
                } else {
                    if (node) resolve(node.value);
                    reject(new Error(`No value found for key: ${key}`));
                }
            });
        });
    }

    public exists(key: string) {
        return new Promise((resolve, reject) => {
            this.aodb.get(key, (err: Error, node) => {
                if (err) {
                    resolve(false);
                } else if (node) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        });
    }

    public list(
        key: string,
        options: { recursive?: boolean; reverse?: boolean; gt?: boolean } = {
            recursive: true,
            reverse: true,
            gt: false
        }
    ) {
        return new Promise((resolve, reject) => {
            this.aodb.list(key, options, (err: Error, nodes) => {
                if (err) {
                    reject(err);
                } else {
                    if (nodes.length) {
                        let result = [];
                        for (let i = 0; i < nodes.length; i++) {
                            const node = nodes[i];
                            let node_split = node[0].key.split("/");
                            result.push(node_split);
                        }
                        resolve(result);
                    } else {
                        resolve([]);
                    }
                }
            });
        });
    }

    public listValue(key: string, options?: object) {
        return new Promise((resolve, reject) => {
            this.aodb.list(key, options, (err: Error, nodes) => {
                if (err) {
                    reject(err);
                } else {
                    if (nodes.length) {
                        let result: Array<HDB_ListValueRow> = [];
                        for (let i = 0; i < nodes.length; i++) {
                            const node = nodes[i];
                            const splitKey = node.key.split("/");
                            result.push({
                                key: node.key,
                                splitKey,
                                value: node.value
                            });
                        }
                        resolve(result);
                    } else {
                        reject();
                    }
                }
            });
        });
    }

    public watch(key: string) {
        return new Promise((resolve, reject) => {
            let watcher = this.aodb.watch(key, () => {});
            watcher.on("watching", () => {
                debug("Watching for change on key: " + key);
            });
            watcher.on("change", () => {
                debug("Detected change on key: " + key);
                watcher.destroy();
                resolve();
            });
        });
    }

    public delete({ key, writerSignature, writerAddress }) {
        return new Promise((resolve, reject) => {
            this.aodb.del(key, writerSignature, writerAddress, (err: Error) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    public addSchema({ key, value, writerSignature, writerAddress }) {
        return new Promise((resolve, reject) => {
            this.aodb.addSchema(
                key,
                value,
                writerSignature,
                writerAddress,
                (err: Error) => {
                    if (err) reject(err);
                    resolve();
                }
            );
        });
    }
}
