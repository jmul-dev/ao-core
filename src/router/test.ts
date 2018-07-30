import Debug from 'debug';
import { ChildProcess, spawn } from 'child_process';
import path from 'path';
import AORouterInterface, { AOCoreProcessRouter } from './AORouterInterface';
import fs from 'fs';
import AORouter from './AORouter';
const debug = Debug('ao:main');

// spawn the router
// const processLocation = path.join(__dirname, 'AORouter.js');
// const processArgs = [processLocation, '--ao-core']
// let routerProcess: ChildProcess = spawn(process.execPath, processArgs, {
//     stdio: ['ipc', 'inherit', 'inherit', 'pipe', 'pipe']
// })

// let coreRouter = new AORouter()
// coreRouter.send('/fs/write', data).then().catch()
// coreRouter.on('/debug')

class TestMain {
    private router: AOCoreProcessRouter;

    constructor() {
        const coreRouter = new AORouter({            
            storageLocation: path.resolve(__dirname, '../../data'),
            disableHttpInterface: false,
            httpPort: 3003,
            httpOrigin: 'http://localhost:3000',
        });
        coreRouter.init()
        this.router = coreRouter.router
        this.router.on('/core/log', this._handleLog.bind(this))
    }
    _handleLog(message) {
        debug('Handle /core/log in main process...')
    }
    sendTest() {
        debug('sending router /test/debug...')
        this.router.send('/test/debug').then(response => {
            debug('received response 1 from router /test/debug:', response.data)
            this.router.send('/test/debug').then(responseB => {
                debug('received response 2 from router /test/debug:', response.data)
            })
        }).catch(error => {
            debug('received error response from router /test/debug:', error)
        })
    }
    testStream() {
        const inputStream = fs.createReadStream('/Users/neilharlow/Desktop/test-stream-a.png');
        this.router.send('/fs/write/stream', {
            stream: inputStream,
            writePath: '/test-stream-a.out.png',
        }).then(response => {
            debug('test-stream-a:response', response.data)
        }).catch(error => {
            debug('test-stream-a:error', error)
        })
        const inputStreamB = fs.createReadStream('/Users/neilharlow/Desktop/test-stream-b.png');
        this.router.send('/fs/write/stream', {
            stream: inputStreamB,
            writePath: '/test-stream-b.out.png',
        }).then(response => {
            debug('test-stream-b:response', response.data)
        }).catch(error => {
            debug('test-stream-b:error', error)
        })
    }
}
const test = new TestMain()
// test.sendTest()
test.testStream()
