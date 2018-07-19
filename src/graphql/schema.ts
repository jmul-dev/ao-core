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
                        // simulating setup time
                        mockStore.node = {
                            id: args.inputs.ethAddress,
                            ethAddress: args.inputs.ethAddress
                        }
                        db.setEthAddress(args.inputs.ethAddress)
                        .then(() => {
                            //Make Data Folder with the Eth Address
                            var data_folder_message = new Message({
                                app_id: 'testing',
                                type_id: "message",
                                event: "make_folder",
                                from: 'http',
                                data: {
                                    folder_path: join(args.inputs.ethAddress,'dat') //might as well make the dat folder.  this works like mkdirp
                                },
                                encoding: 'json'
                            })
                            router.invokeSubProcess(data_folder_message.toJSON(), 'http')
                            .then(() => {
                                resolve(mockStore.node)
                            })
                            .catch(e => error)
                        })
                        .catch(e => reject(e))
                    })
                },
                updateSettings: (obj, args, context, info) => {
                    return new Promise((resolve, reject) => {
                        mockStore.settings = {
                            ...mockStore.settings,
                            ...args.inputs,
                        }
                        db.writeSettings(mockStore.settings)
                        .then(() => {
                            resolve(mockStore.settings)
                        })
                        .catch(e => {
                            reject(e)
                        })
                    })
                },
                submitVideoContent: (obj, args, context, info) => {
                    return new Promise((resolve, reject) => {
                        var new_dat_folder:string = md5(new Date)
                        var eth_address:string = db.getEthAddress()
                        var base_path:string = join(eth_address , 'dat', new_dat_folder)

                        // Let's see if we can promise our way through this giant mess
                        var all_inputs = ['video','videoTeaser','featuredImage']
                        var all_promises:Array<any> = []
                        for (let i = 0; i < all_inputs.length; i++) {
                            const input_name = all_inputs[i];
                            var new_promise = new Promise((res,rej) => {
                                args.inputs[input_name].then(({stream, filename, mimetype, encoding}) => {
                                    //debug(`video: filename[${filename}] mimetype[${mimetype}] encoding[${encoding}]`)
                                    var full_path = join( base_path, input_name )
                                    var message_data = {
                                        stream: stream,
                                        stream_direction: 'output',
                                        dat_folder: new_dat_folder,
                                        file_path: full_path,
                                        callback_event: "dat_file_uploaded",
                                        type: input_name.includes('video') ? 'video': 'image',
                                        encrypt: input_name == 'video'? true : false
                                    }
        
                                    // send message through router to store file
                                    var message = new Message({
                                        app_id: 'testing', //TBD
                                        type_id: "stream",
                                        event: "stream_write_file",
                                        from: "http",
                                        data: message_data,
                                        encoding: "json"
                                    })
                                    router.invokeSubProcess(message.toJSON(), 'http')
                                    .then(() => {
                                        //debug(`${filename} save started!`)
                                        res()
                                    }).catch(err => {
                                        error(`${filename} error during save`, err)
                                        rej(err)
                                    })
                                }).catch(e => {rej(e)})
                            })
                            all_promises.push(new_promise)
                        }

                        //All Promises
                        Promise.all(all_promises)
                        .then(() => {
                            debug('All uploads started')
                            //Time to start working on JSON creation
                            var file_json:Object = {
                                title: args.inputs.title,
                                description: args.inputs.description,
                                stake: args.inputs.stake,
                                profit: args.inputs.profit,
                                owner: eth_address
                            }
                            var write_json_message = new Message({
                                app_id: 'testing', //TBD
                                type_id: "message",
                                event: "write_file",
                                from: "http",
                                data: {
                                    file_path: join(base_path, 'video.json'),
                                    file_data: file_json
                                },
                                encoding: "json"
                            })
                            router.invokeSubProcess(write_json_message.toJSON(), 'http')
                            .then( () => {
                                resolve()
                            })
                            .catch(e => {
                                reject(e)
                            })
                        }).catch(e => {
                            reject(e)
                        })

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