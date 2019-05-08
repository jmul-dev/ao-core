import crypto from "crypto";
import Debug from "../../AODebug";
import { ReadStream, WriteStream } from "fs";
import fs from "fs-extra";
import archiver from "archiver";
import checksum from "checksum";
import md5 from "md5";
import path from "path";
import stream from "stream";
import AORouterInterface, {
    IAORouterRequest,
    AORouterSubprocessArgs
} from "../../router/AORouterInterface";
import unzipper from "unzipper";
import dataImport from "./DataImport";
import dataExport from "./DataExport";
const debug = Debug("ao:fs");

export interface IAOFS_WriteStream_Data {
    stream: ReadStream;
    streamDirection: string;
    writePath: string;
    encrypt: boolean;
}

export interface IAOFS_CheckZipFormIndex_Data {
    stream: ReadStream;
    streamDirection: string;
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
    key?: string; //decrypt key
}

export interface IAOFS_UnzipFile_Data {
    readPath: string;
    writePath: string;
    key: string;
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

export interface IAOFS_ZipStream_Data {
    stream: ReadStream;
    writeStream: WriteStream;
    filenameWithinZip: string;
}

/**
 * AOFS
 *
 * This is the main fs package for AO. Note all reads/writes are relative
 * to the `storageLocation` argument.
 */
export default class AOFS extends AORouterInterface {
    private storageLocation: string;
    private encryptionAlgorithm: string = "aes-256-ctr";
    private checksumAlgorithm: string = "sha256";
    private checksumEncoding: string = "hex";

    constructor(args: AORouterSubprocessArgs) {
        super({ ...args, debug });
        this.storageLocation = args.storageLocation;
        this.router.on("/fs/write", this._handleWrite.bind(this));
        this.router.on("/fs/writeStream", this._handleWriteStream.bind(this));
        this.router.on("/fs/read", this._handleRead.bind(this));
        this.router.on("/fs/readStream", this._handleReadStream.bind(this));
        this.router.on("/fs/exists", this._handlePathExists.bind(this));
        this.router.on("/fs/mkdir", this._handleMkdir.bind(this));
        this.router.on("/fs/move", this._handleMove.bind(this));
        this.router.on("/fs/unlink", this._handleUnlink.bind(this));
        this.router.on("/fs/stats", this._handleFileStat.bind(this));
        this.router.on(
            "/fs/checkZipForIndexHtml",
            this._handleCheckZipForIndexHtml.bind(this)
        );
        this.router.on("/fs/zipStream", this._handleZipStream.bind(this));
        this.router.on("/fs/unzipFile", this._handleUnzipFile.bind(this));

        //Specific usecase methods
        this.router.on(
            "/fs/decryptChecksum",
            this._handleDecryptChecksum.bind(this)
        );
        this.router.on("/fs/reencrypt", this._handleReencrypt.bind(this));
        this.router.on("/fs/dataExport", this._handleDataExport.bind(this));
        this.router.on("/fs/dataImport", this._handleDataImport.bind(this));
        debug(`started`);
    }

    _handleWrite(request: IAORouterRequest) {
        const requestData: IAOFS_Write_Data = request.data;
        const writePath = path.resolve(
            this.storageLocation,
            requestData.writePath
        );
        debug(`write to [${writePath}]`);
        fs.outputFile(writePath, requestData.data)
            .then(() => {
                //fs.readFile(full_path) will return the file
            })
            .then(data => {
                var fileData = {
                    stats: fs.statSync(writePath)
                };
                request.respond(fileData);
            })
            .catch(err => {
                request.reject(err);
            });
    }

    /**
     * TODO: Figure out how we want to make these encryption keys.
     */
    newEncryptionKey() {
        return md5(new Date().getSeconds() + Math.random());
    }

    _handleCheckZipForIndexHtml(request: IAORouterRequest) {
        const requestData: IAOFS_CheckZipFormIndex_Data = request.data;
        let readStream: ReadStream = requestData.stream;
        let responded = false;
        readStream
            .pipe(unzipper.ParseOne(/index\.html?$/))
            .on("entry", function(entry) {
                // First index.html file found will hit this (parseOne)
                debug(`index.html entry path: ${entry.path}`);
                responded = true;
                request.respond({
                    indexFound: true,
                    indexPath: entry.path
                });
                entry.autodrain();
            })
            .on("error", (error: Error) => {
                if (!responded) {
                    responded = true;
                    request.reject(error);
                }
            })
            .on("finish", () => {
                if (!responded) {
                    responded = true;
                    request.respond({
                        indexFound: false
                    });
                }
            });
    }

    _handleZipStream(request: IAORouterRequest) {
        const requestData: IAOFS_ZipStream_Data = request.data;
        let readStream: ReadStream = requestData.stream;
        let zippedWriteStream: WriteStream = requestData.writeStream;
        const archive = archiver("zip", {
            zlib: { level: 9 }
        });
        archive.on("end", () => {
            request.respond({
                success: true
            });
            process.nextTick(process.exit);
        });
        archive.on("error", function(err) {
            request.reject(err);
            process.nextTick(process.exit);
        });
        archive.pipe(zippedWriteStream);
        archive.append(readStream, { name: requestData.filenameWithinZip });
        archive.finalize();
    }

    _handleWriteStream(request: IAORouterRequest) {
        const requestData: IAOFS_WriteStream_Data = request.data;
        // TODO: verify inputs
        const writePath = path.resolve(
            this.storageLocation,
            requestData.writePath
        );
        const rejectAndExit = (error: Error) => {
            // TODO: this should really attempt to cleanup resource already written (or attempted to write)
            debug(`rejectAndExit`, error);
            request.reject(error);
            process.nextTick(process.exit);
        };
        debug("writing stream to: " + writePath);
        let readStream: ReadStream = requestData.stream;
        let writeStream: WriteStream;
        try {
            writeStream = fs.createWriteStream(writePath, { autoClose: false });
        } catch (e) {
            debug("Error opening ReadStream or WriteStream", e);
            rejectAndExit(e);
            return;
        }

        const streamDebug = Debug("ao:stream");
        readStream.on("error", error => {
            streamDebug(
                `[${
                    requestData.writePath
                }] Error on read stream (subprocess fd:3):`,
                error
            );
            readStream.unpipe();
            if (error && error.code !== "EOF") {
                writeStream.destroy(error);
                streamDebug(
                    `[${
                        requestData.writePath
                    }] Destroy write stream (subprocess fd:3):`,
                    error.code
                );
            } else {
                // This is hack
                writeStream.end();
                writeStream.close();
                writeStream.emit("finish");
                streamDebug(
                    `[${
                        requestData.writePath
                    }] End write stream (subprocess fd:3):`
                );
            }
        });
        readStream.on("close", error => {
            streamDebug(
                `[${
                    requestData.writePath
                }] Read stream close (subprocess fd:3):`,
                error
            );
        });
        readStream.on("end", error => {
            streamDebug(
                `[${
                    requestData.writePath
                }] Read stream end (subprocess fd:3), this should trigger writeStream end`,
                error
            );
            writeStream.end();
        });
        writeStream.on("error", error => {
            streamDebug(
                `[${
                    requestData.writePath
                }] Error on write stream (subprocess):`,
                error
            );
            readStream.unpipe();
            readStream.resume();
            rejectAndExit(error);
        });
        writeStream.on("close", error => {
            streamDebug(
                `[${requestData.writePath}] Write stream close (subprocess):`,
                error
            );
        });
        readStream.pipe(writeStream).on("finish", () => {
            debug("Finishing writing to disk");
            const fileStats = fs.statSync(writePath);
            if (!requestData.encrypt) {
                request.respond({
                    fileSize: fileStats.size,
                    filePath: writePath
                });
                process.nextTick(process.exit);
            } else {
                const key = this.newEncryptionKey();
                const encrypt = crypto.createCipher(
                    this.encryptionAlgorithm,
                    key
                );
                const readFrom = fs.createReadStream(writePath);
                const encryptedPath = writePath + ".encrypted";
                const writeToEncrypted = fs.createWriteStream(encryptedPath);

                //Grab the file checksum prior to encryption.
                checksum.file(
                    writePath,
                    {
                        algorithm: this.checksumAlgorithm,
                        encoding: this.checksumEncoding
                    },
                    (err, originalHash) => {
                        if (err) {
                            rejectAndExit(err);
                        } else {
                            readFrom.on("error", error => {
                                debug(
                                    "handle write stream re-encryption read error: "
                                );
                                debug(error);
                            });
                            readFrom
                                .pipe(encrypt)
                                .pipe(writeToEncrypted)
                                .on("error", error => {
                                    debug(
                                        "handle write stream re-encryption error: ",
                                        error
                                    );
                                    rejectAndExit(error);
                                })
                                .on("finish", () => {
                                    //get stats for the encrypted file.
                                    const fileStats = fs.statSync(
                                        encryptedPath
                                    );
                                    debug(
                                        `${writePath}: exists ${fs.existsSync(
                                            writePath
                                        )}`
                                    );
                                    debug(
                                        `${encryptedPath}: exists ${fs.existsSync(
                                            encryptedPath
                                        )}`
                                    );
                                    //remove the original file
                                    fs.remove(writePath)
                                        .then(() => {
                                            //finally move the encrypted file to the original path
                                            fs.move(encryptedPath, writePath, {
                                                overwrite: true
                                            })
                                                .then(() => {
                                                    //Get the encrypted checksum
                                                    checksum.file(
                                                        writePath,
                                                        {
                                                            algorithm: this
                                                                .checksumAlgorithm,
                                                            encoding: this
                                                                .checksumEncoding
                                                        },
                                                        (
                                                            err,
                                                            encryptedhash
                                                        ) => {
                                                            if (err) {
                                                                rejectAndExit(
                                                                    err
                                                                );
                                                            } else {
                                                                request.respond(
                                                                    {
                                                                        fileSize:
                                                                            fileStats.size,
                                                                        filePath: writePath,
                                                                        key: key,
                                                                        checksum: originalHash,
                                                                        encryptedChecksum: encryptedhash
                                                                    }
                                                                );
                                                                // Single use event, kill process when done
                                                                process.nextTick(
                                                                    process.exit
                                                                );
                                                            }
                                                        }
                                                    ); //encrypted checksum end.
                                                })
                                                .catch(rejectAndExit); //Move end
                                        })
                                        .catch(rejectAndExit); //Remove end
                                }); //Encryption finished
                        }
                    }
                ); //checksum end
            }
        });
    }

    _handleRead(request: IAORouterRequest) {
        const requestData: IAOFS_Read_Data = request.data;
        const readPath = path.resolve(
            this.storageLocation,
            requestData.readPath
        );
        debug(`read file: ${readPath}`);
        fs.readFile(readPath, "utf8", (err, data) => {
            if (err) {
                request.reject(err);
            }
            request.respond(data);
        });
    }

    _handleReadStream(request: IAORouterRequest) {
        const requestData: IAOFS_ReadStream_Data = request.data;
        const readPath = path.resolve(
            this.storageLocation,
            requestData.readPath
        );
        const streamOptions = requestData.streamOptions || {};
        const readStream = fs.createReadStream(readPath, streamOptions);
        const receiver = fs.createWriteStream(null, { fd: 4 });

        readStream.on("open", () => {
            if (requestData.key) {
                const decrypt = crypto.createDecipher(
                    this.encryptionAlgorithm,
                    requestData.key
                );
                readStream.pipe(decrypt).pipe(receiver);
            } else {
                readStream.pipe(receiver);
            }
        });
        readStream.on("error", err => {
            request.reject(err);
            process.nextTick(process.exit);
        });

        receiver.on("finish", () => {
            debug(`writeStream::close`);
            request.respond({});
            process.nextTick(process.exit);
        });
        receiver.on("error", (error: Error) => {
            debug(`Error during write to fd WritableStream`, error);
            request.reject(error);
            process.nextTick(process.exit);
        });
    }

    _handleUnzipFile(request: IAORouterRequest) {
        const requestData: IAOFS_UnzipFile_Data = request.data;
        const readPath = path.resolve(
            this.storageLocation,
            requestData.readPath
        );
        const writePath = path.resolve(
            this.storageLocation,
            requestData.writePath
        );
        try {
            debug(`[unzip:${readPath}] attempting to unzip`);
            const readStream = fs.createReadStream(readPath);
            const writeStream = unzipper.Extract({ path: writePath });
            readStream.on("open", () => {
                if (requestData.key) {
                    debug(`[unzip:${readPath}] decryption piped into unzipper`);
                    const decrypt = crypto.createDecipher(
                        this.encryptionAlgorithm,
                        requestData.key
                    );
                    readStream.pipe(decrypt).pipe(writeStream);
                } else {
                    debug(`[unzip:${readPath}] no encryption`);
                    readStream.pipe(writeStream);
                }
            });
            readStream.on("error", err => {
                request.reject(err);
                process.nextTick(process.exit);
            });
            writeStream.on("finish", () => {
                debug(`writeStream::close`);
                request.respond({});
                process.nextTick(process.exit);
            });
            writeStream.on("error", (error: Error) => {
                debug(`Error during write to fd WritableStream`, error);
                request.reject(error);
                process.nextTick(process.exit);
            });
        } catch (error) {
            debug(
                `[unzip:${readPath}] caught error while attempting to open read stream`,
                error
            );
            request.reject(error);
            process.nextTick(process.exit);
        }
    }

    _handlePathExists(request: IAORouterRequest) {
        const requestData: IAOFS_PathExists_Data = request.data;
        const checkPath = path.resolve(this.storageLocation, requestData.path);
        fs.pathExists(checkPath, (err, exists) => {
            if (err) {
                request.reject(err);
            } else {
                request.respond({ exists: exists });
            }
        });
    }

    _handleMkdir(request: IAORouterRequest) {
        const requestData: IAOFS_Mkdir_Data = request.data;
        const dirPath = path.resolve(this.storageLocation, requestData.dirPath);
        fs.ensureDir(dirPath)
            .then(() => {
                request.respond({});
            })
            .catch(err => {
                request.reject(err);
            });
    }
    _handleMove(request: IAORouterRequest) {
        const requestData: IAOFS_Move_Data = request.data;
        const srcPath = path.resolve(this.storageLocation, requestData.srcPath);
        const destPath = path.resolve(
            this.storageLocation,
            requestData.destPath
        );
        debug(`Moving [${srcPath}] -> [${destPath}]`);
        fs.move(srcPath, destPath)
            .then(() => {
                request.respond({});
            })
            .catch(request.reject);
    }

    _handleUnlink(request: IAORouterRequest) {
        const requestData: IAOFS_Unlink_Data = request.data;
        const removePath = requestData.isAbsolute
            ? requestData.removePath
            : path.resolve(this.storageLocation, requestData.removePath);
        fs.remove(removePath, err => {
            if (err) {
                request.reject(err);
            }
            request.respond({});
        });
    }

    _handleFileStat(request: IAORouterRequest) {
        const requestData: IAOFS_FileStat_data = request.data;
        const filePath = path.resolve(this.storageLocation, requestData.path);
        debug(`Attempt to stat: ${filePath}`);
        try {
            const fileStats = fs.statSync(filePath);
            request.respond(fileStats);
        } catch (e) {
            request.reject(e);
        }
    }

    _handleDecryptChecksum(request: IAORouterRequest) {
        const requestData: IAOFS_DecryptCheck_Data = request.data;
        const filePath = path.resolve(this.storageLocation, requestData.path);
        debug(
            `[${
                requestData.path
            }] attempting to decrypt and checksum content...`
        );
        fs.stat(filePath, (err, stat) => {
            if (!err && !stat.isFile()) err = new Error("Not a file");
            if (err) request.reject(err);

            let readStream = fs.createReadStream(filePath);
            //below is copied pretty much from the checksum module
            let hash = crypto.createHash(this.checksumAlgorithm);
            hash.setEncoding(this.checksumEncoding);

            const decrypt = crypto.createDecipher(
                this.encryptionAlgorithm,
                requestData.decryptionKey
            );
            readStream.pipe(decrypt).pipe(
                hash,
                { end: false }
            );
            readStream.on("end", () => {
                debug(`[${requestData.path}] decrypted, read hash`);
                hash.end();
                request.respond({
                    checksum: hash.read()
                });
                // Single use event, kill process when done
                process.nextTick(process.exit);
            });
        });
    }

    _handleReencrypt(request: IAORouterRequest) {
        const requestData: IAOFS_Reencrypt_Data = request.data;
        const originalPath = path.resolve(
            this.storageLocation,
            requestData.originalPath
        );
        const finalPath = path.resolve(
            this.storageLocation,
            requestData.finalPath
        );
        const readStream = fs.createReadStream(originalPath);
        const writeStream = fs.createWriteStream(finalPath);
        const newKey = this.newEncryptionKey();
        const encrypt = crypto.createCipher(this.encryptionAlgorithm, newKey);
        const decrypt = crypto.createDecipher(
            this.encryptionAlgorithm,
            requestData.decryptionKey
        );
        readStream
            .pipe(decrypt)
            .pipe(encrypt)
            .pipe(writeStream)
            .on("finish", () => {
                checksum.file(
                    finalPath,
                    {
                        algorithm: this.checksumAlgorithm,
                        encoding: this.checksumEncoding
                    },
                    (err, encryptedHash) => {
                        if (err) {
                            debug(err);
                            request.reject(err);
                        } else {
                            request.respond({
                                newKey: newKey,
                                encryptedChecksum: encryptedHash
                            });
                        }
                        // Single use event, kill process when done
                        process.nextTick(process.exit);
                    }
                );
            })
            .on("error", err => {
                debug(err);
                // single use process, lets exit
                process.nextTick(process.exit);
            });
    }

    _handleDataExport(request: IAORouterRequest) {
        debug("Started Data Export Process");
        const { outputPath }: IAOFS_DataExport_Data = request.data;

        dataExport({
            storageLocation: this.storageLocation,
            outputPath
        })
            .then(exportPath => {
                request.respond({ exportPath });
                // single use process, lets exit
                process.nextTick(process.exit);
            })
            .catch(error => {
                request.reject(error);
                process.nextTick(process.exit);
            });
    }

    _handleDataImport(request: IAORouterRequest) {
        debug("Starting Data Import Process");
        const { inputPath }: IAOFS_DataImport_Data = request.data;
        //Yeah, this is a brave operation
        dataImport({
            storageLocation: this.storageLocation,
            inputPath
        })
            .then(() => {
                request.respond({});
                // single use process, lets exit
                process.nextTick(process.exit);
            })
            .catch(error => {
                request.reject(error);
                // single use process, lets exit
                process.nextTick(process.exit);
            });
    }
}
