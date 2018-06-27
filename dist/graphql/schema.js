'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var graphql_tools_1 = require("graphql-tools");
var graphql_import_1 = require("graphql-import");
var path_1 = __importDefault(require("path"));
var graphqlSchema = graphql_import_1.importSchema(path_1.default.resolve(__dirname, './schema.graphql'));
var mocks_1 = __importDefault(require("./mocks"));
var packageJson = require('../../package.json');
// TODO: replace with actual db calls 
var mockStore = {
    node: null,
    state: 'READY',
};
function default_1(db) {
    var schema = graphql_tools_1.makeExecutableSchema({
        typeDefs: [graphqlSchema],
        resolvers: {
            // Interface (required for mocks)
            IContent: {
                __resolveType: function (data, ctx, info) {
                    return info.schema.getType(data.__typename); // __typename property must be set by your mock functions
                },
            },
            Query: {
                version: function () { return packageJson.version; },
                logs: function () { return db.getLogs(); },
                node: function () { return mockStore.node; },
                state: function () { return mockStore.state; },
            },
            Mutation: {
                register: function (obj, args, context, info) {
                    return new Promise(function (resolve, reject) {
                        setTimeout(function () {
                            // simulating setup time
                            mockStore.node = {
                                id: args.inputs.ethAddress,
                                ethAddress: args.inputs.ethAddress
                            };
                            resolve(mockStore.node);
                        }, 2500);
                    });
                }
            }
        },
        resolverValidationOptions: {
            requireResolversForResolveType: false
        },
        inheritResolversFromInterfaces: true,
    });
    // NOTE: set preserveResolvers to true if we only want to mock undefined resolvers,
    // and use resolvers that are already defined.
    if (process.env.NODE_ENV !== 'production')
        graphql_tools_1.addMockFunctionsToSchema({ schema: schema, mocks: mocks_1.default, preserveResolvers: true });
    return schema;
}
exports.default = default_1;
//# sourceMappingURL=schema.js.map