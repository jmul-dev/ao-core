#!/usr/local/bin/node
'use strict';
import { join } from "path";
import fs from 'fs-extra'
import Dat from 'dat-node'
import crypto from 'crypto'
import md5 from 'md5'
import { Validator, SchemaError } from 'jsonschema'
import {
    read_file_schema,
    stream_read_file_schema,
    write_file_schema,
    stream_write_file_schema,
    move_file_schema,
    delete_file_schema,
    make_folder_schema,
    move_folder_schema,
    delete_folder_schema
} from './files_schemas'
import SubProcess from '../subprocess_interface'

import Debug from 'debug';
const debug = Debug('ao:files');
const error = Debug('ao:files:error');

import Message from '../messaging/message'


// Future use?: https://www.npmjs.com/package/file-encryptor
class Files implements SubProcess{
    data_folder:string;
    validator:any;
    registry_name:string = 'filesSubProcess'
    instance_id: number = md5( new Date().getTime() + Math.random() ) //rando number for identification
    encryption_algo: string = 'aes-256-ctr'

    constructor() {
        this.validator = new Validator()

        //Below is meant to ensure that file paths do not stray and use ../ to bypass their locations
        this.validator.attributes.containsNot = function validateContains(instance, schema, options, ctx) {
            if(typeof instance!='string') return;
            if(typeof schema.containsNot!='string') throw new SchemaError('"containsNot" expects a string', schema);
            if( instance.includes(schema.containsNot) ){
                return 'contains the string ' + JSON.stringify(schema.containsNot);
            }
        }

        this.init()
        .then(this.register.bind(this))
        .then(this.onMessageRouter.bind(this))
        .catch( (e) => {
            error(e)
        })
    }

    async init() {
        return new Promise((resolve,reject) => {
            //make sure storage location exists (assumes dist location for now.  should make a configuration)
            this.data_folder = join('data','files')
            fs.ensureDir(this.data_folder)
            .then(() => {
                resolve()
            })
            .catch( (err) => {
                error(err)
                reject(err)
            })
        })
    }
    
    async register() {
        return new Promise( (resolve,reject) => {
            if( process.send ) {
                debug('Has parent. Registering Files Subprocess')
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
                reject()
            }
        })
    }
    
    //Time to bind all the messages to specific actions within the class
    async onMessageRouter() {
        return new Promise( (resolve,reject) => {
            process.on('message', (message) => {
                //note, below vars are for callback message only.
                var type_id:string = 'message'
                var stream_direction = null;
                //Add message verification here?
                
                switch(message.event) {
                    case 'read_file':
                        var fs_promise = this.readFile(message.data)
                        break;
                    case 'stream_read_file':
                        var fs_promise = this.streamReadFile(message.data)
                        type_id = 'stream'
                        stream_direction = 'output'
                        break;
                    case 'write_file':
                        var fs_promise = this.writeFile(message.data)
                        break;
                    case 'stream_write_file':
                        var fs_promise = this.streamWriteFile(message.data)
                        break;
                    case 'move_file':
                        var fs_promise = this.moveFile(message.data)
                        break;
                    case 'delete_file':
                        var fs_promise = this.deleteFile(message.data)
                        break;
                    case 'make_folder':
                        var fs_promise = this.makeFolder(message.data)
                        break;
                    case 'move_folder':
                        var fs_promise = this.moveFolder(message.data)
                        break;
                    case 'delete_folder':
                        var fs_promise = this.deleteFolder(message.data)
                        break;
                    default:
                        var err = 'not a routable event'
                        reject(err)
                        error(err)
                        break;
                }

                fs_promise.then((file_data) => {
                    if(message.data.callback_event) {
                        var callback_message = new Message({
                            app_id: 'testing', //TBD
                            event: message.data.callback_event,
                            instance_id: this.instance_id,
                            type_id: type_id, //Message for most, but stream for some
                            from: this.registry_name,
                            data: {
                                message_sender: message.from,
                                original_event: message.event,
                                file_data: file_data ? file_data : null,
                                stream_direction: stream_direction ? stream_direction : null,
                                dat: message.data.dat ? message.data.dat : false
                            },
                            encoding: "json"
                        })
                        //Time to send back a callback message of success to the caller.
                        process.send( callback_message.toJSON() )
                    }
                })
                .catch( (err) => {
                    error(err)
                    reject(err)
                })
            })
            resolve()
        })
    }

    async readFile( message_data ) {
        return new Promise( (resolve,reject) => {
            var result = this.validator.validate(message_data, read_file_schema)
            if(!result.valid) {
                reject(result.errors)
            }
            var full_path = join(this.data_folder, message_data.file_path)
            fs.readFile(full_path)
            .then( (data) => {
                resolve(data)
            })
            .catch( (err) => {
                reject(err)
            })
        })
    }

    async streamReadFile( message_data ) {
        return new Promise( (resolve,reject) => {
            var result = this.validator.validate(message_data, stream_read_file_schema)
            if(!result.valid) {
                reject(result.errors)
            }
            var full_path = join(this.data_folder, message_data.file_path)
            var readStream = fs.createReadStream(full_path)
            readStream.on('error', (err) => {
                debug('read file stream error:',err)
            })
            readStream.on('open', () => {
                debug('about to pass the read file over')
                var parent = fs.createWriteStream(null, {fd:3})
                if(message_data.decrypt && message_data.key) {
                    var decrypt = crypto.createDecipher(this.encryption_algo, message_data.key)
                    readStream.pipe(decrypt).pipe(parent)
                } else {
                    readStream.pipe(parent)
                }
            })
            readStream.on('finish', () => {
                resolve()
            })
        })
    }

    //file path from data files dir including file name
    async writeFile( message_data ) {
        return new Promise((resolve,reject) => {
            var result = this.validator.validate(message_data, write_file_schema)
            if(!result.valid) {
                reject(result.errors)
            }
            var full_path = join(this.data_folder,message_data.file_path)
            var write_data:any = message_data.file_data
            if(typeof message_data.file_data == 'object') {
                try{
                    write_data = JSON.stringify(message_data.file_data)
                } catch(err) {
                    reject(err)
                }
            }
            fs.outputFile(full_path, write_data)
            .then( () => {
                //fs.readFile(full_path) will return the file
            })
            .then( (data) => {
                //You can verify data here if ya want
                resolve()
            })
            .catch( (err) => {
                reject(err)
            })
        })
    }

    async streamWriteFile( message_data ) {
        return new Promise( (resolve,reject) => {
            var result = this.validator.validate(message_data, stream_write_file_schema)
            if(!result.valid) {
                reject(result.errors)
            }
            var full_path = join(this.data_folder,message_data.file_path)
            var stream = message_data.stream
            stream.on('error', (err) => {
                if(stream.trucated || err) {
                    fs.unlinkSync(full_path)
                }
                reject(err)
            })
            if(message_data.encrypt) {
                //If you use encrypt, you definitely need to give the message a callback event
                var key = md5(this.instance_id + new Date().getSeconds() + Math.random() )
                var encrypt = crypto.createCipher(this.encryption_algo, key)
                stream.pipe( encrypt )
                .pipe( fs.createWriteStream(full_path) )
                .on('error', err => reject(err))
                .on('finish', () => {
                    resolve(key)
                } )
            } else {
                stream.pipe( fs.createWriteStream(full_path) )
                .on('error', err => reject(err))
                .on('finish', () => resolve() )
            }
        })
    }

    async moveFile( message_data ) {
        return new Promise((resolve,reject) => {
            var result = this.validator.validate(message_data, move_file_schema)
            if(!result.valid) {
                reject(result.errors)
            }
            var full_src_path = join(this.data_folder, message_data.src_path)
            var full_dest_path = join(this.data_folder, message_data.dest_path)
            fs.move(full_src_path, full_dest_path)
            .then(() => {
                resolve()
            })
            .catch( (err) => {
                reject(err)
            })
        })
    }

    async deleteFile(message_data) {
        return new Promise((resolve,reject) => {
            var result = this.validator.validate(message_data, delete_file_schema)
            if(!result.valid) {
                reject(result.errors)
            }
            var full_path = join(this.data_folder, message_data.file_path)
            fs.remove(full_path)
            .then( () => {
                resolve()
            })
            .catch( (err) => {
                reject(err)
            })
        })
    }

    async makeFolder(message_data) {
        return new Promise((resolve,reject) => {
            var result = this.validator.validate(message_data, make_folder_schema)
            if(!result.valid) {
                reject(result.errors)
            }
            var full_path = join(this.data_folder,message_data.folder_path)
            fs.ensureDir(full_path)
            .then( () => {
                if(message_data.dat == true) {
                    Dat(full_path, (err,dat) => {
                        if(err) {
                            reject(err)
                        }
                        dat.importFiles()
                        // dat.joinNetwork(() => {
                        // })// this has a callback mechanism 

                        // Send out message to the dat manager subprocess to scan for a new folder with dat.
                        
                        resolve()
                    })
                } else {
                    resolve()
                }
            })
            .catch( (err) => {
                reject(err)
            })
        })
    }

   async moveFolder( message_data ) {
        return new Promise((resolve,reject) => {
            var result = this.validator.validate(message_data, move_folder_schema)
            if(!result.valid) {
                reject(result.errors)
            }
            var full_src_path = join(this.data_folder, message_data.src_path)
            var full_dest_path = join(this.data_folder, message_data.dest_path)
            fs.move(full_src_path, full_dest_path)
            .then(() => {
                resolve()
            })
            .catch( (err) => {
                reject(err)
            })
        })
    }

   async deleteFolder(message_data) {
        return new Promise((resolve,reject) => {
            var result = this.validator.validate(message_data, delete_folder_schema)
            if(!result.valid) {
                reject(result.errors)
            }
            var full_path = join(this.data_folder,message_data.folder_path)
            fs.remove(full_path)
            .then( () => {
                resolve()
            })
            .catch( (err) => {
                reject(err)
            })
        })
    }

}

if (require.main === module) {    
    const files = new Files();
}


export default Files