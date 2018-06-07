'use strict';
import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';
import { importSchema } from 'graphql-import';
import path from 'path';
const graphqlSchema = importSchema( path.resolve(__dirname, './schema.graphql') );
import mocks from './types/mocks';
const packageJson = require('../../package.json');


export default function (db) {
    const schema = makeExecutableSchema({
        typeDefs: [graphqlSchema],
        resolvers: {
            Query: {
                version: () => packageJson.version,
                // videos: () => db.Video.all(),
                // peers: () => db.Peer.all()
            },
        }
    });
    // NOTE: set preserveResolvers to true if we only want to mock undefined resolvers,
    // and use resolvers that are already defined.
    if ( process.env.NODE_ENV === 'development' )
        addMockFunctionsToSchema({ schema, mocks, preserveResolvers: true });
    return schema;
}