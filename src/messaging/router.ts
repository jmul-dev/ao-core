'use strict';
import Message from './message'
import Debug from 'debug';
import Registry from './registry';
const debug = Debug('ao:core');
const error = Debug('ao:core:error');
import { message_schema} from './validation_schemas'
import { validate } from 'jsonschema'
//import { RegistryObject } from './message_interfaces'
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
                        all_processes.push(this.createNewProcess(registry))
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

    private createNewProcess(registry) {
        return new Promise((res,rej) => {
            const current_process = spawn(
                process.execPath, 
                [ join(__dirname, '../../dist/'+registry.file) ], 
                { 
                    stdio: ['ipc', 'inherit', 'inherit','pipe','pipe'] // Note, first pipe is read from child, second is for write.  Original was:['ipc', 'inherit', 'inherit'] 
                }
            )
            // current_process.stdio[1].on('error', (err) => {
            //     debug('stido 1 : ' + err)
            // })
            // current_process.stdio[2].on('error', (err) => {
            //     debug('stido 2 : ' + err)
            // })
            current_process.on('error', (err) => {
                var message:Message = new Message({
                    app_id: 'testing', //TBD
                    type_id: "message",
                    event: "register_process",
                    from: registry.name,
                    data: { 
                        request: "delete_from_registry",
                        name: registry.name
                    },
                    encoding: "json"
                })
                console.log('errored',err)
                this.registry.send( message ) //send message to delete
                error( registry.name+' failed to start: ', err)
                rej(err)
            })
            current_process.on('close', (code) => {
                //Do we resolve or reject?
                var message:Message = new Message({
                    app_id: 'testing', //TBD
                    type_id: "message",
                    event: "register_process",
                    from: registry.name,
                    data: { 
                        request: "delete_from_registry",
                        name: registry.name
                    },
                    encoding: "json"
                })
                console.log('closed')
                this.registry.send( message  ) //send message to delete
                debug( registry.name+' closed on us with code: ', code)
            })
            //message from child process
            current_process.on('message', (message:Message) => {
                //Process attachment for registry can only happen from here.
                if(
                    message.event == 'register_process' && 
                    message.data.request == 'add_to_registry'
                ) {
                    message.data.process = current_process
                }
                
                this.invokeSubProcess(message, registry.name)
                .catch( e => {
                    rej(e)
                })
            })
            res()
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
            let result = validate(message, this.message_schema)
            if(result.valid) {
                resolve({message,registry_name})
            } else {
                reject(result.errors)
            }
        })
    }

    //Verifies the existence of registry item.
    private async verify( {message, registry_name} )  {
        return new Promise( ( resolve,reject ) => {            
            //Let's just make sure the originator isn't lying about its existance
            var from_registry_item = this.registry.registryByName(registry_name)
            if(!from_registry_item) {
                reject('No registry by that name.')
            }
            //Get the registry item attached to that message event
            var registry_item = this.registry.verifyEvent(message)
            if(!registry_item) {
                reject('Message event does not match any registry.')
            }
            resolve({message, registry_item})
        })
    }

    // TODO: Refactor this thing
    private async callMethod( {message, registry_item} ) {
        return new Promise( ( resolve,reject ) => {
            if(registry_item.multi_instance == 0) {
                var to_process = registry_item.instances[0].process
            } else {
                //If its a multi-instance version, we need to ensure that the process is not in use
                for (let i = 0; i < registry_item.instances.length; i++) {
                    const instance = registry_item.instances[i];
                    if(!instance.in_use) {
                        var to_process = instance.process
                        var to_instance = instance //used later when we send successfully to mark as in use
                        break;
                    }
                }
                //Guess we've gotta invoke a new instance.
                if(typeof to_process == 'undefined') {
                    console.log('Staring a new instance of '+registry_item.name)
                    this.createNewProcess(registry_item)
                    .then(() => {
                        //start over.
                        this.invokeSubProcess(message, registry_item.name)
                        .then(() => {
                            resolve()
                            return true;
                        })
                        .catch(err => {
                            console.log('new instance didnt work out')
                            reject(err)
                        })
                    })
                    .catch(err => {
                        console.log('new instance didnt start')
                        reject(err)
                    })
                }
            }

            switch(message.type_id) {
                case 'message':
                    try {
                        to_process.send( message )
                        //Gotta mark this process as in_use
                        if(registry_item.multi_instance) {
                            this.registry.markUsed(registry_item.name, to_instance.instance_id)
                        }
                    } catch (error) {
                        reject(error)
                    }
                    resolve(message)
                    break;
                case 'stream':
                    var from_process = this.registry.getFromProcess(message)
                    if(message.data.stream_direction == 'output') {
                        var from_stream = from_process.stdio[3]
                        to_process.stdio[4].on('error', (err) => {
                            debug('Ignore this one: ' + err)
                        })
                        from_stream.pipe(to_process.stdio[4])
                    } else if( message.data.stream_direction == 'input') {
                        var to_stream = to_process.stdio[3]
                        from_process.stdio[4].on('error', (err) => {
                            debug('Ignore this one: ' + err)
                        })
                        to_stream.pipe(from_process.stdio[4])
                    }
        
                    //Finally send off the message once the  pipes are made 
                    //(might need to change who the message is sent to based on which way the data is flowing)
                    try {
                        to_process.send(message)
                        if(registry_item.multi_instance) {
                            this.registry.markUsed(registry_item.name, to_instance.instance_id)
                        }
                    } catch (error) {
                        reject(error)
                    }
                    resolve(message)
                    break;
                default:
                    reject('No compatible registry type id')
                    break;
            }
        })
    }
}