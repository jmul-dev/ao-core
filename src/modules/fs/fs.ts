import crypto from 'crypto';
import Debug from '../../AODebug'
import ffprobe from 'ffprobe';
import fs, { ReadStream } from 'fs';
import fsExtra from 'fs-extra';
import archiver from 'archiver'
import checksum from 'checksum';
import md5 from 'md5';
import path from 'path';
import stream from 'stream';
import AORouterInterface, { IAORouterRequest } from "../../router/AORouterInterface";
import unzip from 'unzipper';
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

export interface IAOFS_DataExport_Data {
    outputPath: string;
}

export interface IAOFS_DataImport_Data {
    inputPath: string;
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
        this.router.on('/fs/dataExport', this._handleDataExport.bind(this))
        this.router.on('/fs/dataImport', this._handleDataImport.bind(this))
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
        debug('writing stream to: '+ writePath )
        const destinationStream = fs.createWriteStream(writePath, { autoClose:true })
        let readStream
        try {
            readStream = fs.createReadStream(null, { fd: 3, autoClose:true })
        } catch(e) {
            debug(e)
        }
        
        readStream
        .on('error', (error) => {
            debug('hanle write stream original read error:')
            debug(error)
        })
        .on('end', () => {
            debug('readStream: End of file')
        })
        
        readStream.pipe(destinationStream)
            .on('error', (error) => {
                console.log('fs rejecting', error)
                request.reject(error)
                // TODO: 'error' event does not mean the stream is closed, 
                // should probably close up streams/cleanup
            })
            .on('end', ()=> {
                debug('pipe: End of file')
            })
            .on('finish', () => {
                debug('Finish is called')
                readStream.close()
                readStream.push(null)
                readStream.read(0)
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
                                        readFrom.on('error', (error) => {
                                            debug('handle write stream re-encryption read error: ')
                                            debug(error)
                                        })
                                        readFrom.pipe(encrypt)
                                        .pipe(writeToEncrypted)
                                        .on('error', (error) => {
                                            debug('handle write stream re-encryption error: ')
                                            debug(error)
                                        })
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
                finalPath,
                {algorithm: this.checksumAlgorithm, encoding: this.checksumEncoding},
                (err, encryptedHash) => {
                    if(err) {
                        debug(err)
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

    _handleDataExport(request: IAORouterRequest) {
        debug('Started Data Export Process')
        const { outputPath }: IAOFS_DataExport_Data = request.data
        const exportFilename = md5( new Date() ) + '-export.zip'
        const exportFullPath = path.join(outputPath, exportFilename )
        //Setup output
        const output = fs.createWriteStream( exportFullPath )
        //Setup arhiver
        const archive = archiver ('zip', {
            zlib: { level: 9 }
        })

        //Define output events
        output.on('close', () => {
            debug(archive.pointer() + ' total bytes zipped')
            debug('Data export complete')
            request.respond({exportPath: exportFullPath})
        })
        output.on('end',() => {
            debug('Export data fully fed')
        })

        //Setup archive events
        archive.on('warning', (err) => {
            if (err.code === 'ENOENT') {
                debug(err)
            } else {
                // throw error
                request.reject(err)
                return
            }
        })        
        archive.on('error', (err) => {
            request.reject(err)
        })

        //Feed the data through
        archive.pipe(output)
        archive.directory(this.storageLocation, false)
        archive.finalize()

    }

    _handleDataImport(request:IAORouterRequest) {
        debug('Starting Data Import Process')
        const { inputPath }: IAOFS_DataImport_Data = request.data
        //Yeah, this is a brave operation
        fsExtra.remove(this.storageLocation, (err) => {
            if(err) {
                request.reject(err)
                return
            }
            const unzipper = unzip.Extract({path:this.storageLocation})
            const input = fs.createReadStream(inputPath)
            input.pipe(unzipper)
            input.on('error', (error) => {
                debug('Unzip input error: ', error)
                request.reject(error)
            })
            unzipper.on('close',() => {
                request.respond({})
            })
            unzipper.on('error', (error) => {
                debug('Unzip error: ', error)
                request.reject(error)
            })
        })

        
    }
    
}
