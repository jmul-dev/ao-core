'use strict';
import { GraphQLUpload } from 'apollo-upload-server';
import Debug from 'debug';
import { importSchema } from 'graphql-import';
import { addMockFunctionsToSchema, makeExecutableSchema } from 'graphql-tools';
import md5 from 'md5';
import path from 'path';
import { AODat_Create_Data, AODat_ResumeAll_Data } from '../modules/dat/dat';
import { AODB_SettingsUpdate_Data, AODB_DatsUpdate_Data, AODB_DecryptInsert_Data, AODB_DecryptInit_Data } from '../modules/db/db';
import { IAOEth_NetworkChange_Data } from '../modules/eth/eth';
import { IAOFS_Mkdir_Data, IAOFS_WriteStream_Data, IAOFS_Write_Data } from '../modules/fs/fs';
import { Http_Args } from '../modules/http/http';
import { IAORouterMessage } from '../router/AORouter';
import { AOCoreProcessRouter } from '../router/AORouterInterface';
import mocks from './mocks';
import { generateMockVideoList } from './mockVideos';
import QueryResolvers from './resolvers/queryResolvers';

const graphqlSchema = importSchema( path.resolve(__dirname, './schema.graphql') );
const packageJson = require('../../package.json');
const debug = Debug('ao:graphql');


// TODO: replace with actual db calls 
let mockStore = {
    node: null,
    state: 'READY',
    settings: undefined,  // undefined will resolve with mocks
    videos: null
}

export default function (router: AOCoreProcessRouter, options: Http_Args) {
    const queryResolvers = QueryResolvers(router)
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
                        router.send('/db/logs/get').then(response => {
                            resolve(response.data || [])
                        }).catch(reject)
                    })
                },
                node: queryResolvers.resolveLocalNode,
                state: () => mockStore.state,
                settings: () => {
                    return new Promise((resolve, reject) => {
                        router.send('/db/settings/get').then(response => {
                            resolve(response.data)
                        }).catch(reject)
                    })
                },
                videos: () => {
                    if (!mockStore.videos) {
                        mockStore.videos = generateMockVideoList(90, options.coreOrigin, options.corePort)
                    }
                    return mockStore.videos
                },
                // peers: () => db.Peer.all()
            },
            Mutation: {
                setNetwork: (obj, args, context, info) => {
                    return new Promise((resolve, reject) => {
                        const networkSetData: IAOEth_NetworkChange_Data = {
                            networkId: args.inputs.networkId
                        }
                        router.send('/eth/network/set', networkSetData).then(({networkId}) => {
                            resolve(networkId ? true : false)
                        }).catch(reject)
                    })
                },
                register: (obj, args, context, info) => {
                    return new Promise((resolve, reject) => {
                        mockStore.node = {
                            id: args.inputs.ethAddress,
                            ethAddress: args.inputs.ethAddress,
                            creator: {
                                content: generateMockVideoList(2, options.coreOrigin, options.corePort)
                            },
                        }
                        router.send('/db/user/init', {ethAddress: args.inputs.ethAddress}).then(() => {

                            //ensuring decryption keys are loaded.
                            const initDecryptionData: AODB_DecryptInit_Data = {}
                            router.send('/db/decryptionKey/init',initDecryptionData).then(()=> {
                                
                            }).catch(reject)

                            //Mkdir is to ensure that the folder exists.
                            const fsMakeDirData: IAOFS_Mkdir_Data = {
                                dirPath: path.join(args.inputs.ethAddress, 'dat')
                            }                        
                            router.send('/fs/mkdir', fsMakeDirData).then(() => {
                                //ResumeAll also initializes the multidat instance
                                const datResumeAllData: AODat_ResumeAll_Data = {
                                    ethAddress: args.inputs.ethAddress
                                }
                                router.send('/dat/resumeAll', datResumeAllData).then(() => {
                                    router.send('/core/log', {message: `[AO Core] Registered as user ${args.inputs.ethAddress}`})
                                    resolve(mockStore.node)
                                }).catch(reject)
                            }).catch(reject)
                        }).catch(reject)
                    })
                },
                updateSettings: (obj, args, context, info) => {
                    return new Promise((resolve, reject) => {
                        const updateData: AODB_SettingsUpdate_Data = {
                            ...args.inputs,
                        }
                        router.send('/db/settings/update', updateData).then((response) => {
                            router.send('/core/log', {message: `[AO DB] User settings updated`})
                            resolve(response.data)
                        }).catch(reject)
                    })
                },
                submitVideoContent: (obj, args, context, info) => {
                    return new Promise((resolve, reject) => {
                        const newContentId: string = md5(new Date);
                        const ethAddress: string = args.inputs.ethAddress;
                        const contentPath: string = path.join(ethAddress, 'dat', newContentId)
                        const fileInputs = ['video', 'videoTeaser', 'featuredImage']
                        let contentFileNames: Array<string> = []
                        let fileStorePromises: Array<Promise<any>> = []
                        const newContentDirData: IAOFS_Mkdir_Data = {
                            dirPath: contentPath
                        }
                        router.send('/fs/mkdir', newContentDirData).then(() => {
                            for (let i = 0; i < fileInputs.length; i++) {
                                const fileInputName = fileInputs[i];
                                fileStorePromises.push(new Promise((localResolve, localReject) => {
                                    args.inputs[fileInputName].then(({stream, filename, mimetype, encoding}) => {
                                        // attaching the existing file extension if there is one
                                        const fileName = fileInputName + '.' + filename.substr(filename.lastIndexOf('.') + 1)
                                        contentFileNames[i] = fileName
                                        const writeStreamData: IAOFS_WriteStream_Data = {
                                            stream: stream,
                                            writePath: path.join(contentPath, fileName),
                                            encrypt: fileInputName == 'video' ? true: false,
                                            videoStats: fileInputName.includes('video') ? true: false
                                        }
                                        router.send('/fs/writeStream', writeStreamData).then(localResolve).catch(localReject)
                                    }).catch(localReject)
                                }))
                            }
                            Promise.all(fileStorePromises).then((results: Array<IAORouterMessage>) => {
                                debug('submitVideoContent - all files stored')
                                let fileSize = 0
                                let videoStats = {}
                                let decryptionKey:string
                                for (let i = 0; i < results.length; i++) {
                                    const result = results[i];
                                    if(result.data.videoStats && result.data.key) {
                                        videoStats = result.data.videoStats
                                        fileSize = result.data.fileSize
                                        decryptionKey = result.data.key
                                    }
                                }
                                const datCreateData: AODat_Create_Data = {
                                    newDatDir: newContentId+''
                                }
                                router.send('/dat/create', datCreateData).then((datResponse) => {
                                    const datKey = datResponse.data.key
                                    const contentJson = {
                                        id: newContentId,
                                        creatorId: ethAddress,
                                        datKey: datKey,
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
                                        fileSize: fileSize,
                                        teaserUrl: `${ethAddress}/dat/${newContentId}/${contentFileNames[1]}`,
                                        teaserName: `${contentFileNames[1]}`,
                                        featuredImageUrl: `${ethAddress}/dat/${newContentId}/${contentFileNames[2]}`,
                                        featuredImageName: `${contentFileNames[2]}`,
        
                                        metadata: {
                                            duration: videoStats['duration'],  
                                            resolution: videoStats['height'],//we have the width too, but dunno
                                            encoding: videoStats['codec'],
                                        }
                                    }
                                    const storagePromises: Array<Promise<any>> = []
                                    const contentWriteData: IAOFS_Write_Data = {
                                        writePath: `${ethAddress}/dat/${newContentId}/content.json`,
                                        data: JSON.stringify(contentJson)
                                    }
                                    const datContentupdateData: AODB_DatsUpdate_Data = {
                                        query: { key: datKey },
                                        update: {
                                            ...datResponse.data,
                                            contentJSON: contentJson
                                        }
                                    }
                                    const decryptionKeyData: AODB_DecryptInsert_Data = {
                                        datKey: datKey,
                                        decryptionKey: decryptionKey
                                    }

                                    // TODO: Make sure to add below when we know stuff has been staked correctly.
                                    //     const datJoinNetworkData: AODat_JoinNetwork_Data = {
                                    //         key: datKey
                                    //     }
                                    //     router.send('/dat/joinNetwork',datJoinNetworkData).then(() => {
                                    //     }).catch(reject)

                                    storagePromises.push(router.send('/fs/write', contentWriteData))
                                    storagePromises.push(router.send('/db/user/content/insert', contentJson))
                                    storagePromises.push(router.send('/db/dats/update', datContentupdateData))
                                    storagePromises.push(router.send('/db/decryptionKey/insert', decryptionKeyData))
                                    //Maybe add another promise that attaches contentJSON data back into the dat.

                                    Promise.all(storagePromises).then((results: Array<IAORouterMessage>) => {
                                        resolve(contentJson)
                                    }).catch((error: Error) => {
                                        // We either failed to write contentJson to disk or db, lets cleanup to 
                                        // avoid dirty state.
                                        // TODO: attempt to cleanup file storage.
                                        reject(error)
                                    })
                                }).catch(reject)
                            }).catch(reject)
                        }).catch(reject)
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