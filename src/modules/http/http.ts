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
import { IAOFS_ReadStream_Data, IAOFS_FileStat_data } from '../fs/fs';
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
    public static RESOURCES_ENDPOINT = 'resources';
    public static ENCRYPTED_RESOURCES_ENDPOINT = 'resources/user';
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
        this.express.get(`/${Http.RESOURCES_ENDPOINT}/:key/:filename`, async (request, response: Response, next) => {
            try {
                this._streamFile(request,response)
            } catch(e) {
                debug(e)
                next(e)
            }
        })
        this.express.get(`/${Http.ENCRYPTED_RESOURCES_ENDPOINT}/:key/:filename`, async (request, response: Response, next) => {
            try {
                this._streamEncryptedFile(request,response)
            } catch(e) {
                debug(e)
                next(e)
            }
        })
        // NOTE: this file is compiled down to 'dist/main.js' so referencing assets folder within dist
        // TODO: remove when ready
        let staticAssetPath = path.join(__dirname, './assets');
        staticAssetPath = staticAssetPath.replace('app.asar', 'app.asar.unpacked')
        debug('Static asset path: ', staticAssetPath);
        this.express.use('/assets', express.static(staticAssetPath));
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
            this.router.send('/dat/exists',datCheckData)
            .then(() => {
                const filePath = path.join('content',datKey,filename)
                const statFileData: IAOFS_FileStat_data = {
                    path: filePath
                }
                this.router.send('/fs/stats', statFileData).then((fileStats) => {
                    const fileSize = fileStats.data.size
                    let streamOptions:Object = {}
                    //Images and smaller files
                    let head200 = {
                        "Accept-Ranges": "bytes",
                        "Content-Length": fileSize
                    }
                    response.writeHead(200, head200);
                    
                    const readFileData: IAOFS_ReadStream_Data = {
                        stream: response,
                        streamDirection: 'read',
                        streamOptions: streamOptions,
                        readPath: filePath
                    }
                    this.router.send('/fs/readStream',readFileData).then(() => {
                        resolve()
                    }).catch(reject)
                }).catch(reject)

                
            }).catch(reject)
        })
    }

    private _streamEncryptedFile(request,response) {
        return new Promise( (resolve, reject) => {
            debug('Gettin hit at the encrypted stream!')
            const datKey = request.params.key
            const filename = request.params.filename

            //make sure dat exists
            const datCheckData: AODat_Check_Data = {
                key: datKey
            }
            this.router.send('/dat/exists', datCheckData)
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
                        let total = docData.fileSize;
                        let streamOptions:Object = {}
                        let head200 = {
                            "Accept-Ranges": "bytes",
                            "Content-Length": total
                        }
                        response.writeHead(200, head200);
                        
                        //Stream the freaken file
                        const readFileData: IAOFS_ReadStream_Data = {
                            stream: response,
                            streamDirection: 'read',
                            streamOptions: streamOptions,
                            readPath: path.join('content',datKey,filename),
                            key: docData.decryptionKey
                        }
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