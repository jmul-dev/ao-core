#!/usr/local/bin/node
'use strict';
import SubProcess from '../subprocess_interface'
import md5 from 'md5'
import ffprobe from 'ffprobe'
import ffprobeStatic from 'ffprobe-static'
import Multidat from 'multidat'
import toilet from 'toiletdb'
import { join, basename, dirname } from "path";
import Message from '../messaging/message';
import { Validator } from 'jsonschema'
import {
    dat_set_eth_address_schema,
    dat_resume_all_schema,
    dat_add_schema,
    dat_file_uploaded_schema,
    dat_stop_schema
} from './dat_schemas'

import Debug from 'debug';
const debug = Debug('ao:dat');
const error = Debug('ao:dat:error');

//Great for debugging stupid promise things that doesn't show
// process.on('unhandledRejection', err => {
//     console.log("Caught unhandledRejection");
//     console.log(err);
// });

//Manages the Dat P2P processes
class DatManager implements SubProcess {
    instance_id: number = md5( new Date().getTime() + Math.random() ) //rando number for identification
    registry_name:string = 'datSubProcess'
    validator:any;
    
    constructor() {
        this.validator = new Validator()
        this.init()
        .then(this.register.bind(this))         //Register first to messaging
        .then(this.onMessageRouter.bind(this))  //Get message listeners up
        .catch(e => {
            error(e)
        })
    }

    async init() {
        return new Promise( (resolve,reject) => {
            //not a lot to do here TBH as real init can only happen after we hear back from DB.
            resolve()
        })
    }
    async register() {
        return new Promise( (resolve,reject) => {
            if( process.send ) {
                debug('Has parent. Registering Dat Subprocess')
                var register_message = new Message({
                        app_id: 'testing', //Should be passed to this thing on initial start.
                        type_id: "message",
                        event: "register_process",
                        instance_id: this.instance_id,
                        from: this.registry_name,
                        data: { 
                            request: "add_to_registry",
                            name: this.registry_name,
                            type: "subprocess",
                            instance_id: this.instance_id
                        },
                        encoding: "json"
                })
                process.send( register_message.toJSON() )
                resolve()
            } else {
                reject('No Parent Process')
            }
        })
    }
    
    async onMessageRouter() {
        return new Promise( (resolve,reject) => {
            process.on('message', (message) => {
                switch(message.event) {
                    case 'dat_set_eth_address':
                        var dat_promise = this.datResumeAll(message.data)
                    case 'dat_add':
                        var dat_promise = this.datAdd(message.data)
                        break;
                    case 'dat_file_uploaded':
                        var dat_promise = this.datFileUploaded(message.data)
                        break;
                    case 'dat_remove':
                        var dat_promise = this.datRemove(message.data)
                        break;
                    default:
                        var err = 'Dunno about that event: '+ message.event
                        reject(err)
                    break;
                }
                dat_promise.then((callback_data:Object) => {
                    if(message.data.callback_event) {
                        var cb_message = new Message({
                            app_id: 'testing', //Should be passed to this thing on initial start.
                            type_id: "message",
                            event: message.data.callback_event,
                            instance_id: this.instance_id,
                            from: this.registry_name,
                            data: callback_data,
                            encoding: "json"
                        })
                        process.send( cb_message.toJSON() )
                    }
                })
                .catch(e => reject(e))
            })
            resolve()
        })
    }

    eth_address: string
    async datSetEthAddress(message_data) {
        return new Promise( (resolve,reject) => {
            var result = this.validator.validate(message_data, dat_set_eth_address_schema)
            if(!result.valid) {
                reject(result.errors)
            }
            debug('Eth Adress set in Dat')
            this.eth_address = message_data.eth_address
            resolve()
        })
    }

    data_folder: string
    dat_folder: string
    dat_db: string
    multidat: Multidat
    db: toilet  //That's right, we're going to use the toilet.
    dats: Object

    async datResumeAll(message_data) {
        return new Promise( (resolve,reject) => {
            var result = this.validator.validate(message_data, dat_resume_all_schema)
            if(!result.valid) {
                reject(result.errors)
            }
            //Store eth_address
            debug('Eth Adress set in Dat')
            this.eth_address = message_data.eth_address
            
            this.data_folder = join( 'data', 'files', this.eth_address )
            this.dat_folder =  join( this.data_folder, 'dat' )
            this.dat_db = join(this.data_folder, 'dat.json')
            this.db = toilet(this.dat_db)

            Multidat(this.db, (err, multidat) => {
                if(err) {
                    reject(err)
                }
                this.multidat = multidat
                this.dats = multidat.list()
                debug('Dat Subprocess initialized')
                resolve({dat:'All Dats have Resumed'})
            })
        })
    }

    async datAdd(message_data) {
        return new Promise( (resolve,reject) => {
            var result = this.validator.validate(message_data, dat_add_schema)
            if(!result.valid) {
                reject(result.errors)
            }
            if(!this.multidat) {
                reject('Multidat not initialized')
            }
            this.multidat.create(message_data.full_path,(err,dat) => {
                if(err) {
                    reject(err)
                }
                this.dats = this.multidat.list()//update list.
                debug(this.dats)//Can we save this straight to DB?
                resolve()
            })
        })
    }

    public dat_folders:Object = {} // A way to store details for dat uploaded files.
    //used to mark files uploaded to 
    async datFileUploaded(message_data) {
        return new Promise( (resolve,reject) => {
            var result = this.validator.validate(message_data, dat_file_uploaded_schema)
            if(!result.valid) {
                reject(result.errors)
            }
            const dat_folder = message_data.original_data.dat_folder
            const file_size = message_data.file_data.stats.size
            const file_path = join('data','files',message_data.original_data.file_path)
            const file_name = basename(message_data.original_data.file_path)
            
            if(file_name != 'featuredImage') {
                ffprobe(file_path, { path: ffprobeStatic.path }, (err, info) => {
                    if(err) {
                        reject(err)
                    }
                    for (let i = 0; i < info.streams.length; i++) {
                        const stream = info.streams[i];
                        if(stream.codec_type == 'video') {
                            const file_data = {
                                file_type: 'video',
                                codec: stream.codec_name,
                                width: stream.width,
                                height: stream.height,
                                duration: stream.duration,
                                file_size: file_size
                            }
                            if(typeof this.dat_folders[dat_folder] == 'undefined') {
                                this.dat_folders[dat_folder] = {}
                            }
                            this.dat_folders[dat_folder][file_name] = file_data
                            this.checkDatAdd(dat_folder, file_path)
                            resolve()
                            break;
                        }
                    }
                })
            } else {
                const file_data = {
                    file_type: 'image',
                    file_size: file_size
                }
                this.dat_folders[dat_folder][file_name] = file_data
                this.checkDatAdd(dat_folder, file_path)
                resolve()
            }
        })
    }
    private checkDatAdd(dat_folder, file_path) {
        if( Object.keys(this.dat_folders[dat_folder]).length == 3 ) {
            debug('All dat files uploaded for ' + dat_folder)

            const base_path = join(this.eth_address, 'dat', dat_folder)

            const merge_json_message = new Message({
                app_id: 'testing',
                type_id: "message",
                event: 'merge_json_file',
                from: this.registry_name,
                data: {
                    file_path: join(base_path, 'video.json'),
                    file_data: this.dat_folders[dat_folder],
                    callback_event: 'dat_add',
                    callback_data: {
                        full_path: base_path
                    }
                },
                encoding: "json"
            })
            process.send( merge_json_message.toJSON() )
        }
    }


    async datRemove(message_data) {
        return new Promise( (resolve,reject) => {
            var result = this.validator.validate(message_data, dat_stop_schema)
            if(!result.valid) {
                reject(result.errors)
            }
            if( !this.multidat ) {
                reject('Multidat not initialized')
            } else {
                this.multidat.close(message_data.key,(err) => {
                    reject(err)
                })
            }
        })
    }
}

if (require.main === module) {    
    const dat = new DatManager();
}

export default DatManager;