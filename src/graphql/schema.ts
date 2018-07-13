'use strict';
import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';
import { importSchema } from 'graphql-import';
import path from 'path';
const join = path.join
const graphqlSchema = importSchema( path.resolve(__dirname, './schema.graphql') );
import mocks from './mocks';
import { generateMockVideoList } from './mockVideos';
import Database from '../main/database';
import Router from '../messaging/router';
import Message from '../messaging/message'
const packageJson = require('../../package.json');
import { GraphQLUpload } from 'apollo-upload-server';
import md5 from 'md5';
import Debug from 'debug';
const debug = Debug('ao:graphql');
const error = Debug('ao:graphql:error');


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

                            this.db.setEthAddress(args.inputs.ethAddress)

                            //Make Data Folder with the Eth Address
                            var data_folder_message = new Message({
                                app_id: 'testing',
                                type_id: "message",
                                event: "make_folder",
                                from: 'http',
                                data: {
                                    folder_path: join('data', args.inputs.ethAddress,'dat') //might as well make the dat folder.  this works like mkdirp
                                },
                                encoding: 'json'
                            })
                            this.router.invokeSubProcess(data_folder_message.toJSON(), 'filesSubProcess')
                            .then(() => {
                                resolve(mockStore.node)
                            })
                            .catch(e => error)

                            
                        }, 2500)                        
                    })
                },
                updateSettings: (obj, args, context, info) => {
                    return new Promise((resolve, reject) => {
                        mockStore.settings = {
                            ...mockStore.settings,
                            ...args.inputs,
                        }
                        var save_settings_message = new Message({
                            app_id: 'testing',
                            type_id: "message",
                            event: "write_file",
                            from: 'http',
                            data: {
                                file_path: join('users', args.inputs.ethAddress,'settings.json'),
                                file_data: mockStore.settings
                            },
                            encoding: 'json'
                        })
                        this.router.invokeSubProcess(save_settings_message.toJSON(), 'filesSubProcess')
                        .then(() => {
                            resolve(mockStore.settings)
                        })
                        .catch(e => error)
                    })
                },
                submitVideoContent: (obj, args, context, info) => {
                    return new Promise((resolve, reject) => {
                        // TODO: handle file uploads: video, videoTeaser, featuredImage
                        args.inputs.video.then(({stream, filename, mimetype, encoding}) => {
                            debug(`video: filename[${filename}] mimetype[${mimetype}] encoding[${encoding}]`)
                            // send message through router to store file
                            // var message = new Message({
                            //     app_id: 'testing', //TBD
                            //     type_id: "stream",
                            //     event: "stream_write_file",
                            //     from: "http",
                            //     data: {
                            //         stream: stream,
                            //         file_path: 'video-upload-'+filename+ md5(new Date) //TODO: Figure out the pathing for this.
                            //     },
                            //     encoding: "json"
                            // })
                            // router.invokeSubProcess(message, 'filesSubProcess').then(() => {
                            //     debug(`${filename} saved!`)
                            // }).catch(err => {
                            //     error(`${filename} error during save`, err)
                            // })
                        })
                        // TODO: resolve once submition is complete
                        resolve()
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