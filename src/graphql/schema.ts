'use strict';
import { GraphQLUpload } from 'apollo-upload-server';
import { addMockFunctionsToSchema, makeExecutableSchema } from 'graphql-tools';
import path from 'path';
import { AODB_SettingsUpdate_Data } from '../modules/db/db';
import { IAOEth_NetworkChange_Data } from '../modules/eth/eth';
import { IAOFS_Mkdir_Data } from '../modules/fs/fs';
import { Http_Args } from '../modules/http/http';
import { AOCoreProcessRouter } from '../router/AORouterInterface';
import mocks from './mocks';
import { generateMockVideoList } from './mockVideos';
import Resolvers from './resolvers/resolvers';

const graphqlSchema = require('./schema.graphql');
const packageJson = require('../../package.json');


// TODO: replace with actual db calls 
let mockStore = {
    node: null,
    state: 'READY',
    settings: undefined,  // undefined will resolve with mocks
    videos: null
}

export default function (router: AOCoreProcessRouter, options: Http_Args) {
    const resolvers = Resolvers(router, options)
    const schema = makeExecutableSchema({
        typeDefs: [graphqlSchema],
        resolvers: {
            Upload: GraphQLUpload,
            // Interface (required for mocks)
            IContent: {
                __resolveType(data, ctx, info) {
                    return info.schema.getType(data.__typename) // __typename property must be set by your mock functions
                },
                metadataDatStats: resolvers.resolveDatStats,
            },
            NodeIdentityContentCreator: {
                content: resolvers.resolveContentCreatorContent,
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
                node: resolvers.resolveLocalNode,                
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
                video: resolvers.resolveVideo
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
                                router.send('/core/log', {message: `[AO Core] Registered as user ${args.inputs.ethAddress}`})
                                resolve(mockStore.node)
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
                submitVideoContent: resolvers.resolveSubmitVideoContent,                
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