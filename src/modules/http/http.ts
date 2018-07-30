import express, { Express } from 'express';
import schema from '../../graphql/schema';
import { Server, AddressInfo } from 'net';
import cors from 'cors';
import path from 'path';
import { json } from "body-parser";
import { graphqlExpress, graphiqlExpress } from "apollo-server-express";
import { apolloUploadExpress } from 'apollo-upload-server';
import Debug from 'debug';
import AORouterInterface from "../../routing/AORouterInterface";
const debug = Debug('ao:http');

export interface Http_Args {
    httpOrigin: string;
    httpPort: number;
}


export default class Http extends AORouterInterface {
    private express: Express;
    private server: Server;

    constructor(options: Http_Args) {
        super()
        this.express = express();
        const graphqlSchema = schema(this.router);
        this.express.use(
            '/graphql', 
            cors({origin: options.httpOrigin}), 
            json(), 
            apolloUploadExpress({maxFieldSize: "1gb"}),
            graphqlExpress({ schema: graphqlSchema })
        );
        this.express.get('/graphiql', graphiqlExpress({ endpointURL: '/graphql' })); // TODO: enable based on process.env.NODE_ENV
        this.express.use('/assets', express.static(path.join(__dirname, '../../../assets')));
        this.server = this.express.listen(options.httpPort, () => {
            const address: AddressInfo = <AddressInfo> this.server.address();
            debug('Express server running on port: ' + address.port);
            // TODO: store event log
            // this.router.send('/db/store')            
        });
        this.server.on('error', this.shutdown.bind(this));
    }

    public shutdown(err?: Error) {
        this.server.close()
    }
}