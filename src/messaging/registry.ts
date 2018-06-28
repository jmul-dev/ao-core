'use strict';
//Should the registry be a database/persisted storage thing?  If so, how far should we go with encryption?

import {registry_schema, process_schema, message_schema} from './validation_schemas'
import {validate} from 'jsonschema'
import Debug from 'debug';
import Router from './router';
import Message from './message'
import {ProcessObject,RegistryObject} from './message_interfaces'
const debug = Debug('ao:core');
const error = Debug('ao:core:error');


//Fake data for now.  We'll have to do an FS read, & encryption/decryption for this.
var stored_registry:Array<any> = [
    {
        priority: 0,
        name: 'registry',
        type: 'main',//specifically made for registrations and other main processes
        file: '',//empty means that it sends to main
        events: [
            "register_process"
        ]
    },
    {
        priority: 0,
        name: 'p2pSubProcess',
        type: 'subprocess',
        file: '/p2p/index.js',//Relative or absolute.  assumes /dist
        events: [
            "p2p_lookup",
            "p2p_peer_count"
        ]
    }
]

/**
 * Below is what the live_registry JSON is supposed to look like:
 {
     p2pSubProcess: {
         status: 1,
         type: 'subprocess',
         events: [
            "p2p_lookup",
            "p2p_peer_count"
         ]
     },
     registry: {
         status: 1,
         type: 'subprocess',
         events: [
            "register_process"
         ]
     }
 }
 */

export default class Registry {

    //Internal Data
    private stored_registry:Array<any>
    private events_registry:Object = {}      //Used to tie together events to a registry by name
    private registry_by_name:Object = {}     //Now you can use a name to just pull the registry item
    private router:Router

    //Externally accessible data
    public live_registry:Object = {}

    //Validation Schema
    private registry_schema:Object = registry_schema
    private process_schema:Object = process_schema
    private message_schema:Object = message_schema

    constructor() {
        
    }

    //Init the Registry and get yourself a router!
    async initialize() {
        return new Promise( (resolve,reject) => {
            this.initRegistry()
            .then(() => {
                this.router = new Router(this)
                resolve(this.router)
            })
            .catch(e => {
                error(e)
                reject(e)
            })
        })
    }

    //Maybe in the future we encrypt/decrypt the registry?  Maybe load a password/key to this loadRegistry?
    private async initRegistry() {
        return new Promise( (resolve,reject) => {
            //read from FS and decode later using a key? will have to figure this out.
            this.stored_registry = stored_registry // This is a "mock" model registry for now.

            //repacking information for easy use            
            for (let i = 0; i < stored_registry.length; i++) {
                //The only special case.
                if(stored_registry[i].name == 'registry') {
                    stored_registry[i].process = this
                }

                const registry = stored_registry[i];
                this.registry_by_name[registry.name] = registry

                for (let e = 0; e < registry.events.length; e++) {
                    const event = registry.events[e];
                    this.events_registry[event] = registry.name
                }
            }
            resolve();
        })
    }

    public loopStoredRegistries(func:Function) {
        for (let i = 0; i < this.stored_registry.length; i++) {
            const registry = this.stored_registry[i];
            func(registry)
        }
    }
    

    public verify( message:Message ) {
        //verify that we do/don't have the registry
        const registry_name = this.events_registry[message.event]
        if(!registry_name) {return false}
        const registry = this.registry_by_name[registry_name]

        //Maybe add app id checking later

        if(registry) {
            return registry
        } else {
            return false            
        }
    }

    //ability to receive messages from other 
    public send( message:Message ) {
        //validate
        var result = validate(message, this.message_schema)
        if( !result.valid ) {
            error(result.errors)
            return false
        }
        //Verify
        var registry = this.verify(message)
        if( !registry ) {
            return false
        }
        switch( message.data.request ) {
            case 'add_to_registry':
                this.addLiveRegistry( message )
                break;
            default:
            case 'delete_from_registry':
                this.removeLiveRegistry( message )
                break;
        }
    }

    private addLiveRegistry(message:Message) {
        if( message.data.name in this.live_registry ) {
            error('Request to register a pre-registered process: ' + message.data.name)
            return false
        }
        this.live_registry[message.data.name] = {
            type: message.data.type,
            events: this.registry_by_name[message.data.name].events
        }
        if( message.data.process ) {
            this.live_registry[message.data.name].process = message.data.process
        }

    }

    private removeLiveRegistry(message:Message) {
        if( message.data.name in this.live_registry ) {
            delete this.live_registry[message.data.name]
        } else {
            error('Request to de-register an unassigned process: ' + message.data.name)
            return false
        }
    }
    
}