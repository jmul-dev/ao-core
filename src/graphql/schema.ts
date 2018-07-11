'use strict';
import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';
import { importSchema } from 'graphql-import';
import path from 'path';
const graphqlSchema = importSchema( path.resolve(__dirname, './schema.graphql') );
import mocks from './mocks';
import { generateMockVideoList } from './mockVideos';
import Database from '../storage/database';
import Router from '../messaging/router';
import Message from '../messaging/message'
const packageJson = require('../../package.json');
import { GraphQLUpload } from 'apollo-upload-server'
import md5 from 'md5'

// TODO: replace with actual db calls 
let mockStore = {
    node: null,
    state: 'READY',
    settings: undefined,  // undefined will resolve with mocks
    videos: generateMockVideoList()
}

export default function (db: Database, router: Router) {
    const schema = makeExecutableSchema({
        typeDefs: [graphqlSchema],
        resolvers: {
            Upload: GraphQLUpload,
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
                },
                //below is sort of a strange notation of double wrapping functions, but its what the example did
                videoUpload: (obj, {file}, context, info) => async (file) => {
                    const { stream, filename, mimetype, encoding } = await file
                    //file storage has to happen here, but code has to be re-orged before we continue.
                    var message = new Message({
                        app_id: 'testing', //TBD
                        type_id: "stream",
                        event: "stream_write_file",
                        from: "http",
                        data: { 
                            stream: stream,
                            file_path: 'video-upload-'+filename+ md5(new Date) //TODO: Figure out the pathing for this.
                        },
                        encoding: "json"
                    })
                    router.invokeSubProcess(message, 'filesSubProcess')
                    .then(() => {
                        //Dunno exactly if this is what we want
                        Promise.resolve()
                    })
                    .catch(err => {
                        Promise.reject(err)
                    })
                },
            },
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