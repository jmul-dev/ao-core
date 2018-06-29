'use strict';
import Message from './message'
import Debug from 'debug';
import Registry from './registry';
const debug = Debug('ao:core');
const error = Debug('ao:core:error');
import { message_schema} from './validation_schemas'
import { validate } from 'jsonschema'
import { RegistryObject } from './message_interfaces'
import { join } from "path";
import { spawn } from "child_process";

export default class Router {    
    private registry: Registry;
    private registry_item: RegistryObject;
    private message_schema:Object = message_schema

    constructor( registry ) {
        this.registry = registry
    }

    async loadProcesses() {
        return new Promise( (resolve,reject) => {

            var all_processes = []
            this.registry.loopRegistries( (registry) => {
                switch(registry.type) {
                    case 'main':
                        //dont' do stuff for now.
                        break;
                    default:
                    case 'subprocess':
                        all_processes.push(new Promise((res,rej) => {
                            const current_process = spawn(process.execPath, [ join(__dirname, '../../dist/'+registry.file) ], { stdio: ['ipc', 'inherit', 'inherit'] })
                            current_process.on('error', (err) => {
                                var message:Message = new Message({
                                    app_id: 'testing', //TBD
                                    event: "register_process",
                                    type_id: "bogus",
                                    data: { 
                                        request: "delete_from_registry",
                                        name: registry.name
                                    },
                                    encoding: "json"
                                })
                                this.registry.send( message ) //send message to delete
                                error( registry.name+' failed to start: ', err)
                                rej(err)
                            })
                            current_process.on('close', (code) => {
                                //Do we resolve or reject?
                                var message:Message = new Message({
                                    app_id: 'testing', //TBD
                                    event: "register_process",
                                    type_id: "bogus",
                                    data: { 
                                        request: "delete_from_registry",
                                        name: registry.name
                                    },
                                    encoding: "json"
                                })
                                this.registry.send( message ) //send message to delete
                                debug( registry.name+' closed on us with code: ', code)
                            })
                            current_process.on('message', this.send.bind(this))
                            res()
                        }))
                        break;
                }
                
            })
            
            Promise.all( all_processes )
            .then( () => {
                resolve()
            })
            .catch( (e) =>{
                reject(e)
                error(e)
            })
            
        })
    }

    private send(message:Message) {
        //data validation
        this.validate(message)
        .then(this.verify.bind(this))//registration check
        .then(this.callMethod.bind(this))
        .catch((err)=> {
            error(err)
        })
    }

    private async validate( message:Message ) {
        return new Promise((resolve,reject) => {
            let result =  validate(message, this.message_schema)
            if(result.valid) {
                resolve(message)
            } else {
                reject(result.errors)
            }
        })
    }

    private async verify( message:Message )  {
        return new Promise( ( resolve,reject ) => {
            this.registry_item = this.registry.verify(message)
            if(!this.registry_item) {
                reject('Registry does not exist or message event did not match.')
            }
            resolve(message)
        })
    }

    private async callMethod( message:Message ) {
        return new Promise( ( resolve,reject ) => {
            try {
                switch(this.registry_item.type) {
                    case 'main':
                        //note that send is a normal method within the instantiated class
                        this.registry_item.process.send( message )
                        break;
                    default:
                    case 'subprocess':
                        this.registry_item.process.send({ message: message })
                        break;
                }
            } catch (error) {
                reject(error)
            }
            resolve(message)
        })
    }
}