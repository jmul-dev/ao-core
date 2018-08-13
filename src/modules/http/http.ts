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
                this.streamFile(request,response)
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

    private streamFile(request,response) {
        return new Promise( (resolve,reject) => {

            const datKey = request.params.key
            const filename = request.params.filename

            //First check to make sure the file exists in the dat check
            const datCheckData: AODat_Check_Data = {
                key: datKey
            }
            this.router.send('/dat/check',datCheckData)
            .then(() => {
                debug('got past check')
                const readFileData: IAOFS_ReadStream_Data = {
                    stream: response,
                    streamDirection: 'read',
                    readPath: path.join('content',datKey,filename)
                }
                this.router.send('/fs/readStream',readFileData).then(() => {
                    debug('got past readFile')
                    resolve()
                }).catch((e) => {
                    reject(e)
                })
            }).catch((e) => {
                debug(e)
                reject(e)
                //some sort of a bad request return?
                //return response.status(404).send('Not Found')
            })
        })
    }

    public shutdown(err?: Error) {
        this.server.close()
    }
}