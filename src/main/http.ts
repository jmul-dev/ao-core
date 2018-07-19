'use strict';
import express = require('express');
import path from 'path';
import { json } from "body-parser";
import { graphqlExpress, graphiqlExpress } from "apollo-server-express";
import { apolloUploadExpress } from 'apollo-upload-server'
import schema from "../graphql/schema";
import Debug from 'debug';
import { Server, AddressInfo } from 'net';
import cors from 'cors';
import md5 from 'md5'

//below is mostly for the defs
import Database from "../main/database";
import Router from '../messaging/router';
import Message from '../messaging/message';
import { MessageObject } from '../messaging/message_interfaces'
import { ICoreOptions } from '../bin';

const debug = Debug('ao:http');
const error = Debug('ao:http:error');

export default class Http {
    private options: ICoreOptions;
    private db: Database;
    private server: Server;
    private router: Router;
    private sendEventLog: Function;
    private shutdownWithError: Function;

    constructor(db, router, options, sendEventLog, shutdownWithError) {
        this.db = db
        this.router = router
        this.options = options
        this.sendEventLog = sendEventLog
        this.shutdownWithError = shutdownWithError
    }

    public init() {
        return new Promise( (resolve,reject) => {
            const expressServer = express();
            const graphqlSchema = schema(this.db, this.router);
            expressServer.use(
                '/graphql', 
                cors({origin: this.options.httpOrigin}), 
                json(), 
                apolloUploadExpress({maxFieldSize: "1gb"}),
                graphqlExpress({ schema: graphqlSchema })
            );
            expressServer.get('/graphiql', graphiqlExpress({ endpointURL: '/graphql' })); // TODO: enable based on process.env.NODE_ENV
            expressServer.use('/assets', express.static(path.join(__dirname, '../../assets')));
            this.server = expressServer.listen(this.options.httpPort, () => {
                const address: AddressInfo = <AddressInfo> this.server.address();
                debug('Express server running on port: ' + address.port);
                this.sendEventLog('Core http server started');
                resolve(this.server)
                
                this.register()
                .then( () => {
                    expressServer.get('/streamTest', async (req,res,next) => {
                        try {
                            this.streamTest(res)
                        } catch(e) {
                            next(e)
                        }
                    })
                } )
                .catch( error )
                
            });
            this.server.on('error', this.shutdownWithError.bind(this));
        })
    }

    private async register() {
        return new Promise( (resolve,reject) => {
            debug('Http Registered to Registry as main process')
            var module_name = 'http'
            var instance_id = md5( new Date().getTime() + Math.random() )
            var message = new Message({
                app_id: 'testing',
                type_id: "message",
                event: 'register_process',
                from: module_name,
                data: {
                    request: "add_to_registry",
                    name: module_name,
                    type: "main",
                    instance_id: instance_id,
                    process: this
                },
                encoding: 'json'
            })
            this.router.invokeSubProcess( message.toJSON() , module_name)
            .then( resolve )
            .catch( reject )
        })
    }
    private streamTest(response) {
        return new Promise( (resolve,reject) => {
            var module_name = 'http'
            var message = new Message({
                app_id: 'testing',
                type_id: "stream",
                event: 'stream_read_file',
                from: module_name,
                data: {
                    file_path: 'test.mov',//test file
                    stream_direction: 'input',
                    stream: response
                },
                encoding: 'json'
            })
            this.router.invokeSubProcess(message.toJSON(), module_name)
            .then( ()=> {
                resolve()
            } )
            .catch( (e) => {
                reject(e)
            } )
        })
    }

    public send( message:MessageObject ) {
        debug( 'invoke http stuff here if we receive a message' )
        debug( message )
    }

}