#!/usr/local/bin/node
'use strict';
import Debug from 'debug';
import AORouterInterface, { IAORouterRequest } from './AORouterInterface';
const debug = Debug('ao:test');

class Test extends AORouterInterface {
    constructor() {
        super(undefined, debug, 'test')
        this.router.on('/test/debug', this._handleDebug.bind(this))
        // this.router.send('/core/log', {message: 'Log me from TestProcess'})
    }
    _handleDebug(request: IAORouterRequest) {
        setTimeout(() => {
            request.respond({
                debugMessage: 'This is a response to /test/debug'
            })
        }, 2000)
    }
}

if (require.main === module) {    
    const test = new Test();
}

export default Test;