import Debug from 'debug';
import { ChildProcess, spawn } from 'child_process';
import path from 'path';
import AORouterInterface from './AORouterInterface';
import fs from 'fs';
const debug = Debug('ao:main');

// spawn the router
const processLocation = path.join(__dirname, 'AORouter.js');
const processArgs = [processLocation, '--ao-core']
let routerProcess: ChildProcess = spawn(process.execPath, processArgs, {
    stdio: ['ipc', 'inherit', 'inherit', 'pipe', 'pipe']
})

class TestMain extends AORouterInterface {
    constructor(routerProcess) {
        super(routerProcess, debug, 'main')
        this.router.on('/core/log', this._handleLog.bind(this))
    }
    _handleLog(message) {
        debug('Handle /core/log in main process...')
    }
    sendTest() {
        debug('sending router /test/debug...')
        this.router.send('/test/debug').then(response => {
            debug('received response from router /test/debug:', response.data)
            this.router.send('/test/debug')
        }).catch(error => {
            debug('received error response from router /test/debug:', error)
        })
    }
    testStream() {
        const inputStream = fs.createReadStream('/Users/neilharlow/Desktop/test-stream.png');
        this.router.send('/fs/write/stream', {
            stream: inputStream,
            writePath: '/Users/neilharlow/Desktop/test-stream.out.png',
            test: true
        }).then(response => {
            debug('testStream:response', response.data)
        }).catch(error => {
            debug('testStream:error', error)
        })
    }
}
const test = new TestMain(routerProcess)
// test.sendTest()
test.testStream()
