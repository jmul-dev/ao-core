'use strict';
import Message from './message'
import Debug from 'debug';
import Registry from './registry';
const debug = Debug('ao:core');
const error = Debug('ao:core:error');
import {RegistryObject} from './message_interfaces'

export default class Router {    
    private registry: Registry;
    private registry_item: RegistryObject;
    constructor( registry ) {
        this.registry = registry
    }
    public send(message:Message) {
        //data validation
        this.validate(message)
        .then( () => {
            this.registry_item = this.registry.verify(message)
        } )//registration check
        .then(this.callMethod.bind(this))
        .catch((err)=> {
            error(err)
        })
    }
    private async validate( message:Message ) {
        return new Promise((resolve,reject) => {
            //basic data validation
            resolve(message)  
        })
    }
    private async callMethod( message:Message ) {
        return new Promise( ( resolve,reject ) => {
            this.registry_item.process.send()
            resolve(message)
        })
    }
}