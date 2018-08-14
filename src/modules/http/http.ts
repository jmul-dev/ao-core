import express, { Express } from 'express';
import schema from '../../graphql/schema';
import { Server, AddressInfo } from 'net';
import cors from 'cors';
import path from 'path';
import { json } from "body-parser";
import { graphqlExpress, graphiqlExpress } from "apollo-server-express";
import { apolloUploadExpress } from 'apollo-upload-server';
import Debug from 'debug';
import {AOCoreProcessRouter} from "../../router/AORouterInterface";
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
        // NOTE: this file is compiled down to 'dist/main.js' so referencing assets folder up one dir
        // TODO: remove when ready
        let staticAssetPath = path.join(__dirname, '../assets');
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

    public shutdown(err?: Error) {
        this.server.close()
    }
}