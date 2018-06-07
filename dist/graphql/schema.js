'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var graphql_tools_1 = require("graphql-tools");
var graphql_import_1 = require("graphql-import");
var path_1 = __importDefault(require("path"));
var graphqlSchema = graphql_import_1.importSchema(path_1.default.resolve(__dirname, './schema.graphql'));
// import RootQuery from "./queries/index.graphql";
// import RootMutation from "./mutations/index.graphql";
// // import Types from "./types/index";
// const Types = require('./types/index');
var mocks_1 = __importDefault(require("./types/mocks"));
var packageJson = require('../../package.json');
// const SchemaDefinition = `
//     schema {
//         query: RootQuery,
//         mutation: RootMutation,
//     }
// `
function default_1(db) {
    var schema = graphql_tools_1.makeExecutableSchema({
        // TODO: type def's should probably mirror the Database models. Maybe we can 
        // more closely define these at some point
        typeDefs: [graphqlSchema],
        resolvers: {
            Query: {
                version: function () { return packageJson.version; },
            },
        }
    });
    // NOTE: set preserveResolvers to true if we only want to mock undefined resolvers,
    // and use resolvers that are already defined.
    // TODO: conditional on process.env.NODE_ENV
    graphql_tools_1.addMockFunctionsToSchema({ schema: schema, mocks: mocks_1.default, preserveResolvers: true });
    return schema;
}
exports.default = default_1;
//# sourceMappingURL=schema.js.map