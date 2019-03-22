import aodb from "aodb";
import discovery from "discovery-swarm";
import swarmDefaults from "dat-swarm-defaults";
import Debug from "../../AODebug";
import { IAOStatus } from "../../models/AOStatus";
const debug = Debug("ao:taodb");

export interface AO_Hyper_Options {
    dbKey: string;
    dbPath: string | Function;
}

export interface AODB_Entry<T> {
    key: string;
    splitKey: Array<string>;
    pointerKey: string;
    schemaKey: string;
    value: T;
    deleted: boolean;
    writerSignature: string;
    writerAddress: string;
}

export default class AODB {
    private aodb: aodb;
    private dbKey: string;
    private dbPath: string | Function;
    private swarm: discovery;
    public connectionStatus: IAOStatus = "DISCONNECTED";

    public start(hyperOptions: AO_Hyper_Options): Promise<any> {
        this.connectionStatus = "CONNECTING";
        return new Promise((resolve, reject) => {
            try {
                this.dbKey = hyperOptions.dbKey;
                this.dbPath = hyperOptions.dbPath;
                this.aodb = new aodb(this.dbPath, this.dbKey, {
                    valueEncoding: "json",
                    reduce: (a, b) => a
                });
                this.aodb.on("ready", () => {
                    // Overwrite the dbKey assigned with whatever aodb has (in case dbKey was undefined or mismatch).
                    // Just ensures a sync between aodb and swarm
                    this.dbKey = this.aodb.key.toString("hex");
                    debug(`ready, aodb public key: ${this.dbKey}`);
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
            } catch (error) {
                reject(error);
            }
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

    public createSignHash(key: string, value: any): string {
        return this.aodb.createSignHash(key, value);
    }

    public insert({
        key,
        value,
        writerSignature,
        writerAddress,
        schemaKey,
        options = {}
    }): Promise<any> {
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

    public batchInsert(batch: Array<object>): Promise<any> {
        return new Promise((resolve, reject) => {
            this.aodb.batch(batch, (err: Error) => {
                if (err) reject(err);
                else resolve();
            });
        });
    }

    public get(key: string, options?: object): Promise<any> {
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

    public exists(key: string): Promise<boolean> {
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
    ): Promise<Array<AODB_Entry<any>>> {
        return new Promise((resolve, reject) => {
            this.aodb.list(
                key,
                options,
                (err: Error, nodes: Array<AODB_Entry<any>>) => {
                    if (err) {
                        reject(err);
                    } else {
                        let results = [];
                        if (nodes.length) {
                            for (let i = 0; i < nodes.length; i++) {
                                const node = nodes[i];
                                results.push({
                                    key: node.key,
                                    splitKey: node.key.split("/"),
                                    pointerKey: node.pointerKey,
                                    schemaKey: node.schemaKey,
                                    value: node.value,
                                    deleted: node.deleted,
                                    writerSignature: node.writerSignature,
                                    writerAddress: node.writerAddress
                                });
                            }
                        }
                        resolve(results);
                    }
                }
            );
        });
    }

    public watch(key: string): Promise<any> {
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

    public delete({ key, writerSignature, writerAddress }): Promise<any> {
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

    public addSchema({
        key,
        value,
        writerSignature,
        writerAddress
    }): Promise<any> {
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
