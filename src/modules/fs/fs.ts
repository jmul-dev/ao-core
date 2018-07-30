import fs, { ReadStream } from 'fs';
import AORouterInterface, { IAORouterRequest } from "../../routing/AORouterInterface";
import path from 'path';
import Debug from 'debug';
const debug = Debug('ao:fs');


export interface AOFS_Args {
    storageLocation: string;
}

interface IAOFS_WriteStream_Data {
    stream: ReadStream;
    writePath: string;
}

/**
 * AOFS
 * 
 * This is the main fs package for AO. Note all reads/writes are relative
 * to the `storageLocation` argument.
 */
export default class AOFS extends AORouterInterface {
    private storageLocation: string;

    constructor(args: AOFS_Args) {
        super()
        this.storageLocation = args.storageLocation
        this.router.on('/fs/write', this._handleWrite.bind(this))
        this.router.on('/fs/write/stream', this._handleWriteStream.bind(this))
        this.router.on('/fs/read', this._handleRead.bind(this))
        this.router.on('/fs/read/stream', this._handleReadStream.bind(this))
    }

    _handleWrite(request: IAORouterRequest) {
        request.reject(new Error('/fs/write not implemented'))
    }

    _handleWriteStream(request: IAORouterRequest) {
        const requestData: IAOFS_WriteStream_Data = request.data;
        // TODO: verify inputs
        const writePath = path.resolve(this.storageLocation, requestData.writePath)
        debug('writing stream to:', writePath)
        const destinationStream = fs.createWriteStream(writePath)
        requestData.stream.pipe(destinationStream).on('finish', () => {
            const fileStats = fs.statSync(writePath)
            request.respond({
                fileSize: fileStats.size,
                filePath: writePath,
            })
        }).on('error', (error) => {
            console.log('fs rejecting', error)
            request.reject(error)
            // TODO: 'error' event does not mean the stream is closed, 
            // should probably close up streams/cleanup
        })
    }

    _handleRead(request: IAORouterRequest) {
        request.reject(new Error('/fs/read not implemented'))
    }

    _handleReadStream(request: IAORouterRequest) {
        request.reject(new Error('/fs/read/stream not implemented'))
    }

}
