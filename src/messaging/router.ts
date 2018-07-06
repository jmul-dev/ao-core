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
                                    type_id: "bogus",
                                    event: "register_process",
                                    from: registry.name,
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
                                    type_id: "bogus",
                                    event: "register_process",
                                    from: registry.name,
                                    data: { 
                                        request: "delete_from_registry",
                                        name: registry.name
                                    },
                                    encoding: "json"
                                })
                                this.registry.send( message ) //send message to delete
                                debug( registry.name+' closed on us with code: ', code)
                            })
                            //message from child process
                            current_process.on('message', (message:Message) => {
                                //data validation
                                this.invokeSubProcess(message, registry.name)
                                .catch( e => {
                                    rej(e)
                                })
                            })
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

    public async invokeSubProcess( message:Message, registry_name:string ) {
        return new Promise( (resolve,reject) => {
            this.validate(message, registry_name)
            .then(this.verify.bind(this))//registration check
            .then(this.callMethod.bind(this))
            .then( () => {
                resolve()
            })
            .catch((err)=> {
                error(err)
                reject(err)
            })
        })
    }

    //Validates the Message structure
    private async validate( message:Message, registry_name ) {
        return new Promise((resolve,reject) => {
            if(message.from != registry_name) {
                //Fishy stuff by child process trying to act like they someone else.
                reject('Looks like '+registry_name +' is being fishy. Its trying to act like its '+ message.from)
            }
            let result =  validate(message, this.message_schema)
            if(result.valid) {
                resolve(message)
            } else {
                reject(result.errors)
            }
        })
    }

    //Verifies the existence of registry item.
    private async verify( message:Message )  {
        return new Promise( ( resolve,reject ) => {
            var registry_item = this.registry.verify(message)
            if(!registry_item) {
                reject('Registry does not exist or message event did not match.')
            }
            resolve({registry_item, message})
        })
    }

    private async callMethod( {registry_item, message} ) {
        return new Promise( ( resolve,reject ) => {
            try {
                switch(registry_item.type) {
                    case 'main':
                        //note that send is a normal method within the instantiated class
                        registry_item.process.send( message )
                        break;
                    default:
                    case 'subprocess':
                        registry_item.process.send({ message: message })
                        break;
                }
            } catch (error) {
                reject(error)
            }
            resolve(message)
        })
    }
}