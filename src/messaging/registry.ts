'use strict';
//Should the registry be a database/persisted storage thing?  If so, how far should we go with encryption?

import registry_schema from './registry_schema'
import process_schema from './process_schema'
import {validate} from 'jsonschema'
import Debug from 'debug';
const debug = Debug('ao:core');
const error = Debug('ao:core:error');


interface ProcessObject {
    registry_name: string,
    process: object
}

interface RegistryObject {
    priority: number,
    name: string,
    type: string,
    file: string,
    process: object
}

//Fake data for now.  We'll have to do an FS read, & encryption/decryption for this.
var model_registry:Array<any> = [
    {
        priority: 0,
        name: 'p2pSubProcess',
        type: 'system',
        file: '../dist/p2p/index.js',//Relative or absolute.
    }
]



export default class Registry {
    constructor() {
        
    }
    private model_registry:Array<any>
    private registry_schema:Object = registry_schema
    private process_schema:Object = process_schema

    async loadRegistry() {
        return new Promise( (resolve,reject) => {
            //read from FS and decode later using a key? will have to figure this out.
            this.model_registry = model_registry
            resolve(model_registry);
        })
    }
    
    async addRegistry(new_registry:RegistryObject) {
        return new Promise((resolve,reject) => {
            //add to the model
            //save the model
            return
        })
    }
    
    async addProcess(process_object:ProcessObject) {
        if(!this.model_registry) {
            try {
                await this.loadRegistry()
            } catch(err) {
                error(err)
            }
        }
        var result = validate(process_object, this.process_schema)
        if(result.valid) {
            var record = this.findInRegistry(process_object.registry_name)
            record 
        } else {
            error('Process validation failed')
        }

        return;
    }

    private findInRegistry(name:string) {
        for (var i = 0; i < this.model_registry.length; i++) {
            var item = this.model_registry[i]
            if(item.name == name) {
                return item
            }
        }
    }
    send(message:Object) {
        //verify the message with the registry


    }
    verify() {
        //verify that we do/don't fail the registry
        if(true) {
            return {test:'test'}
        } else {
            return {error:'not good'}
        }
        
    }
}