import crypto from 'crypto';
import Debug from 'debug';
import ffprobe from 'ffprobe';
import fs, { ReadStream } from 'fs';
import fsExtra from 'fs-extra';
import checksum from 'checksum';
import md5 from 'md5';
import path from 'path';
import stream from 'stream';
import AORouterInterface, { IAORouterRequest } from "../../router/AORouterInterface";
const debug = Debug('ao:fs');


export interface AOFS_Args {
    storageLocation: string;
    ffprobeBin: string;
}

export interface IAOFS_WriteStream_Data {
    stream: ReadStream;
    streamDirection: string;
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
    stream: stream.Writable;
    streamDirection: string;
    readPath: string;
    streamOptions?: Object;
    key?: string;   //decrypt key
}

export interface IAOFS_PathExists_Data {
    path: string;
}

export interface IAOFS_Mkdir_Data {
    dirPath: string;
}

export interface IAOFS_Move_Data {
    srcPath: string;
    destPath: string;
}

export interface IAOFS_Unlink_Data {
    removePath: string;
    isAbsolute?: boolean;
}

export interface IAOFS_FileStat_data {
    path: string;
}

export interface IAOFS_DecryptCheck_Data {
    path: string;
    decryptionKey: string;
}

export interface IAOFS_Reencrypt_Data {
    originalPath: string;
    decryptionKey: string;
    finalPath: string;
}


/**
 * AOFS
 * 
 * This is the main fs package for AO. Note all reads/writes are relative
 * to the `storageLocation` argument.
 */
export default class AOFS extends AORouterInterface {
    private storageLocation: string;
    private ffprobeBin: string;
    private encryptionAlgorithm: string = 'aes-256-ctr';
    private checksumAlgorithm: string = 'sha256'
    private checksumEncoding: string = 'hex'

    constructor(args: AOFS_Args) {
        super()
        this.storageLocation = args.storageLocation
        this.ffprobeBin = args.ffprobeBin
        this.router.on('/fs/write', this._handleWrite.bind(this))
        this.router.on('/fs/writeStream', this._handleWriteStream.bind(this))
        this.router.on('/fs/read', this._handleRead.bind(this))
        this.router.on('/fs/readStream', this._handleReadStream.bind(this))
        this.router.on('/fs/exists', this._handlePathExists.bind(this))
        this.router.on('/fs/mkdir', this._handleMkdir.bind(this))
        this.router.on('/fs/move', this._handleMove.bind(this))
        this.router.on('/fs/unlink', this._handleUnlink.bind(this))
        this.router.on('/fs/stats', this._handleFileStat.bind(this))

        //Specific usecase methods
        this.router.on('/fs/decryptChecksum', this._handleDecryptChecksum.bind(this))
        this.router.on('/fs/reencrypt', this._handleReencrypt.bind(this) )
        debug(`started`)
    }

    _handleWrite(request: IAORouterRequest) {
        const requestData: IAOFS_Write_Data = request.data;
        const writePath = path.resolve(this.storageLocation, requestData.writePath)
        fsExtra.outputFile(writePath, requestData.data)
            .then(() => {
                //fs.readFile(full_path) will return the file
            })
            .then((data) => {
                var fileData = {
                    stats: fs.statSync(writePath)
                }
                request.respond(fileData)
            })
            .catch((err) => {
                request.reject(err)
            })
    }

    /**
     * TODO: Figure out how we want to make these encryption keys.
     */
    newEncryptionKey() {
        return md5(new Date().getSeconds() + Math.random())
    }

    _handleWriteStream(request: IAORouterRequest) {
        const requestData: IAOFS_WriteStream_Data = request.data;
        // TODO: verify inputs
        const writePath = path.resolve(this.storageLocation, requestData.writePath)
        debug('writing stream to:', writePath)
        const destinationStream = fs.createWriteStream(writePath)
        const readStream = fs.createReadStream(null, { fd: 3 })

        readStream.pipe(destinationStream)
            .on('finish', () => {
                const fileStats = fs.statSync(writePath)
                this._getVideoData(writePath, requestData.videoStats)
                    .then((videoStats) => {
                        if (!requestData.encrypt) {
                            request.respond({
                                fileSize: fileStats.size,
                                filePath: writePath,
                                videoStats: videoStats ? videoStats : false
                            })
                        } else {
                            const key = this.newEncryptionKey()
                            const encrypt = crypto.createCipher(this.encryptionAlgorithm, key)
                            const readFrom = fs.createReadStream(writePath)
                            const encryptedPath = writePath + '.encrypted'
                            const writeToEncrypted = fs.createWriteStream(encryptedPath)

                            //Grab the file checksum prior to encryption.
                            checksum.file(
                                writePath,
                                {algorithm: this.checksumAlgorithm, encoding: this.checksumEncoding},
                                (err, originalHash) => {
                                    if(err) {
                                        request.reject(err)
                                    } else {
                                        readFrom.pipe(encrypt).pipe(writeToEncrypted)
                                        .on('finish', () => {
                                            //get stats for the encrypted file.
                                            //const fileStats = fs.statSync( encryptedPath )
                                            
                                            //remove the original file
                                            fsExtra.remove(writePath)
                                            .then(() => {
                                                //finally move the encrypted file to the original path
                                                fsExtra.move(encryptedPath, writePath)
                                                .then(() => {
                                                    //Get the encrypted checksum
                                                    checksum.file(
                                                        writePath,
                                                        {algorithm: this.checksumAlgorithm, encoding: this.checksumEncoding},
                                                        (err, encryptedhash) => {
                                                            if(err) {
                                                                request.reject(err)
                                                            } else {
                                                                request.respond({
                                                                    fileSize: fileStats.size,
                                                                    filePath: writePath,
                                                                    key: key,
                                                                    videoStats: videoStats ? videoStats : false,
                                                                    checksum: originalHash,
                                                                    encryptedChecksum: encryptedhash
                                                                })
                                                            }
                                                    })//encrypted checksum end.
                                                }).catch(request.reject) //Move end

                                            }).catch(request.reject)  //Remove end
                                        })//Encryption finished
                                    }
                                }
                            )//checksum end
                        }
                    })
                    .catch(e => {
                        request.reject(e)
                    })

            }).on('error', (error) => {
                console.log('fs rejecting', error)
                request.reject(error)
                // TODO: 'error' event does not mean the stream is closed, 
                // should probably close up streams/cleanup
            })
    }

    //helper method for stream writes/reads.
    _getVideoData(fullPath, videoStats) {
        return new Promise((resolve, reject) => {
            if (!videoStats) {
                resolve(false)
            } else {
                ffprobe(fullPath, { path: this.ffprobeBin }, (err, info) => {
                    if (err) {
                        reject(err)
                    }
                    const fileData = {}
                    for (let i = 0; i < info.streams.length; i++) {
                        const stream = info.streams[i];
                        if (stream.codec_type == 'video') {
                            fileData['encoding'] = stream.codec_name
                            fileData['duration'] = parseFloat(stream.duration)
                            fileData['width'] = stream.width
                            fileData['height'] = stream.height
                            fileData['aspectRatio'] = stream.width / stream.height
                            fileData['aspectRatioDisplay'] = stream.display_aspect_ratio
                            fileData['bitRate'] = parseInt(stream.bit_rate)
                            fileData['frameRate'] = eval(stream.avg_frame_rate)  // ex avg_frame_rate: "25/1"
                            resolve(fileData)
                            break;
                        }
                    }
                })
            }
        })
    }

    _handleRead(request: IAORouterRequest) {
        const requestData: IAOFS_Read_Data = request.data;
        const readPath = path.resolve(this.storageLocation, requestData.readPath)
        fsExtra.readFile(readPath, 'utf8',(err, data) => {
            if (err) {
                request.reject(err)
            }
            request.respond(data)
        })
    }

    _handleReadStream(request: IAORouterRequest) {
        const requestData: IAOFS_ReadStream_Data = request.data
        const readPath = path.resolve(this.storageLocation, requestData.readPath)
        const streamOptions = requestData.streamOptions || {}
        const readStream = fs.createReadStream(readPath, streamOptions)

        readStream.on('error', (err) => {
            request.reject(err)
        })

        readStream.on('open', () => {
            var receiver = fs.createWriteStream(null, { fd: 4 })
            if (requestData.key) {
                const decrypt = crypto.createDecipher(this.encryptionAlgorithm, requestData.key)
                readStream.pipe(decrypt).pipe(receiver)
            } else {
                readStream.pipe(receiver)
            }
            //TODO: What message do we send??
            request.respond({})
        })
    }

    _handlePathExists(request:IAORouterRequest) {
        const requestData:IAOFS_PathExists_Data = request.data
        const checkPath = path.resolve(this.storageLocation, requestData.path)
        fsExtra.pathExists(checkPath, (err, exists) => {
            if(err) {
                request.reject(err)
            } else {
                request.respond({exists: exists})
            }
        })
    }

    _handleMkdir(request: IAORouterRequest) {
        const requestData: IAOFS_Mkdir_Data = request.data
        const dirPath = path.resolve(this.storageLocation, requestData.dirPath)
        fsExtra.ensureDir(dirPath)
            .then(() => {
                request.respond({})
            })
            .catch((err) => {
                request.reject(err)
            })
    }
    _handleMove(request: IAORouterRequest) {
        const requestData: IAOFS_Move_Data = request.data
        const srcPath = path.resolve(this.storageLocation, requestData.srcPath)
        const destPath = path.resolve(this.storageLocation, requestData.destPath)
        fsExtra.move(srcPath, destPath)
            .then(() => {
                request.respond({})
            }).catch(request.reject)
    }

    _handleUnlink(request: IAORouterRequest) {
        const requestData: IAOFS_Unlink_Data = request.data
        const removePath = requestData.isAbsolute ? requestData.removePath : path.resolve(this.storageLocation, requestData.removePath)
        fsExtra.remove(removePath, (err) => {
            if (err) {
                request.reject(err)
            }
            request.respond({})
        })
    }

    _handleFileStat(request: IAORouterRequest) {
        const requestData: IAOFS_FileStat_data = request.data
        const filePath = path.resolve(this.storageLocation, requestData.path)
        try {
            const fileStats = fs.statSync(filePath)
            request.respond(fileStats)
        } catch (e) {
            request.reject(e)
        }
    }

    _handleDecryptChecksum(request: IAORouterRequest) {
        const requestData: IAOFS_DecryptCheck_Data = request.data
        const filePath = path.resolve(this.storageLocation, requestData.path)
        
        fs.stat(filePath, (err, stat) => {
            if (!err && !stat.isFile()) err = new Error('Not a file')
            if (err) request.reject(err)

            let readStream = fs.createReadStream(filePath)
            //below is copied pretty much from the checksum module
            let hash = crypto.createHash(this.checksumAlgorithm)
            hash.setEncoding(this.checksumEncoding)
            
            const decrypt = crypto.createDecipher(this.encryptionAlgorithm, requestData.decryptionKey)
            readStream.pipe(decrypt).pipe(hash, {end: false})
            readStream.on('end', () => {
                hash.end()
                request.respond({
                    checksum: hash.read()
                })
            })
        })
    }

    _handleReencrypt(request: IAORouterRequest) {
        const requestData: IAOFS_Reencrypt_Data = request.data
        const originalPath = path.resolve(this.storageLocation, requestData.originalPath)
        const finalPath = path.resolve(this.storageLocation, requestData.finalPath)
        const readStream = fs.createReadStream(originalPath)
        const writeStream = fs.createWriteStream(finalPath)
        const newKey = this.newEncryptionKey()
        const encrypt = crypto.createCipher(this.encryptionAlgorithm, newKey)
        const decrypt = crypto.createDecipher(this.encryptionAlgorithm, requestData.decryptionKey)
        readStream.pipe(decrypt).pipe(encrypt).pipe(writeStream)
        .on('finish', () => {
            checksum.file(
                requestData.finalPath,
                {algorithm: this.checksumAlgorithm, encoding: this.checksumEncoding},
                (err, encryptedHash) => {
                    if(err) {
                        request.reject(err)
                    } else {
                        request.respond({
                            newKey: newKey,
                            encryptedChecksum: encryptedHash
                        })
                    }
                })
        }).on('error', (err) => {
            debug(err)
        })
    }
    
}
