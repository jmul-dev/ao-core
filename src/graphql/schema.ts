'use strict';
import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';
import { importSchema } from 'graphql-import';
import path from 'path';
const graphqlSchema = importSchema( path.resolve(__dirname, './schema.graphql') );
import mocks from './mocks';
import { generateMockVideoList } from './mockVideos';
const packageJson = require('../../package.json');
import { GraphQLUpload } from 'apollo-upload-server';
import { AOSubprocessRouter } from '../router/AORouterInterface';
import { AODB_CoreUpdate_Data } from '../modules/db/db';
import md5 from 'md5';
import { IAOFS_WriteStream_Data, IAOFS_Write_Data } from '../modules/fs/fs';
import Debug from 'debug';
import { IAORouterMessage } from '../router/AORouter';
const debug = Debug('ao:graphql');
const error = Debug('ao:graphql:error');


// TODO: replace with actual db calls 
let mockStore = {
    node: null,
    state: 'READY',
    settings: undefined,  // undefined will resolve with mocks
    videos: generateMockVideoList()
}

export default function (router: AOSubprocessRouter) {
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
            // TODO: refactor resolvers into seperate files
            Query: {
                version: () => packageJson.version,
                logs: () => {
                    return new Promise((resolve, reject) => {
                        router.send('/db/core/get', {key: 'logs'}).then(response => {
                            resolve(response.data || [])
                        }).catch(reject)
                    })
                },
                node: () => mockStore.node,
                state: () => mockStore.state,
                settings: () => {
                    return new Promise((resolve, reject) => {
                        router.send('/db/core/get', {key: 'settings'}).then(response => {
                            resolve(response.data)
                        }).catch(reject)
                    })
                },
                videos: () => mockStore.videos,
                // peers: () => db.Peer.all()
            },            
            Mutation: {
                register: (obj, args, context, info) => {
                    return new Promise((resolve, reject) => {
                        mockStore.node = {
                            id: args.inputs.ethAddress,
                            ethAddress: args.inputs.ethAddress,
                            creator: {
                                content: generateMockVideoList(2)
                            },
                        }
                        
                        // db.setEthAddress(args.inputs.ethAddress).then(() => {
                        //     //Make Data Folder with the Eth Address
                        //     var data_folder_message = new Message({
                        //         app_id: 'testing',
                        //         type_id: "message",
                        //         event: "make_folder",
                        //         from: 'http',
                        //         data: {
                        //             folder_path: join(args.inputs.ethAddress,'dat') //might as well make the dat folder.  this works like mkdirp
                        //         },
                        //         encoding: 'json'
                        //     })
                        //     router.invokeSubProcess(data_folder_message.toJSON(), 'http').then(() => {
                        //         resolve(mockStore.node)
                        //     }).catch(e => error)
                        // }).catch(e => reject(e))
                    })
                },
                updateSettings: (obj, args, context, info) => {
                    return new Promise((resolve, reject) => {
                        const updateData: AODB_CoreUpdate_Data = {
                            key: 'settings',
                            value: args.inputs,
                            merge: true
                        }
                        router.send('/db/core/update', updateData).then((response) => {
                            resolve(response.data)
                        }).catch(reject)                    
                    })
                },
                submitVideoContent: (obj, args, context, info) => {
                    return new Promise((resolve, reject) => {
                        const newContentId: string = md5(new Date);
                        const ethAddress: string = args.ethAddress;
                        const contentPath: string = path.join(ethAddress, 'dat', newContentId)
                        const fileInputs = ['video', 'videoTeaser', 'featuredImage']
                        let contentFileNames: Array<string> = []
                        let fileStorePromises: Array<Promise<any>> = []
                        for (let i = 0; i < fileInputs.length; i++) {
                            const fileInputName = fileInputs[i];
                            fileStorePromises.push(new Promise((localResolve, localReject) => {
                                args.inputs[fileInputName].then(({stream, filename, mimetype, encoding}) => {
                                    // attaching the existing file extension if there is one
                                    const fileName = fileInputName + '.' + filename.substr(filename.lastIndexOf('.') + 1)
                                    contentFileNames[i] = fileName
                                    const writeStreamData: IAOFS_WriteStream_Data = {
                                        stream,
                                        writePath: path.join(contentPath, fileName),
                                        encrypt: fileInputName == 'video' ? true: false
                                    }
                                    router.send('/fs/writeStream', writeStreamData).then(localResolve).catch(localReject)
                                }).catch(localReject)
                            }))
                        }
                        Promise.all(fileStorePromises).then((results: Array<IAORouterMessage>) => {
                            debug('submitVideoContent - all files stored')
                            const contentJson = {
                                id: newContentId,
                                creatorId: ethAddress,
                                contentType: 'VOD',
                                isFolder: false, // TODO: determine if args.inputs.video is a folder
                                isMutable: false,
                                title: args.inputs.title,
                                description: args.inputs.description,
                                stake: args.inputs.stake,
                                profit: args.inputs.profit,
                                createdAt: Date.now(),

                                fileName: contentFileNames[0],
                                fileUrl: `${ethAddress}/dat/${newContentId}/${contentFileNames[0]}`,
                                fileSize: results[0].data.fileSize,
                                teaserUrl: `${ethAddress}/dat/${newContentId}/${contentFileNames[1]}`,
                                featuredImageUrl: `${ethAddress}/dat/${newContentId}/${contentFileNames[2]}`,

                                metadata: { // TODO: run video through ffprobe before encrypting
                                    duration: 0,  
                                    resolution: 0,
                                    encoding: 0,
                                }
                            }
                            const contentWriteData: IAOFS_Write_Data = {
                                writePath: `${ethAddress}/dat/${newContentId}/content.json`,
                                data: JSON.stringify(contentJson)
                            }
                            router.send('/fs/write', contentWriteData).then((result: IAORouterMessage) => {
                                resolve(contentJson)
                            }).catch((error: Error) => {
                                // TODO: attempt to cleanup file storage
                                reject(error)
                            })
                        }).catch(reject)

                        // TODO: remove
                        // var new_dat_folder:string = md5(new Date)
                        // var eth_address:string = db.getEthAddress()
                        // var base_path:string = join(eth_address , 'dat', new_dat_folder)

                        // // Let's see if we can promise our way through this giant mess
                        // var all_inputs = ['video','videoTeaser','featuredImage']
                        // var all_promises:Array<any> = []
                        // for (let i = 0; i < all_inputs.length; i++) {
                        //     const input_name = all_inputs[i];
                        //     var new_promise = new Promise((res,rej) => {
                        //         args.inputs[input_name].then(({stream, filename, mimetype, encoding}) => {
                        //             //debug(`video: filename[${filename}] mimetype[${mimetype}] encoding[${encoding}]`)
                        //             var full_path = join( base_path, input_name )
                        //             var message_data = {
                        //                 stream: stream,
                        //                 stream_direction: 'output',
                        //                 dat_folder: new_dat_folder,
                        //                 file_path: full_path,
                        //                 callback_event: "dat_file_uploaded",
                        //                 type: input_name.includes('video') ? 'video': 'image',
                        //                 encrypt: input_name == 'video'? true : false
                        //             }
        
                        //             // send message through router to store file
                        //             var message = new Message({
                        //                 app_id: 'testing', //TBD
                        //                 type_id: "stream",
                        //                 event: "stream_write_file",
                        //                 from: "http",
                        //                 data: message_data,
                        //                 encoding: "json"
                        //             })
                        //             router.invokeSubProcess(message.toJSON(), 'http')
                        //             .then(() => {
                        //                 //debug(`${filename} save started!`)
                        //                 res()
                        //             }).catch(err => {
                        //                 error(`${filename} error during save`, err)
                        //                 rej(err)
                        //             })
                        //         }).catch(e => {rej(e)})
                        //     })
                        //     all_promises.push(new_promise)
                        // }

                        // //All Promises
                        // Promise.all(all_promises)
                        // .then(() => {
                        //     debug('All uploads started')
                        //     //Time to start working on JSON creation
                        //     var file_json:Object = {
                        //         title: args.inputs.title,
                        //         description: args.inputs.description,
                        //         stake: args.inputs.stake,
                        //         profit: args.inputs.profit,
                        //         owner: eth_address
                        //     }
                        //     var write_json_message = new Message({
                        //         app_id: 'testing', //TBD
                        //         type_id: "message",
                        //         event: "write_file",
                        //         from: "http",
                        //         data: {
                        //             file_path: join(base_path, 'video.json'),
                        //             file_data: file_json
                        //         },
                        //         encoding: "json"
                        //     })
                        //     router.invokeSubProcess(write_json_message.toJSON(), 'http')
                        //     .then( () => {
                        //         resolve()
                        //     })
                        //     .catch(e => {
                        //         reject(e)
                        //     })
                        // }).catch(e => {
                        //     reject(e)
                        // })

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