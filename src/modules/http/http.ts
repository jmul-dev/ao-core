import express, { Express, Response } from 'express';
import schema from '../../graphql/schema';
import { Server, AddressInfo } from 'net';
import cors from 'cors';
import path from 'path';
import { json } from "body-parser";
import { graphqlExpress, graphiqlExpress } from "apollo-server-express";
import { apolloUploadExpress } from 'apollo-upload-server';
import Debug from 'debug';
import {AOCoreProcessRouter} from "../../router/AORouterInterface";
import { AODat_Check_Data } from '../dat/dat';
import { IAOFS_ReadStream_Data } from '../fs/fs';
import { createWriteStream, WriteStream } from 'fs';
import { resolve } from 'dns';
import { AODB_UserContentGet_Data } from '../db/db';
const debug = Debug('ao:http');

export interface Http_Args {
    httpOrigin: string;
    coreOrigin: string;
    corePort: number;
}

export default class Http {
    private express: Express;
    private server: Server;
    private router: AOCoreProcessRouter;

    constructor(router:AOCoreProcessRouter, options: Http_Args) {
        this.router = router;
        this.express = express();
        const graphqlSchema = schema(this.router, options);
        this.express.use(
            '/graphql', 
            cors({origin: options.httpOrigin}), 
            json(), 
            apolloUploadExpress({maxFieldSize: "1gb"}),
            graphqlExpress({ schema: graphqlSchema })
        );
        this.express.get('/graphiql', graphiqlExpress({ endpointURL: '/graphql' })); // TODO: enable based on process.env.NODE_ENV
        this.express.get('/resources/:key/:filename', async (request, response: Response, next) => {
            try {
                this._streamFile(request,response)
            } catch(e) {
                debug(e)
                next(e)
            }
        })
        this.express.get('/resources/decrypt/:key/:filename', async (request, response: Response, next) => {
            
            try {
                this._streamEncryptedFile(request,response)
            } catch(e) {
                debug(e)
                next(e)
            }
        })
        this.express.use('/assets', express.static(path.join(__dirname, '../../../assets')));
        this.server = this.express.listen(options.corePort, () => {
            const address: AddressInfo = <AddressInfo> this.server.address();
            debug('Express server running on port: ' + address.port);
            this.router.send('/core/log', {message: `[AO Http] server running on port ${address.port} with cors ${options.httpOrigin}`})
        });
        this.server.on('error', this.shutdown.bind(this));
        debug(`started`)
    }

    private _streamFile(request,response) {
        return new Promise( (resolve,reject) => {

            const datKey = request.params.key
            const filename = request.params.filename

            //First check to make sure the file exists in the dat check
            const datCheckData: AODat_Check_Data = {
                key: datKey
            }
            this.router.send('/dat/check',datCheckData)
            .then(() => {
                const readFileData: IAOFS_ReadStream_Data = {
                    stream: response,
                    streamDirection: 'read',
                    readPath: path.join('content',datKey,filename)
                }
                this.router.send('/fs/readStream',readFileData).then(() => {
                    resolve()
                }).catch(reject)
            }).catch(reject)
        })
    }

    private _streamEncryptedFile(request,response) {
        return new Promise( (resolve, reject) => {
            const datKey = request.params.key
            const filename = request.params.filename

            //make sure dat exists
            const datCheckData: AODat_Check_Data = {
                key: datKey
            }
            this.router.send('/dat/check', datCheckData)
            .then( () => {
                debug('got to dat check')
                //get the decryption key
                const userContentData: AODB_UserContentGet_Data = {
                    query: { fileDatKey: datKey }
                }
                this.router.send('/db/user/content/get',userContentData)
                .then( (doc) => {
                    if(doc.data.length) {
                        let docData = doc.data[0]
                        var range = request.headers.range;
                        var positions = range.replace(/bytes=/, "").split("-");
                        var start = parseInt(positions[0], 10);
                        var total = docData.fileSize;
                        var end = positions[1] ? parseInt(positions[1], 10) : total - 1;
                        var chunksize = (end - start) + 1;

                        response.writeHead(206, {
                            "Content-Range": "bytes " + start + "-" + end + "/" + total,
                            "Accept-Ranges": "bytes",
                            "Content-Length": chunksize,
                            "Content-Type": "video/mp4"
                        });
                        //Stream the freaken file
                        const readFileData: IAOFS_ReadStream_Data = {
                            stream: response,
                            streamDirection: 'read',
                            streamOptions: { start: start, end: end },
                            readPath: path.join('content',datKey,filename),
                            key: docData.decryptionKey
                        }
                        debug(docData.decryptionKey)
                        this.router.send('/fs/readStream',readFileData).then(() => {
                            debug('got past readFile')
                            resolve()
                        }).catch(reject)
                    } else {
                        reject(new Error('No such datKey'))
                    }
                }).catch(reject)
            }).catch(reject)
        })
    }

    public shutdown(err?: Error) {
        this.server.close()
    }
}