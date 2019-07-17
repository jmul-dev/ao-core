import taodb from "taodb";
import swarm from "taodb/swarm";
import Debug from "debug";
import { IAOStatus } from "../../models/AOStatus";
import { createUserIdentity, Identity } from "../../AOCrypto";
const debug = Debug("ao:taodb");
const getPort = require("get-port");

export interface ITAODB_Args {
    dbKey: string;
    dbPath: string | Function;
    ethNetworkId: string;
}

export interface ITAODB_Entry<T> {
    key: string;
    splitKey: Array<string>;
    pointerKey: string;
    schemaKey: string;
    value: T;
    deleted: boolean;
    writerSignature: string;
    writerAddress: string;
}

export interface ITAODB_Watcher {
    on: (
        event: "watching" | "change" | "close" | "error",
        callback: (err?: Error) => void
    ) => void;
    destroy: () => void;
}

export default class TAODBWrapper {
    public taodb: taodb;
    private dbKey: string;
    private dbPath: string | Function;
    private swarm: swarm;
    protected _userIdentity: Identity;
    public connectionStatus: IAOStatus = "DISCONNECTED";

    constructor() {
        // NOTE: this is really a hack to allow replication
        // when a user is not "signed in".
        this._userIdentity = createUserIdentity();
    }

    public setUserIdentity(v: Identity) {
        this._userIdentity = v;
        this.taodb.setLocalETHPrivateKey(v.privateKey);
    }

    public get userPublicKey(): string {
        return this._userIdentity ? this._userIdentity.publicKey : undefined;
    }

    public get userPublicAddress(): string {
        return this._userIdentity ? this._userIdentity.address : undefined;
    }

    public start(args: ITAODB_Args): Promise<string> {
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
                this.dbKey = args.dbKey;
                this.dbPath = args.dbPath;
                this.taodb = new taodb(
                    this.dbPath,
                    this.dbKey,
                    this._userIdentity.privateKey
                );
                this.taodb.db.ready(async error => {
                    if (error) return reject(error);
                    // Overwrite the dbKey assigned with whatever taodb has (in case dbKey was undefined or mismatch).
                    // Just ensures a sync between taodb and swarm
                    this.dbKey = this.taodb.db.key.toString("hex");
                    try {
                        debug(
                            `taodb db initialized, setting ethereum network id to ${
                                args.ethNetworkId
                            }...`
                        );
                        await this.taodb.setNetworkId(
                            parseInt(args.ethNetworkId)
                        );
												const port = await getPort({port: getPort.makeRange(60001, 60010)});
                        this.swarm = swarm(this.taodb, {
                            dht: false,
                            utp: false,
							tcp: true,
							port
                        });
                        this.connectionStatus = "CONNECTED";
						debug(`taodb ready: port ${port}`);
                        resolve(this.dbKey);
                    } catch (error) {
                        this.connectionStatus = "ERROR";
                        debug(error);
                        reject(error);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    public peersConnected() {
        return this.swarm && this.swarm.connected ? this.swarm.connected : 0;
    }

    public createSignHash(key: string, value: any): string {
        return this.taodb.createSignHash(key, value);
    }

    public insert({ key, value, schemaKey, options = {} }): Promise<any> {
        debug(`attempting insert at: ${key}`);
        return this.taodb.insert(key, value, schemaKey, options);
    }

    /**
     * Get value at the given key. Rejects if key/value does not exist.
     *
     * @param key
     * @param options
     */
    public get(key: string, options?: object): Promise<any> {
        return this.taodb.query(key, options);
    }

    public exists(key: string): Promise<boolean> {
        return this.taodb.exists(key);
    }

    public list(
        key: string,
        options: { recursive?: boolean; reverse?: boolean; gt?: boolean } = {
            recursive: true,
            reverse: true,
            gt: false
        }
    ): Promise<Array<ITAODB_Entry<any>>> {
        return new Promise((resolve, reject) => {
            this.taodb.db.list(
                key,
                options,
                (err: Error, nodes: Array<ITAODB_Entry<any>>) => {
                    if (err) {
                        reject(err);
                    } else {
                        let results = [];
                        if (nodes && nodes.length) {
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
            this.taodb.db.list(
                key,
                options,
                (err: Error, nodes: Array<ITAODB_Entry<any>>) => {
                    if (err) {
                        reject(err);
                    } else {
                        let results = [];
                        if (nodes && nodes.length) {
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
        return this.taodb.count(key, options);
    }

    /**
     * Resolves once a change is detected on key. You will need to query for that change seperately.
     *
     * @param key
     */
    public watch(key: string): Promise<any> {
        return this.taodb.watch(key);
    }

    /**
     * This method returns the watcher itself, and the caller must handle cleanup.
     *      watcher.on("watching")
     *      watcher.on("change")
     *      watcher.on("close")
     *      watcher.destroy()
     *
     * @param key
     * @returns {Object} Hyperdb watcher
     */
    public watcher(key: string): ITAODB_Watcher {
        return this.taodb.db.watch(key);
    }

    public delete({ key }): Promise<any> {
        debug(`attempting delete on key: ${key}...`);
        return this.taodb.delete(key);
    }

    public addSchema({ key, value }): Promise<any> {
        debug(`adding schema: ${key}...`);
        return this.taodb.addSchema(key, value);
    }
}
