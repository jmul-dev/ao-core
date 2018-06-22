'use strict';
import Registry from './registry';
import Debug from 'debug';
const debug = Debug('ao:core');
const error = Debug('ao:core:error');

export default class Router {
    constructor( message:Object ) {
        //data validation
        this.validate(message)
        .then(this.registryCheck.bind(this))//registration check
        .catch((err)=> {
            error(err)
        })
    }
    validate( message:Object ) {
        return new Promise((resolve,reject) => {
            //for now...
            resolve(message)  
        })
    }
    registryCheck( message:Object ) {
        return new Promise((resolve,reject) => {
            const registry = new Registry(message)
            var verification = registry.verify()
            if(verification.error) {
                reject('failed regsitry verification')
            }
            resolve(message)
        })
    }
}