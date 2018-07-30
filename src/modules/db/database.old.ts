// /**
//  * For now there is a single Database instance instantiated.
//  * Note that the db is persisted as a .json file.
//  * A single 'settings' database is created, and a seperate 'user' db
//  * created for each user (based on eth address).
//  */
// 'use strict'
// import toilet from 'toiletdb'
// import { join } from "path";
// import md5 from 'md5'
// import Router from "../messaging/router";
// import Message from "../messaging/message";
// import { MessageObject } from "../messaging/message_interfaces";
// import fs from 'fs';
// import Debug from 'debug';
// const debug = Debug('ao:db');
// const error = Debug('ao:db:error');


// class Database {
//     private videos: Object = {};
//     private peers: Object = {};
//     private logs: Array<{}> = [];
//     private router: Router;
//     private storageLocation: string;
//     public module_name: string = 'database'
//     public instance_id: string = md5(new Date().getTime() + Math.random())

//     private db: toilet
//     private userDb: toilet
//     public static DEFAULT_SETTINGS = {
//         maxDiskSpace: -1,
//         maxBandwidthUp: -1,
//         maxBandwidthDown: -1,
//         maxPeerConnections: -1,
//         runInBackground: false,
//         runOnStartup: false,
//         checkForUpdates: true,
//     }
//     public DB_OPEN_ERROR: string = 'Database not yet opened. Log saved to local state.'
//     public DB_READ_ERROR: string = 'Database not readable.'
//     public DB_WRITE_ERROR: string = 'Database not writeable.'

//     public eth_address: string

//     constructor(router: Router, storageLocation: string) {
//         this.router = router;
//         this.storageLocation = storageLocation;
//     }
//     public async init() {
//         this.register().then(() => {
//             this.openDatabase()
//         }).catch(e => error)
//     }
//     public async register() {
//         return new Promise((resolve, reject) => {
//             var register_message = new Message({
//                 app_id: 'testing',
//                 type_id: "message",
//                 event: 'register_process',
//                 from: this.module_name,
//                 data: {
//                     request: "add_to_registry",
//                     name: this.module_name,
//                     type: "main",
//                     instance_id: this.instance_id,
//                     process: this
//                 },
//                 encoding: 'json'
//             })
//             this.router.invokeSubProcess(register_message.toJSON(), this.module_name)
//                 .then(resolve)
//                 .catch(reject)
//         })
//     }
//     //This is for subprocesses to be able to send stuff to the DB.
//     public send(message: MessageObject) {
//         switch (message.event) {
//             case 'db_get_eth_address':
//                 var send_data = {
//                     eth_address: this.eth_address
//                 }
//                 break;
//             case 'add_dat_key':
//                 var db_promise = this.addDatKey(message.data)
//                 break;
//             case 'add_dat_hash':
//                 var db_promise = this.addDatHash(message.data)
//                 break;
//             default:
//                 error('No matching event')
//                 break;
//         }
//         if (db_promise) {
//             db_promise.then(() => {
//                 debug('Promise ran')
//             })
//                 .catch(e => {
//                     error(e)
//                 })
//         } else if (!db_promise && message.data.callback_event) {
//             var cb_message = new Message({
//                 app_id: 'testing',
//                 type_id: "message",
//                 event: message.data.callback_event,
//                 from: this.module_name,
//                 data: send_data,
//                 encoding: 'json'
//             })
//             this.router.invokeSubProcess(cb_message.toJSON(), this.module_name)
//         }
//     }

//     public async setEthAddress(eth_address: string) {
//         return new Promise((resolve, reject) => {
//             this.eth_address = eth_address
//             //if the eth_address is set, we need to make sure that database is switched out.
//             this.openUserDatabase().then(() => {
//                 debug('Ethereum Address set, also setting for dat')
//                 const dat_eth_set = new Message({
//                     app_id: 'testing', //Should be passed to this thing on initial start.
//                     type_id: "message",
//                     event: "dat_set_eth_address",
//                     from: this.module_name,
//                     data: {
//                         eth_address: this.eth_address
//                     },
//                     encoding: 'json'
//                 })
//                 this.router.invokeSubProcess(dat_eth_set.toJSON(), this.module_name)
//                     .then(() => {
//                         resolve()
//                     }).catch(e => {
//                         reject(e)
//                     })
//             })
//                 .catch(e => {
//                     reject(e)
//                 })
//         })
//     }

//     public getEthAddress() {
//         return this.eth_address
//     }

//     private async openDatabase() {
//         return new Promise((resolve, reject) => {
//             const dbPath = join(this.storageLocation, 'ao_db.json')
//             if ( !fs.existsSync(dbPath) ) {
//                 const dbSeed = JSON.stringify({
//                     settings: Database.DEFAULT_SETTINGS,
//                 }, null, '\t')
//                 fs.writeFileSync(dbPath, dbSeed)
//             }
//             this.db = toilet(dbPath)
//             this.db.open(err => {
//                 if ( err ) {
//                     error('openDatabase error, database path:', dbPath, err)
//                     reject(this.DB_OPEN_ERROR)
//                 } else {
//                     debug('db open at ', dbPath)
//                     resolve()
//                 }
//             })
//         })
//     }

//     private async openUserDatabase() {
//         return new Promise((resolve, reject) => {
//             const userDbPath = join(this.storageLocation, this.eth_address, 'db.json')
//             this.userDb = toilet(userDbPath)
//             this.userDb.open(err => {
//                 if ( err ) {
//                     error('openUserDatabase error, database path:', userDbPath, err)
//                     reject(this.DB_OPEN_ERROR)
//                 } else {
//                     resolve()
//                 }
//             })        
//         })        
//     }

//     public async close() {
//         return Promise.resolve();
//     }

//     public addPeer(peerId: string) {
//         this.peers[peerId] = {
//             id: peerId,
//             dateCreated: Date.now()
//         }
//     }

//     public removePeer(peerId: string) {
//         delete this.peers[peerId]
//     }
//     /**
//      * Logs
//      */
//     public addLog(log) {
//         this.logs.push({
//             ...log,
//             dateCreated: Date.now()
//         })
//         //just let this hang, no need for the function to be Promised
//         if (this.userDb) {
//             this.userDb.write('logs', this.logs, (err) => {
//                 if (err) {
//                     error(err)
//                 }
//             })
//         } else {
//             debug(this.DB_OPEN_ERROR)
//         }
//     }

//     public getLogs() {
//         return this.logs
//     }

//     /**
//      * Settings
//      */
//     public getSettings() {
//         return new Promise((resolve, reject) => {
//             this.db.read('settings', (err, data) => {
//                 if ( err ) {
//                     error('getSettings error:', err)
//                     reject(this.DB_READ_ERROR)
//                 } else {
//                     resolve(data)
//                 }
//             })
//         })
//     }

//     public writeSettings(settings) {
//         return new Promise((resolve, reject) => {
//             this.db.write('settings', settings, (err) => {
//                 if ( err ) {
//                     error('writeSettings error:', err)
//                     reject(this.DB_READ_ERROR)
//                 } else {
//                     resolve(settings)
//                 }
//             })
//         })
//     }

//     /**
//      * Content Key and Dat Addresses
//      */

//     public addDatKey(data) {
//         return new Promise((resolve, reject) => {
//             if (this.userDb) {
//                 this.userDb.read('keys', (err, keys) => {
//                     if (err) {
//                         reject(this.DB_WRITE_ERROR)
//                     }
//                     if (typeof keys == 'undefined') {
//                         keys = {}
//                     }
//                     keys[data.dat_folder] = data.key
//                     debug(keys)
//                     this.userDb.write('keys', keys, (err) => {
//                         if (err) {
//                             reject(this.DB_WRITE_ERROR)
//                         }
//                         resolve()
//                     })
//                 })

//             } else {
//                 reject(this.DB_OPEN_ERROR)
//             }
//         })
//     }

//     public addDatHash(data) {
//         return new Promise((resolve, reject) => {
//             if (this.userDb) {
//                 this.userDb.read('hashes', (err, hashes) => {
//                     if (err) {
//                         reject(this.DB_WRITE_ERROR)
//                     }
//                     if (typeof hashes == 'undefined') {
//                         hashes = {}
//                     }
//                     hashes[data.dat_folder] = data.hash
//                     debug(hashes)
//                     this.userDb.write('hashes', hashes, (err) => {
//                         if (err) {
//                             reject(this.DB_WRITE_ERROR)
//                         }
//                         resolve()
//                     })
//                 })

//             } else {
//                 reject(this.DB_OPEN_ERROR)
//             }
//         })
//     }

// }

// export default Database;