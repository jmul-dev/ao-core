'use strict';
import { GraphQLUpload } from 'apollo-upload-server';
import { addMockFunctionsToSchema, makeExecutableSchema } from 'graphql-tools';
import mocks from './mocks';
import resolvers from './resolvers/resolvers';

const graphqlSchema = require('./schema.graphql');
const packageJson = require('../../package.json');


export default function () {
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