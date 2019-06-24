"use strict";
import { GraphQLUpload } from "graphql-upload";
import Debug from "debug";
import { makeExecutableSchema } from "graphql-tools";
import resolvers from "./resolvers/resolvers";
import AOContent from "../models/AOContent";
import "graphql-import-node";
import * as graphqlSchema from "./schema.graphql";
const packageJson = require("../../package.json");
const debug = Debug("ao:graphql");

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
                    let typename;
                    switch (data.contentType) {
                        case AOContent.Types.VOD:
                            typename = "VideoContent";
                            break;
                        case AOContent.Types.DAPP:
                            typename = "DappContent";
                            break;
                        case AOContent.Types.PDF:
                            typename = "PdfContent";
                            break;
                        default:
                            debug(
                                `IContent type resolver, unkown contentType: ${
                                    data.contentType
                                }`
                            );
                            break;
                    }
                    return info.schema.getType(typename);
                },
                metadataDatStats: resolvers.resolveDatStats,
                fileDatStats: resolvers.resolveDatStats,
                fileUrl: resolvers.resolveUrl,
                baseChallengeSignature: resolvers.resolveSignatureVrs,
                teaserUrl: resolvers.resolveUrl,
                featuredImageUrl: resolvers.resolveUrl
            },
            VideoContent: {},
            DappContent: {
                fileUrl: resolvers.resolveDappUrl
            },
            PdfContent: {},
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
                statistics: resolvers.resolveNodeStatistics,
                nameProfile: resolvers.resolveNameProfile,
                taoThought: resolvers.resolveTaoThought,
                taoThoughts: resolvers.resolveTaoThoughts,
                taoThoughtsCount: resolvers.resolveTaoThoughtsCount,
                taoDescription: resolvers.resolveTaoDescription,
                taoDescriptions: resolvers.resolveTaoDescriptions,
                writerKey: resolvers.resolveWriterKey,
				writerKeySignature: resolvers.resolveWriterKeySignature,
				nameLookup: resolvers.resolveNameLookup
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
                export: resolvers.resolveExportData,
                submitNameProfile: resolvers.resolveSubmitNameProfile,
                submitTaoDescription: resolvers.resolveSubmitTaoDescription,
                submitTaoThought: resolvers.resolveSubmitTaoThought,
				removeContent: resolvers.resolveRemoveContent,
				submitNameLookup: resolvers.resolveSubmitNameLookup
            }
        },
        resolverValidationOptions: {
            requireResolversForResolveType: false
        },
        inheritResolversFromInterfaces: true
    });
    return schema;
}
