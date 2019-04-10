import aodb from "aodb";
import discovery from "discovery-swarm";
import swarmDefaults from "dat-swarm-defaults";
import Debug from "../../AODebug";
import { IAOStatus } from "../../models/AOStatus";
import EthCrypto from "eth-crypto";
import { Identity } from "../../AOCrypto";
const debug = Debug("ao:aodb");

export interface IAODB_Args {
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
    public aodb: aodb;
    private dbKey: string;
    private dbPath: string | Function;
    private swarm: discovery;
    protected _userIdentity: Identity;
    public connectionStatus: IAOStatus = "DISCONNECTED";

    public setUserIdentity(v: Identity) {
        this._userIdentity = v;
        this.createSwarm();
    }

    public start(hyperOptions: IAODB_Args): Promise<string> {
        if (
            this.connectionStatus === "CONNECTED" ||
            this.connectionStatus === "CONNECTING"
        ) {
            debug(
                `Warning, start() method was called on an instance that is already started.`
            );
            return Promise.resolve(this.dbKey);
        }
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
                    debug(`ready, aodb key: ${this.dbKey}`);
                    this.dbKey = this.aodb.key.toString("hex");
                    debug(`ready, aodb derived key: ${this.dbKey}`);
                    this.connectionStatus = "CONNECTED";
                    this.createSwarm();
                    resolve(this.dbKey);
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    private createSwarm() {
        if (this.swarm) {
            // wait for the existing swarm to close/cleanup
            this.swarm.close(() => {
                debug(`existing discovery swarm closed`);
                this.swarm = undefined;
                this.createSwarm();
            });
            return;
        }
        if (!this._userIdentity) {
            debug(`identity required for aodb replication`);
            return;
        }
        debug(`creating discovery swarm...`);
        this.swarm = discovery(
            swarmDefaults({
                id: this.dbKey,
                stream: this.replicate.bind(this)
            })
        );
        this.swarm.join(this.dbKey);
        this.swarm.on("connection", this.onConnection.bind(this));
    }

    private replicate(peer) {
        if (!this._userIdentity) {
            return this.aodb.replicate({
                live: false
            });
        } else {
            return this.aodb.replicate({
                live: true,
                userData: JSON.stringify({
                    key: this.aodb.local.key,
                    writerAddress: this._userIdentity.publicKey,
                    writerSignature: EthCrypto.sign(
                        this._userIdentity.privateKey,
                        this.aodb.createSignHash(
                            "discoveryKey",
                            this.aodb.key.toString("hex")
                        )
                    )
                }) // this.aodb.local.key
            });
        }
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

        let remoteUserData;
        try {
            remoteUserData = Buffer.from(peer.remoteUserData);
        } catch (err) {
            debug(`Error buffering remote peer: ${err.message}`);
            return;
        }

        if (
            !remoteUserData.hasOwnProperty("key") ||
            !remoteUserData.hasOwnProperty("writerAddress") ||
            !remoteUserData.hasOwnProperty("writerSignature")
        ) {
            debug(
                "Remote user data is missing key/writerAddress/writerSignature properties"
            );
            return;
        }
        const remotePeerKey = Buffer.from(remoteUserData.key);
        const signer = EthCrypto.recoverPublicKey(
            remoteUserData.writerSignature,
            this.aodb.createSignHash(
                "discoveryKey",
                this.aodb.key.toString("hex")
            )
        );
        if (signer !== remoteUserData.writerAddress) {
            debug(
                "Signer does not match the writerAddress. Will not authorize the connected peer: " +
                    peer.id.toString("hex")
            );
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
                            const recoveredPublicKey = EthCrypto.recoverPublicKey(
                                writerSignature,
                                this.createSignHash(key, value)
                            );
                            debug(
                                `put key callback error for key: ${key}: \n\t${
                                    err.message
                                }\n\twriterAddress: ${writerAddress}
                                \n\trecoverd publicKey: ${recoveredPublicKey}
                                \n\tschemaKey: ${
                                    optionsWithSchemaKey.schemaKey
                                }`
                            );
                            reject(err);
                        } else {
                            debug(`put key[${key}] succesful`);
                            resolve();
                        }
                    }
                );
            } catch (error) {
                debug(`put try-catch error for key[${key}]: ${error.message}`);
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
                    else reject(new Error(`No value found for key: ${key}`));
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

    public listKeys(
        key: string,
        options: { recursive?: boolean; reverse?: boolean; gt?: boolean } = {
            recursive: true,
            reverse: true,
            gt: false
        }
    ): Promise<Array<string>> {
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
                                results.push(node.key);
                            }
                        }
                        resolve(results);
                    }
                }
            );
        });
    }

    public count(
        key: string,
        options: { recursive?: boolean; reverse?: boolean; gt?: boolean } = {
            recursive: true,
            reverse: true,
            gt: false
        }
    ): Promise<number> {
        return new Promise((resolve, reject) => {
            this.aodb.list(
                key,
                options,
                (err: Error, nodes: Array<AODB_Entry<any>>) => {
                    if (err) {
                        resolve(0);
                    } else {
                        resolve(nodes.length);
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
            debug(`adding schema: ${key}...`);
            this.aodb.addSchema(
                key,
                value,
                writerSignature,
                writerAddress,
                (err: Error) => {
                    if (err) reject(err);
                    else resolve();
                }
            );
        });
    }
}
