#!/usr/local/bin/node
'use strict';
import { join } from "path";
import fs from 'fs-extra'
import minimist from 'minimist';
import Message from '../messaging/message'
import Debug from 'debug';
const debug = Debug('ao:files');
const error = Debug('ao:files:error');
const argv = minimist(process.argv.slice(2));

// Future use?: https://www.npmjs.com/package/file-encryptor
class Files {
    private data_folder:string;

    constructor() {
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
            console.log(this.data_folder)
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
                    case 'write_file':
                        var fs_promise = this.writeFile(message.data.file_path, message.data.file_data)
                    break;
                    case 'move_file':
                        var fs_promise = this.moveFile(message.data.src_path, message.data.dest_path)
                    break;
                    case 'delete_file':
                        var fs_promise = this.deleteFile(message.data.file_path)
                    break;
                    case 'make_folder':
                        var fs_promise = this.makeFolder(message.data.folder_path)
                    break;
                    case 'move_folder':
                        var fs_promise = this.moveFolder(message.data.src_path, message.data.dest_path)
                    break;
                    case 'delete_folder':
                        var fs_promise = this.deleteFolder(message.data.folder_path)
                        break;
                    default:
                        reject()
                        error('no compatible event')
                        break;
                }

                fs_promise
                .then(() => {
                    var callback_message = new Message({
                        app_id: 'testing', //TBD
                        event: message.data.callback_event,
                        type_id: "bogus",
                        from: "filesSubProcess",
                        data: {
                            success: true
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

    //file path from data files dir including file name
    private async writeFile( file_path, file_data ) {
        return new Promise((resolve,reject) => {
            var full_path = join(this.data_folder,file_path)
            fs.outputFile(full_path, file_data)
            .then( () => {
                //fs.readFile(full_path) will return the file
            })
            .then( (data) => {
                //You can verify data here if ya want
                resolve()
            })
            .catch( (err) => {
                error(err)
                reject(err)
            })
        })
    }

    private async moveFile(src_path, dest_path) {
        var full_src_path = join(this.data_folder, src_path)
        var full_dest_path = join(this.data_folder, dest_path)
        return new Promise((resolve,reject) => {
            fs.move(full_src_path, full_dest_path)
            .then(() => {
                resolve()
            })
            .catch( (err) => {
                error(err)
                reject(err)
            })
        })
    }

    private async deleteFile(file_path) {
        return new Promise((resolve,reject) => {
            var full_path = join(this.data_folder,file_path)
            fs.remove(full_path)
            .then( () => {
                resolve()
            })
            .catch( (err) => {
                error(err)
                reject(err)
            })
        })
    }

    private async makeFolder(folder_path) {
        return new Promise((resolve,reject) => {
            var full_path = join(this.data_folder,folder_path)
            fs.ensureDir(full_path)
            .then( () => {
                resolve()
            })
            .catch( (err) => {
                error(err)
                reject(err)
            })
        })
    }

    private async moveFolder(src_path, dest_path) {
        var full_src_path = join(this.data_folder, src_path)
        var full_dest_path = join(this.data_folder, dest_path)
        return new Promise((resolve,reject) => {
            fs.move(full_src_path, full_dest_path)
            .then(() => {
                resolve()
            })
            .catch( (err) => {
                error(err)
                reject(err)
            })
        })
    }

    private async deleteFolder(folder_path) {
        return new Promise((resolve,reject) => {
            var full_path = join(this.data_folder,folder_path)
            fs.remove(full_path)
            .then( () => {
                resolve()
            })
            .catch( (err) => {
                error(err)
                reject(err)
            })
        })
    }

}

if (require.main === module) {    
    const files = new Files();
}


export default Files