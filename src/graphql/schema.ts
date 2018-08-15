'use strict';
import { GraphQLUpload } from 'apollo-upload-server';
import Debug from 'debug';
// import { importSchema } from 'graphql-import';
import { addMockFunctionsToSchema, makeExecutableSchema } from 'graphql-tools';
import md5 from 'md5';
import path from 'path';
import { AODat_Create_Data, AODat_ResumeAll_Data } from '../modules/dat/dat';
import { AODB_SettingsUpdate_Data, AODB_DatsUpdate_Data, AODB_UserContentGet_Data } from '../modules/db/db';
import { IAOEth_NetworkChange_Data } from '../modules/eth/eth';
import { IAOFS_Mkdir_Data, IAOFS_WriteStream_Data, IAOFS_Write_Data, IAOFS_Move_Data } from '../modules/fs/fs';
import { Http_Args } from '../modules/http/http';
import { IAORouterMessage } from '../router/AORouter';
import { AOCoreProcessRouter } from '../router/AORouterInterface';
import mocks from './mocks';
import { generateMockVideoList } from './mockVideos';
import QueryResolvers from './resolvers/queryResolvers';
import { resolve } from 'dns';

const graphqlSchema = require('./schema.graphql');
// const graphqlSchema = importSchema( 'src/graphql/schema.graphql' );
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
    const queryResolvers = QueryResolvers(router, options)
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
                            //Mkdir is to ensure that data folders exist.
                            const fsMakeContentDirData: IAOFS_Mkdir_Data = {
                                dirPath: 'content'
                            }
                            const fsMakeEthDirData: IAOFS_Mkdir_Data = {
                                dirPath: path.join('users',args.inputs.ethAddress)
                            }
                            const mkdirPromises: Array<Promise<any>> = [
                                router.send('/fs/mkdir', fsMakeContentDirData),
                                router.send('/fs/mkdir', fsMakeEthDirData)
                            ]
                            Promise.all(mkdirPromises).then(() => {
                                router.send('/dat/resumeAll').then(() => {
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
                        const ethAddress: string = args.inputs.ethAddress;

                        const newContentId: string = md5(new Date);
                        const newPreviewId: string = md5(new Date + '-preview');
                        const contentPath: string = path.join('content', newContentId)
                        const previewPath: string = path.join('content', newPreviewId)

                        const fileInputs = ['video', 'videoTeaser', 'featuredImage']

                        let contentFileNames: Array<string> = []
                        let fileStorePromises: Array<Promise<any>> = []
                        const newContentDirData: IAOFS_Mkdir_Data = {
                            dirPath: contentPath
                        }
                        const newPreviewDirData: IAOFS_Mkdir_Data = {
                            dirPath: previewPath
                        }
                        const mkdirPromises:Array<Promise<any>> = [
                            router.send('/fs/mkdir', newContentDirData),
                            router.send('/fs/mkdir', newPreviewDirData)
                        ]
                        Promise.all(mkdirPromises).then( () => {
                            for (let i = 0; i < fileInputs.length; i++) {
                                const fileInputName = fileInputs[i];
                                fileStorePromises.push(new Promise((localResolve, localReject) => {
                                    args.inputs[fileInputName].then(({stream, filename, mimetype, encoding}) => {
                                        // attaching the existing file extension if there is one
                                        const fileName = fileInputName + '.' + filename.substr(filename.lastIndexOf('.') + 1)
                                        contentFileNames[i] = fileName
                                        const writeStreamData: IAOFS_WriteStream_Data = {
                                            stream: stream,
                                            streamDirection: 'write',
                                            writePath: fileInputName == 'video' ? path.join(contentPath, fileName): path.join(previewPath, fileName),
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

                                const datCreateContentData: AODat_Create_Data = {
                                    newDatDir: newContentId
                                }
                                const datCreatePreviewData: AODat_Create_Data = {
                                    newDatDir: newPreviewId
                                }
                                const datCreatePromises: Array<Promise<any>> = [
                                    router.send('/dat/create', datCreateContentData),
                                    router.send('/dat/create', datCreatePreviewData)
                                ]
                                Promise.all(datCreatePromises).then((datResponses) => {
                                    let metadataDatKey: string;
                                    let contentDatKey: string;
                                    let previewDatResponseData: Object;
                                    for (let i = 0; i < datResponses.length; i++) {
                                        const datResponseData = datResponses[i].data;
                                        if( datResponseData.dir == newPreviewId) {
                                            metadataDatKey = datResponseData.key
                                            previewDatResponseData = datResponseData
                                        } else {
                                            contentDatKey = datResponseData.key
                                        }
                                    }
                                    
                                    const contentJson = {
                                        id: newContentId,
                                        creatorId: ethAddress,
                                        metadataDatKey: metadataDatKey,
                                        contentType: 'VOD',
                                        isFolder: false, // TODO: determine if args.inputs.video is a folder
                                        isMutable: false,
                                        title: args.inputs.title,
                                        description: args.inputs.description,
                                        stake: args.inputs.stake,
                                        profit: args.inputs.profit,
                                        createdAt: Date.now(),
        
                                        fileUrl: `${contentDatKey}/${contentFileNames[0]}`,
                                        fileDatKey: contentDatKey,
                                        fileName: contentFileNames[0],
                                        fileSize: fileSize,
                                        teaserName: `${contentFileNames[1]}`,
                                        teaserUrl:`${metadataDatKey}/${contentFileNames[1]}`,
                                        featuredImageName: `${contentFileNames[2]}`,
                                        featuredImageUrl: `${metadataDatKey}/${contentFileNames[2]}`,
        
                                        metadata: {
                                            duration: videoStats['duration'],  
                                            resolution: videoStats['height'],//we have the width too, but dunno
                                            encoding: videoStats['codec'],
                                        }
                                    }
                                    const storagePromises: Array<Promise<any>> = []
                                    const contentWriteData: IAOFS_Write_Data = {
                                        writePath: `content/${newPreviewId}/content.json`,
                                        data: JSON.stringify(contentJson)
                                    }

                                    const userContentJson = {
                                        ...contentJson,
                                        decryptionKey: decryptionKey
                                    }

                                    storagePromises.push(router.send('/fs/write', contentWriteData))
                                    storagePromises.push(router.send('/db/user/content/insert', userContentJson))

                                    Promise.all(storagePromises).then((results: Array<IAORouterMessage>) => {
                                        const movePreviewDatData: IAOFS_Move_Data = {
                                            srcPath: path.join('content', newPreviewId),
                                            destPath: path.join('content', metadataDatKey)
                                        }
                                        const moveContentDatData: IAOFS_Move_Data = {
                                            srcPath: path.join('content', newContentId),
                                            destPath: path.join('content', contentDatKey)
                                        }
                                        const folderMovePromises: Array<Promise<any>> = [
                                            router.send('/fs/move', movePreviewDatData),
                                            router.send('/fs/move', moveContentDatData)
                                        ]
                                        Promise.all(folderMovePromises).then(() => {
                                            resolve(contentJson)

                                            const previewDatDirUpdate: AODB_DatsUpdate_Data = {
                                                query: { key: metadataDatKey },
                                                update: {
                                                    key: metadataDatKey,
                                                    contentJSON: contentJson
                                                }
                                            }
                                            const contentDatDirUpdate: AODB_DatsUpdate_Data = {
                                                query: { key: contentDatKey },
                                                update: {
                                                    key: contentDatKey
                                                }
                                            }
                                            const datDbUpdates:Array<Promise<any>> = [
                                                router.send('/db/dats/update', contentDatDirUpdate),
                                                router.send('/db/dats/update', previewDatDirUpdate)
                                            ]
                                            Promise.all(datDbUpdates).then(()=> {

                                            }).catch(reject)

                                            // TODO: remember that we haven't "joined" the network here yet. The repo isn't up and running.
                                        }).catch(reject)
                                    }).catch((error: Error) => {
                                        // We either failed to write contentJson to disk or db, lets cleanup to 
                                        // avoid dirty state.
                                        // TODO: attempt to cleanup file storage.
                                        reject(error)
                                    })

                                }).catch(reject)//double dat creation

                            }).catch(reject)//filestore/encrypt/get stats

                        }).catch(reject)//mkdir

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