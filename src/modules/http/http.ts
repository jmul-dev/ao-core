import express, { Express } from 'express';
import schema from '../../graphql/schema';
import { Server, AddressInfo } from 'net';
import cors from 'cors';
import path from 'path';
import { json } from "body-parser";
import { graphqlExpress, graphiqlExpress } from "apollo-server-express";
import { apolloUploadExpress } from 'apollo-upload-server';
import Debug from 'debug';
import AORouterInterface from "../../router/AORouterInterface";
const debug = Debug('ao:http');

export interface Http_Args {
    httpOrigin: string;
    coreOrigin: string;
    corePort: number;
}


export default class Http extends AORouterInterface {
    private express: Express;
    private server: Server;

    constructor(options: Http_Args) {
        super()
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
        this.express.use('/assets', express.static(path.join(__dirname, '../../../assets')));
        this.server = this.express.listen(options.corePort, () => {
            const address: AddressInfo = <AddressInfo> this.server.address();
            debug('Express server running on port: ' + address.port);
            this.router.send('/core/log', {message: `AO Core http server running on port ${address.port}`}).then(response => {
                console.log('Response from log A: ', response)
            }).catch(error => {
                console.log('Error Response from log A: ', error)
            })
            this.router.send('/core/log', {message: `AO Core http server running with cors ${options.httpOrigin}`}).then(response => {
                console.log('Response from log B: ', response)
            }).catch(error => {
                console.log('Error Response from log B: ', error)
            })
        });
        this.server.on('error', this.shutdown.bind(this));
        debug(`started`)
    }

    public shutdown(err?: Error) {
        this.server.close()
    }
}