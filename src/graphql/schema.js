'use strict';
import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';
import RootQuery from "./queries/index";
import RootMutation from "./mutations/index";
import Types from "./types/index";
import mocks from './types/mocks';
import { version as _version } from "../../package.json";


const SchemaDefinition = `
    schema {
        query: RootQuery,
        mutation: RootMutation,
    }
`

export default function (db) {
    const schema = makeExecutableSchema({
        // TODO: type def's should probably mirror the Database models. Maybe we can 
        // more closely define these at some point
        typeDefs: [SchemaDefinition, RootQuery, RootMutation, Types],
        resolvers: {
            RootQuery: {
                version: () => _version,
                // videos: () => db.Video.all(),
                // peers: () => db.Peer.all()
            },
        }
    });
    // NOTE: set preserveResolvers to true if we only want to mock undefined resolvers,
    // and use resolvers that are already defined.
    // TODO: conditional on process.env.NODE_ENV
    addMockFunctionsToSchema({ schema, mocks, preserveResolvers: true });
    return schema;
}