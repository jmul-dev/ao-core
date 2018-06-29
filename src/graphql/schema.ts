'use strict';
import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';
import { importSchema } from 'graphql-import';
import path from 'path';
const graphqlSchema = importSchema( path.resolve(__dirname, './schema.graphql') );
import mocks from './mocks';
import { generateMockVideoList } from './mockVideos';
import Database from '../storage/database';
const packageJson = require('../../package.json');

// TODO: replace with actual db calls 
let mockStore = {
    node: null,
    state: 'READY',
    settings: undefined,  // undefined will resolve with mocks
    videos: generateMockVideoList()
}

export default function (db: Database) {
    const schema = makeExecutableSchema({
        typeDefs: [graphqlSchema],
        resolvers: {
            // Interface (required for mocks)
            IContent: {
                __resolveType(data, ctx, info) {
                    return info.schema.getType(data.__typename) // __typename property must be set by your mock functions
                },
            },
            Query: {
                version: () => packageJson.version,
                logs: () => db.getLogs(),
                node: () => mockStore.node,
                state: () => mockStore.state,
                settings: () => mockStore.settings,
                videos: () => mockStore.videos,
                // peers: () => db.Peer.all()
            },
            Mutation: {
                register: (obj, args, context, info) => {
                    return new Promise((resolve, reject) => {
                        setTimeout(function() {
                            // simulating setup time
                            mockStore.node = {
                                id: args.inputs.ethAddress,
                                ethAddress: args.inputs.ethAddress
                            }
                            resolve(mockStore.node)
                        }, 2500)                        
                    })
                },
                updateSettings: (obj, args, context, info) => {
                    return new Promise((resolve, reject) => {
                        mockStore.settings = {
                            ...mockStore.settings,
                            ...args.inputs,
                        }
                        resolve(mockStore.settings)
                    })
                }
            }
        },
        resolverValidationOptions: {
            requireResolversForResolveType: false
        },
        inheritResolversFromInterfaces: true,
    });
    // NOTE: set preserveResolvers to true if we only want to mock undefined resolvers,
    // and use resolvers that are already defined.
    if ( process.env.NODE_ENV !== 'production' )
        addMockFunctionsToSchema({ schema, mocks, preserveResolvers: true });
    return schema;
}