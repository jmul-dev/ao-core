import fs, { ReadStream } from 'fs';
import fsExtra from 'fs-extra'
import crypto from 'crypto'
import md5 from 'md5'
import ffprobe from 'ffprobe'
import ffprobeStatic from 'ffprobe-static'

import AORouterInterface, { IAORouterRequest } from "../../router/AORouterInterface";
import path from 'path';
import Debug from 'debug';
const debug = Debug('ao:fs');


export interface AOFS_Args {
    storageLocation: string;
}

export interface IAOFS_WriteStream_Data {
    stream: ReadStream;
    writePath: string;
    encrypt: boolean;
    videoStats: boolean;
}

export interface IAOFS_Write_Data {
    writePath: string;
    data: string;
}

export interface IAOFS_Read_Data {
    readPath: string;
}

export interface IAOFS_ReadStream_Data {
    readPath: string;
    key: string;
}

export interface IAOFS_Mkdir_Data {
    dirPath: string;
}

export interface IAOFS_Unlink_Data {
    removePath: string;
}

/**
 * AOFS
 * 
 * This is the main fs package for AO. Note all reads/writes are relative
 * to the `storageLocation` argument.
 */
export default class AOFS extends AORouterInterface {
    private storageLocation: string;
    private encryptionAlgorithm: string = 'aes-256-ctr';

    constructor(args: AOFS_Args) {
        super()
        this.storageLocation = args.storageLocation
        this.router.on('/fs/write', this._handleWrite.bind(this))
        this.router.on('/fs/writeStream', this._handleWriteStream.bind(this))
        this.router.on('/fs/read', this._handleRead.bind(this))
        this.router.on('/fs/readStream', this._handleReadStream.bind(this))
        this.router.on('/fs/mkdir', this._handleMkdir.bind(this))
        this.router.on('/fs/unlink', this._handleUnlink.bind(this))
        debug(`started`)
    }

    _handleWrite(request: IAORouterRequest) {
        const requestData: IAOFS_Write_Data = request.data;
        const writePath = path.resolve(this.storageLocation, requestData.writePath)
        fsExtra.outputFile(writePath, requestData.data)
        .then( () => {
            //fs.readFile(full_path) will return the file
        })
        .then( (data) => {
            var fileData = {
                stats: fs.statSync(writePath)
            }
            request.respond(fileData)
        })
        .catch( (err) => {
            request.reject(err)
        })
    }

    _handleWriteStream(request: IAORouterRequest) {
        const requestData: IAOFS_WriteStream_Data = request.data;
        // TODO: verify inputs
        const writePath = path.resolve(this.storageLocation, requestData.writePath)
        debug('writing stream to:', writePath)
        const destinationStream = fs.createWriteStream(writePath)
        const readStream = fs.createReadStream(null, {fd: 3})

        readStream.pipe(destinationStream)
        .on('finish', () => {
            const fileStats = fs.statSync(writePath)
            let videoStats = {}
            if(requestData.videoStats) {
                videoStats = this._getVideoDataSync(writePath)
            }
            
            if( !requestData.encrypt ) {
                request.respond({
                    fileSize: fileStats.size,
                    filePath: writePath,
                    videoStats: videoStats ? videoStats : false
                })
            } else {
                const key = md5( new Date().getSeconds() + Math.random() )
                const encrypt = crypto.createCipher(this.encryptionAlgorithm, key)
                const readFrom = fs.createReadStream(writePath)
                const encryptedPath = writePath+'.encrypted'
                const writeToEncrypted = fs.createWriteStream( encryptedPath )

                readFrom.pipe( encrypt ).pipe( writeToEncrypted )
                .on('finish', () => {
                    //get stats for the encrypted file.
                    const fileStats = fs.statSync( encryptedPath )

                    //remove the original file
                    fsExtra.remove(writePath)
                    .then(()=> {
                        //finally move the encrypted file to the original path
                        fsExtra.move(encryptedPath, writePath)
                        .then(() => {
                            request.respond({
                                fileSize: fileStats.size,
                                filePath: writePath,
                                key: key,
                                videoStats: videoStats ? videoStats : false
                            })
                        })
                        .catch(error => {
                            request.reject(error)
                        })
                    })
                    .catch(error => {
                        request.reject(error)
                    })
                })
            }
        }).on('error', (error) => {
            console.log('fs rejecting', error)
            request.reject(error)
            // TODO: 'error' event does not mean the stream is closed, 
            // should probably close up streams/cleanup
        })
    }

    //helper method for stream writes/reads.
    async _getVideoDataSync(fullPath) {
        const videoData = new Promise((resolve,reject) => {
            ffprobe(fullPath, { path: ffprobeStatic.path }, (err, info) => {
                if(err) {
                    reject(err)
                }
                const fileData = {}
                for (let i = 0; i < info.streams.length; i++) {
                    const stream = info.streams[i];
                    if(stream.codec_type == 'video') {
                        fileData['fileType'] = 'video'
                        fileData['codec'] = stream.codec_name
                        fileData['width'] = stream.width
                        fileData['height'] = stream.height
                        fileData['duration'] = stream.duration
                        resolve(fileData)
                        break;
                    }
                }
            })
        })
        return await videoData
    }

    _handleRead(request: IAORouterRequest) {
        const requestData: IAOFS_Read_Data = request.data;
        const readPath = path.resolve(this.storageLocation, requestData.readPath)
        fs.readFile(readPath, (err, data) => {
            if(err) {
                request.reject(err)
            }
            request.respond(data)
        })
    }

    _handleReadStream(request: IAORouterRequest) {
        const requestData: IAOFS_ReadStream_Data = request.data
        const readPath = path.resolve(this.storageLocation, requestData.readPath)
        const readStream = fs.createReadStream(readPath)

        readStream.on('error', (err) => {
            request.reject(err)
        })

        readStream.on('open', () => {
            var receiver = fs.createWriteStream(null, {fd:3})
            if(requestData.key) {
                const decrypt = crypto.createDecipher( this.encryptionAlgorithm, requestData.key )
                readStream.pipe(decrypt).pipe(receiver)
            } else {
                readStream.pipe(receiver)
            }
            //TODO: What message do we send??
            request.respond({})
        })
    }

    _handleMkdir(request: IAORouterRequest) {
        const requestData: IAOFS_Mkdir_Data = request.data
        const dirPath = path.resolve(this.storageLocation, requestData.dirPath)
        fsExtra.ensureDir(dirPath)
        .then( () => {
            request.respond({})
        })
        .catch( (err) => {
            request.reject(err)
        })
    }

    _handleUnlink(request: IAORouterRequest) {
        const requestData: IAOFS_Unlink_Data = request.data
        const removePath = path.resolve(this.storageLocation, requestData.removePath)
        fs.unlink(removePath, (err) => {
            if(err) {
                request.reject(err)
            }
            request.respond({})
        })
    }
}
