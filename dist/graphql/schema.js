'use strict';
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var graphql_tools_1 = require("graphql-tools");
var graphql_import_1 = require("graphql-import");
var path_1 = __importDefault(require("path"));
var join = path_1.default.join;
var graphqlSchema = graphql_import_1.importSchema(path_1.default.resolve(__dirname, './schema.graphql'));
var mocks_1 = __importDefault(require("./mocks"));
var mockVideos_1 = require("./mockVideos");
var message_1 = __importDefault(require("../messaging/message"));
var packageJson = require('../../package.json');
var apollo_upload_server_1 = require("apollo-upload-server");
var md5_1 = __importDefault(require("md5"));
var debug_1 = __importDefault(require("debug"));
var debug = debug_1.default('ao:graphql');
var error = debug_1.default('ao:graphql:error');
// TODO: replace with actual db calls 
var mockStore = {
    node: null,
    state: 'READY',
    settings: undefined,
    videos: mockVideos_1.generateMockVideoList()
};
function default_1(db, router) {
    var schema = graphql_tools_1.makeExecutableSchema({
        typeDefs: [graphqlSchema],
        resolvers: {
            Upload: apollo_upload_server_1.GraphQLUpload,
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
                settings: function () { return mockStore.settings; },
                videos: function () { return mockStore.videos; },
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
                            db.setEthAddress(args.inputs.ethAddress)
                                .then(function () {
                                //Make Data Folder with the Eth Address
                                var data_folder_message = new message_1.default({
                                    app_id: 'testing',
                                    type_id: "message",
                                    event: "make_folder",
                                    from: 'http',
                                    data: {
                                        folder_path: join(args.inputs.ethAddress, 'dat') //might as well make the dat folder.  this works like mkdirp
                                    },
                                    encoding: 'json'
                                });
                                router.invokeSubProcess(data_folder_message.toJSON(), 'http')
                                    .then(function () {
                                    resolve(mockStore.node);
                                })
                                    .catch(function (e) { return error; });
                            })
                                .catch(function (e) { return reject(e); });
                        }, 2500);
                    });
                },
                updateSettings: function (obj, args, context, info) {
                    return new Promise(function (resolve, reject) {
                        mockStore.settings = __assign({}, mockStore.settings, args.inputs);
                        db.writeSettings(mockStore.settings)
                            .then(function () {
                            resolve(mockStore.settings);
                        })
                            .catch(function (e) {
                            reject(e);
                        });
                    });
                },
                submitVideoContent: function (obj, args, context, info) {
                    return new Promise(function (resolve, reject) {
                        // TODO: handle file uploads: video, videoTeaser, featuredImage
                        args.inputs.video.then(function (_a) {
                            var stream = _a.stream, filename = _a.filename, mimetype = _a.mimetype, encoding = _a.encoding;
                            debug("video: filename[" + filename + "] mimetype[" + mimetype + "] encoding[" + encoding + "]");
                            var new_dat_folder = md5_1.default(new Date);
                            var eth_address = db.getEthAddress();
                            var full_path = join(eth_address, 'dat', new_dat_folder, filename);
                            // send message through router to store file
                            var message = new message_1.default({
                                app_id: 'testing',
                                type_id: "stream",
                                event: "stream_write_file",
                                from: "http",
                                data: {
                                    stream: stream,
                                    stream_direction: 'output',
                                    file_path: full_path
                                },
                                encoding: "json"
                            });
                            router.invokeSubProcess(message.toJSON(), 'http').then(function () {
                                debug(filename + " saved!");
                            }).catch(function (err) {
                                error(filename + " error during save", err);
                            });
                        });
                        // TODO: resolve once submition is complete
                        resolve();
                    });
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
    if (process.env.NODE_ENV !== 'production')
        graphql_tools_1.addMockFunctionsToSchema({ schema: schema, mocks: mocks_1.default, preserveResolvers: true });
    return schema;
}
exports.default = default_1;
//# sourceMappingURL=schema.js.map