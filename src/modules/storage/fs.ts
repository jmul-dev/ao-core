import fs, { ReadStream } from 'fs';
import AORouterInterface, { IAORouterRequest } from "../../routing/AORouterInterface";
import Debug from 'debug';
const debug = Debug('ao:fs');

/**
 * Request format interfaces
 */
interface IAOFS_WriteStream_Data {
    stream: ReadStream;
    writePath: string;
}

class AOFS extends AORouterInterface {
    constructor() {
        super(undefined, debug, 'fs')
        this.router.on('/fs/write/stream', this._handleWriteStream.bind(this))
    }
    _handleWriteStream(request: IAORouterRequest) {
        const requestData: IAOFS_WriteStream_Data = request.data;
        // debug(requestData.stream)
        // debug(fs.createReadStream(requestData.writePath))
        
        // TODO: verify inputs
        const destinationStream = fs.createWriteStream(requestData.writePath)
        requestData.stream.pipe(destinationStream).on('finish', () => {
            const fileStats = fs.statSync(requestData.writePath)
            request.respond({
                fileSize: fileStats.size,
                filePath: requestData.writePath,
            })
        }).on('error', (error) => {
            console.log('fs rejecting', error)
            request.reject(error)
            // TODO: 'error' event does not mean the stream is closed, 
            // should probably close up streams/cleanup
        }).on('end', () => {
            debug('WE HIT THE END OF READ STREAM')
        }).on('data', () => {
            debug('WE RECEIVED DATA FROM READ STREAM')
        })
    }
}

if (require.main === module) {
    new AOFS()
}