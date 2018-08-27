'use strict';
import { GraphQLUpload } from 'apollo-upload-server';
import { addMockFunctionsToSchema, makeExecutableSchema } from 'graphql-tools';
import mocks from './mocks';
import resolvers from './resolvers/resolvers';
import Debug from 'debug'
const debug = Debug('ao:graphql');

const graphqlSchema = require('./schema.graphql');
const packageJson = require('../../package.json');


export default function () {
    const schema = makeExecutableSchema({
        logger: {
            log: debug
        },
        typeDefs: [graphqlSchema],
        resolvers: {
            Upload: GraphQLUpload,            
            IContent: {
                __resolveType(data, ctx, info) {
                    // NOTE: data.__typename is specifically used by mocks
                    return info.schema.getType(data.__typename || 'VideoContent'); // TODO: resolve type based off of data.contentType
                },
                metadataDatStats: resolvers.resolveDatStats,
                fileUrl: resolvers.resolveUrl,                
            },
            VideoContent: {
                teaserUrl: resolvers.resolveUrl,
                featuredImageUrl: resolvers.resolveUrl,
            },
            NodeIdentity: {
                stakedContent: resolvers.resolveLocalNodeStakedContent,
                hostedContent: resolvers.resolveLocalNodeHostedContent,
            },
            Query: {
                version: () => packageJson.version,
                logs: resolvers.resolveLogs,
                node: resolvers.resolveLocalNode,                
                state: resolvers.resolveState,
                settings: resolvers.resolveSettings,
                videos: resolvers.resolveVideos,
                video: resolvers.resolveVideo
            },
            Mutation: {
                setNetwork: resolvers.resolveSetNetwork,
                register: resolvers.resolveRegister,
                updateSettings: resolvers.resolveUpdateSettings,
                submitVideoContent: resolvers.resolveSubmitVideoContent,
                stakeContent: resolvers.resolveStakeContent,
                contentRequest: resolvers.resolveContentRequest,
                contentPurchased: resolvers.resolveContentPurchased,
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