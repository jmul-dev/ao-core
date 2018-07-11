'use strict';
//Should the registry be a database/persisted storage thing?  If so, how far should we go with encryption?

import {registry_schema, message_schema} from './validation_schemas'
import {validate} from 'jsonschema'
import Debug from 'debug';
import Router from './router';
import Message from './message'
import {RegistryObject} from './message_interfaces'
const debug = Debug('ao:core');
const error = Debug('ao:core:error');


//Fake data for now.  We'll have to do an FS read, & encryption/decryption for this.
var stored_registry:any = {
    registry: {
        status: false, //Status marks whether the process is active/available
        priority: 0,
        multi_instance: 0,
        type: 'main',//specifically made for registrations and other main processes
        file: '',//empty means that it sends to main
        events: [
            "register_process"
        ]
    },
    p2pSubProcess: {
        status: false,
        priority: 0,
        multi_instance: 0,
        type: 'subprocess',
        file: '/p2p/index.js',//Assumes /dist as a pre-fix
        events: [
            "p2p_lookup",
            "p2p_peer_count",
            "p2p_log_write_callback"
        ]
    },
    filesSubProcess: {
        status: false,
        priority: 0,
        multi_instance: 1,
        type: 'subprocess',
        file: '/storage/files.js',
        events: [           //In the future, maybe store all of the events within the file and have that be the first return on spawn?
            'read_file',
            'write_file',
            'stream_write_file_schema',
            'move_file',
            'delete_file',
            'make_folder',
            'move_folder',
            'delete_folder'
        ]
    }
}

export default class Registry {

    //Internal Data
    private stored_registry:any = stored_registry
    private events_registry:Object = {}      //Used to tie together events to a registry by name
    private registry_by_name:Object = {}     //Now you can use a name to just pull the registry item
    private router:Router

    //Validation Schema
    private registry_schema:Object = registry_schema
    private message_schema:Object = message_schema

    //Init the Registry and get yourself a router!
    async initialize() {
        return new Promise( (resolve,reject) => {
            this.initRegistry()
            this.router = new Router(this)
            resolve(this.router)
        })
    }

    //Maybe in the future we encrypt/decrypt the registry?  Maybe load a password/key to this loadRegistry?
    private initRegistry() {
        //read from FS and decode later using a key? will have to figure this out.
        // The "stored_registry" is a "mock" model registry for now.
        for( var key in this.stored_registry ) {
            //The only special case.
            if(key == 'registry') {
                var instances = [{
                    in_use: false,
                    process: this
                }]
                this.stored_registry[key].instances = instances
                this.stored_registry[key].status = 1 //make it active 
            }

            const registry = stored_registry[key];
            this.registry_by_name[key] = registry

            for (let e = 0; e < registry.events.length; e++) {
                const event = registry.events[e];
                this.events_registry[event] = key
            }
        }
    }

    public loopRegistries(func:Function) {
        for ( var key in this.stored_registry) {
            var registry = this.stored_registry[key];
            registry.name = key
            func(registry)
        }
    }

    public verifyEvent( message:Message ) {
        //verify that we do/don't have the registry
        const registry_name = this.events_registry[message.event]
        if(!registry_name) {
            debug('No event with matching registry')
            return false
        }
        return this.registryByName(registry_name)
    }

    public registryByName(registry_name:string) {
        const registry = this.registry_by_name[registry_name]
        //Maybe add app id checking later

        if(registry) {
            return registry
        } else {
            return false            
        }
    }

    public getFromProcess(message:Message) {
        const registry_item = this.registry_by_name[message.from]
        for (let i = 0; i < registry_item.instances.length; i++) {
            const instance = registry_item.instances[i];
            if(instance.instance_id == message.instance_id) {
                var from_process = instance.process
                break;
            }
        }
        return from_process
    }

    public markUsed(registry_name, instance_id) {
        for (const key in this.stored_registry) {
            if (this.stored_registry.hasOwnProperty(key)) {
                if(key == registry_name) {
                    for (let i = 0; i < this.stored_registry[key].instances.length; i++) {
                        if(this.stored_registry[key].instances[i].instance_id == instance_id) {
                            this.stored_registry[key].instances[i].in_use = true
                            break;
                        }
                    }
                }
            }
        }
    }

    public markUnused(registry_name, instance_id) {
        for (const key in this.stored_registry) {
            if (this.stored_registry.hasOwnProperty(key)) {
                if(key == registry_name) {
                    for (let i = 0; i < this.stored_registry[key].instances.length; i++) {
                        if(this.stored_registry[key].instances[i].instance_id == instance_id) {
                            this.stored_registry[key].instances[i].in_use = false
                            break;
                        }
                    }
                }
            }
        }
    }

    //ability to receive messages from subprocesses
    public send( message:Message ) {
        //validate
        var result = validate(message, this.message_schema)
        if( !result.valid ) {
            error(result.errors)
            return false
        }
        //Verify
        var registry = this.verifyEvent(message)
        if( !registry ) {//maybe ensure that this the right registry we got back?
            return false
        }
        switch( message.data.request ) {
            case 'add_to_registry':
                this.addRegistry( message )
                break;
            default:
            case 'delete_from_registry':
                this.removeRegistry( message )
                break;
        }
        //Gotta update the registry data everytime we update it
        this.initRegistry()
    }

    private addRegistry(message:Message) {
        if( this.stored_registry[message.data.name].status && 
            this.stored_registry[message.data.name].multi_instance == false) {
            error('Request to register a pre-registered process: ' + message.data.name)
            return false
        }
        this.stored_registry[message.data.name].status = true
        if( message.data.process ) {
            var new_process_object = {
                in_use: false,
                process: message.data.process,
                instance_id: message.data.instance_id
            }
            //if instances is defined
            if( Array.isArray(this.stored_registry[message.data.name].instances) ) {
                this.stored_registry[message.data.name].instances.push(new_process_object)
            } else {
                this.stored_registry[message.data.name].instances = [new_process_object]
            }
        } else {
            console.log('Process wasnt defined...')
        }
    }

    // TODO: Figure out if removing from registry should just remove instances instead of entire registry item
    private removeRegistry(message:Message) {//Sorry, got lazy
        if( this.stored_registry[message.data.name].status ) {
            this.stored_registry[message.data.name].status = false 
        } else {
            error('Request to de-register an unassigned process: ' + message.data.name)
            return false
        }
    }

    //TBD when we figure out if other processes can be added
    public async addNewProcess(registry:RegistryObject) {
        return new Promise((resolve,reject) => {
            var result = validate(registry,registry_schema)
            if(!result.valid) {
                reject(result.errors)
            }
            delete registry.name
            registry.status = false
            //Add to the stored registry
            this.stored_registry[registry.name] = {...registry}

            //Maybe a function here to write the new registry into the file??
    
            resolve()
        })
    }
    
}