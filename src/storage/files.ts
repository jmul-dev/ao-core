#!/usr/local/bin/node
'use strict';
import { join } from "path";
import fs from 'fs-extra'
import minimist from 'minimist';
import Message from '../messaging/message'
import { Validator, SchemaError } from 'jsonschema'

import {
    read_file_schema,
    write_file_schema,
    move_file_schema,
    delete_file_schema,
    make_folder_schema,
    move_folder_schema,
    delete_folder_schema
} from './files_schemas'

import Debug from 'debug';
const debug = Debug('ao:files');
const error = Debug('ao:files:error');
const argv = minimist(process.argv.slice(2));

// Future use?: https://www.npmjs.com/package/file-encryptor
class Files {
    private data_folder:string;

    private validator:any;

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

    private async register() {
        return new Promise( (resolve,reject) => {
            if( process.send ) {
                debug('has parent. Registering Files Subprocess')
                process.send({
                    app_id: 'testing', //Should be passed to this thing on initial start.
                    type_id: "bogus",
                    event: "register_process",
                    from: "filesSubProcess",
                    data: { 
                        request: "add_to_registry",
                        name: "filesSubProcess",
                        type: "subprocess"
                    },
                    encoding: "json"
                })
                resolve()
            } else {
                reject()
            }
        })
    }

    private async init() {
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
    
    //Time to bind all the messages to specific actions within the class
    private async onMessageRouter() {
        return new Promise( (resolve,reject) => {
            process.on('message', (message) => {
                //Add message verification here?
                switch(message.event) {
                    case 'read_file':
                        var fs_promise = this.readFile(message.data)
                        break;
                    case 'write_file':
                        var fs_promise = this.writeFile(message.data)
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
                        reject('not a routable event')
                        break;
                }

                fs_promise
                .then((file_data) => {

                    var callback_message = new Message({
                        app_id: 'testing', //TBD
                        event: message.data.callback_event,
                        type_id: "bogus",
                        from: "filesSubProcess",
                        data: {
                            original_event: message.event,
                            file_data: file_data ? file_data : null
                        },
                        encoding: "json"
                    })
                    //Time to send back a callback message of success to the caller.
                    process.send(callback_message)
                })
                .catch( (err) => {
                    error(err)
                    reject(err)
                })
            })
            resolve()
        })
    }

    private async readFile( message_data ) {
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

    //file path from data files dir including file name
    private async writeFile( message_data ) {
        return new Promise((resolve,reject) => {
            var result = this.validator.validate(message_data, write_file_schema)
            if(!result.valid) {
                reject(result.errors)
            }
            var full_path = join(this.data_folder,message_data.file_path)
            fs.outputFile(full_path, message_data.file_data)
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

    private async moveFile( message_data ) {
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

    private async deleteFile(message_data) {
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

    private async makeFolder(message_data) {
        return new Promise((resolve,reject) => {
            var result = this.validator.validate(message_data, make_folder_schema)
            if(!result.valid) {
                reject(result.errors)
            }
            var full_path = join(this.data_folder,message_data.folder_path)
            fs.ensureDir(full_path)
            .then( () => {
                resolve()
            })
            .catch( (err) => {
                reject(err)
            })
        })
    }

    private async moveFolder( message_data ) {
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

    private async deleteFolder(message_data) {
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