"use strict";
import { GraphQLUpload } from "graphql-upload";
import Debug from "../AODebug";
import { makeExecutableSchema } from "graphql-tools";
import resolvers from "./resolvers/resolvers";
import AOContent from "../models/AOContent";
const debug = Debug("ao:graphql");
const graphqlSchema = require("./schema.graphql");
const packageJson = require("../../package.json");

export default function() {
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
                    let typename = data.__typename;
                    if (!typename) {
                        debug(data);
                        switch (data.contentType) {
                            case AOContent.Types.VOD:
                                typename = "VideoContent";
                                break;
                            case AOContent.Types.DAPP:
                                typename = "DappContent";
                                break;
                        }
                    }
                    debug(`__resolveType: [${data.__typename}]->[${typename}]`);
                    return info.schema.getType(typename);
                },
                metadataDatStats: resolvers.resolveDatStats,
                fileDatStats: resolvers.resolveDatStats,
                fileUrl: resolvers.resolveUrl,
                baseChallengeSignature: resolvers.resolveSignatureVrs
            },
            VideoContent: {
                teaserUrl: resolvers.resolveUrl,
                featuredImageUrl: resolvers.resolveUrl
            },
            DappContent: {
                teaserUrl: resolvers.resolveUrl,
                featuredImageUrl: resolvers.resolveUrl
            },
            NodeIdentity: {
                stakedContent: resolvers.resolveLocalNodeStakedContent,
                hostedContent: resolvers.resolveLocalNodeHostedContent
            },
            Query: {
                version: () => packageJson.version,
                logs: resolvers.resolveLogs,
                node: resolvers.resolveLocalNode,
                state: resolvers.resolveState,
                settings: resolvers.resolveSettings,
                networkContent: resolvers.resolveNetworkContent,
                userContent: resolvers.resolveUserContent,
                statistics: resolvers.resolveNodeStatistics
            },
            Mutation: {
                register: resolvers.resolveRegister,
                updateSettings: resolvers.resolveUpdateSettings,
                submitContent: resolvers.resolveSubmitContent,
                contentRequest: resolvers.resolveContentRequest,
                contentPurchaseTransaction:
                    resolvers.resolveContentPurchaseTransaction,
                contentBecomeHostTransaction:
                    resolvers.resolveContentBecomeHostTransaction,
                contentUploadStakeTransaction:
                    resolvers.resolveContentUploadStakeTransaction,
                contentRetryHostDiscovery:
                    resolvers.resolveContentRetryHostDiscovery,
                export: resolvers.resolveExportData
            }
        },
        resolverValidationOptions: {
            requireResolversForResolveType: false
        },
        inheritResolversFromInterfaces: true
    });
    return schema;
}
