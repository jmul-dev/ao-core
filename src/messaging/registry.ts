'use strict';
//Should the registry be a database/persisted storage thing?  If so, how far should we go with encryption?

import registry_schema from './registry_schema'
import process_schema from './process_schema'
import {validate} from 'jsonschema'
import { join } from "path";
import { spawn } from "child_process";
import Debug from 'debug';
import Router from './router';
import Message from './message'
import {ProcessObject,RegistryObject} from './message_interfaces'
const debug = Debug('ao:core');
const error = Debug('ao:core:error');


//Fake data for now.  We'll have to do an FS read, & encryption/decryption for this.
var model_registry:Array<any> = [
    {
        priority: 0,
        name: 'p2pSubProcess',
        type: 'system',
        file: '/p2p/index.js',//Relative or absolute.  assumes /dist
        events: [
            "p2p_lookup",
            "p2p_peer_count"
        ]
    }
]

export default class Registry {

    //Internal Data
    private model_registry:Array<any>
    private events_registry:Object = {}      //Used to tie together events to a registry by name
    private registry_by_name:Object = {}     //Now you can use a name to just pull the registry item
    
    //Validation Schema
    private registry_schema:Object = registry_schema
    private process_schema:Object = process_schema

    //Init the Registry and get yourself a router!
    async initialize() {
        return new Promise( (resolve,reject) => {
            this.loadRegistry()
            .then(this.loadProcesses.bind(this))
            .then(() => {
                return new Router(this)
            })
            .catch(e => {
                error(e)
            })
        })
    }

    async loadRegistry() {
        return new Promise( (resolve,reject) => {
            //read from FS and decode later using a key? will have to figure this out.
            this.model_registry = model_registry

            //repacking information for easy use            
            for (let i = 0; i < model_registry.length; i++) {
                const registry = model_registry[i];
                this.registry_by_name[registry.name] = registry
                for (let e = 0; e < registry.events.length; e++) {
                    const event = registry.events[e];
                    this.events_registry[event] = registry.name
                }
            }
            resolve();
        })
    }
    
    async addRegistry(new_registry:RegistryObject) {
        return new Promise((resolve,reject) => {
            //add to the model
            //save the model
            return
        })
    }

    async loadProcesses() {
        return new Promise( (resolve,reject) => {
            let all_processes = []
            for (let i = 0; i < this.model_registry.length; i++) {
                const registry = this.model_registry[i];

                all_processes.push(new Promise((res,rej) => {
                    const current_process = spawn('node', [join(__dirname, '../../dist/'+registry.file)], {stdio: ['inherit', 'inherit', 'inherit']})
                    current_process.on('error', (err) => {
                        error( registry.name+' failed to start: ', err)
                    })
                    current_process.on('close', (code) => {
                        debug( registry.name+' closed on us with code: ', code)
                    })
                    this.model_registry[i].process = current_process
                    res()
                }))
            }
            Promise.all(all_processes)
            .then( () => {
                resolve()
            })
            .catch( (e) =>{
                error(e)
            })
            
        })
    }

    verify( message:Message ) {
        //verify that we do/don't have the registry
        const registry_name = this.events_registry[message.event]
        if(!registry_name) {return false}
        const registry = this.registry_by_name[registry_name]

        if(registry) {
            return registry
        } else {
            return false
        }
    
    }
}