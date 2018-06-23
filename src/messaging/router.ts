'use strict';
import Registry from './registry';
import Debug from 'debug';
const debug = Debug('ao:core');
const error = Debug('ao:core:error');

export default class Router {
    registry: any;
    constructor( message:Object ) {
        this.registry = new Registry()
        
        //data validation
        this.registry.loadRegistry()
        .then(() => {
            this.validate(message)    
        })
        .then(this.registryCheck.bind(this))//registration check
        .catch((err)=> {
            error(err)
        })
    }
    validate( message:Object ) {
        return new Promise((resolve,reject) => {
            //basic data validation
            resolve(message)  
        })
    }
    registryCheck( message:Object ) {
        return new Promise((resolve,reject) => {
            const registry = new Registry()
            var verification = registry.verify()
            if(verification.error) {
                reject('failed regsitry verification')
            }
            resolve(message)
        })
    }
}