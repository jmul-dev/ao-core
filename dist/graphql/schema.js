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
var mockVideos_1 = require("./mockVideos");
var packageJson = require('../../package.json');
var apollo_upload_server_1 = require("apollo-upload-server");
var md5_1 = __importDefault(require("md5"));
var debug_1 = __importDefault(require("debug"));
var debug = debug_1.default('ao:graphql');
var error = debug_1.default('ao:graphql:error');
//adding in series
var PromiseSeries = function series(tasks) {
    return function (x) {
        return tasks.reduce(function (a, b) { return a.then(b); }, Promise.resolve(x));
    };
};
// TODO: replace with actual db calls 
var mockStore = {
    node: null,
    state: 'READY',
    settings: undefined,
    videos: null
};
function default_1(router, options) {
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
            // TODO: refactor resolvers into seperate files
            Query: {
                version: function () { return packageJson.version; },
                logs: function () {
                    return new Promise(function (resolve, reject) {
                        router.send('/db/core/get', { key: 'logs' }).then(function (response) {
                            resolve(response.data || []);
                        }).catch(reject);
                    });
                },
                node: function () { return mockStore.node; },
                state: function () { return mockStore.state; },
                settings: function () {
                    return new Promise(function (resolve, reject) {
                        router.send('/db/core/get', { key: 'settings' }).then(function (response) {
                            resolve(response.data);
                        }).catch(reject);
                    });
                },
                videos: function () {
                    if (!mockStore.videos) {
                        mockStore.videos = mockVideos_1.generateMockVideoList(90, options.coreOrigin, options.corePort);
                    }
                    return;
                },
            },
            Mutation: {
                register: function (obj, args, context, info) {
                    return new Promise(function (resolve, reject) {
                        mockStore.node = {
                            id: args.inputs.ethAddress,
                            ethAddress: args.inputs.ethAddress,
                            creator: {
                                content: mockVideos_1.generateMockVideoList(2, options.coreOrigin, options.corePort)
                            },
                        };
                        //Mkdir is to ensure that the folder exists.
                        var fsMakeDirData = {
                            dirPath: path_1.default.join(args.inputs.ethAddress, 'dat')
                        };
                        router.send('/fs/mkdir', fsMakeDirData)
                            .then(function () {
                            //ResumeAll also initializes the multidat instance
                            var datResumeAllData = {
                                ethAddress: args.inputs.ethAddress
                            };
                            router.send('/dat/resumeAll', datResumeAllData)
                                .then(resolve)
                                .catch(reject);
                        }).catch(reject);
                    });
                },
                updateSettings: function (obj, args, context, info) {
                    return new Promise(function (resolve, reject) {
                        var updateData = {
                            key: 'settings',
                            value: args.inputs,
                            merge: true
                        };
                        router.send('/db/core/update', updateData).then(function (response) {
                            resolve(response.data);
                        }).catch(reject);
                    });
                },
                submitVideoContent: function (obj, args, context, info) {
                    return new Promise(function (resolve, reject) {
                        var newContentId = md5_1.default(new Date);
                        var ethAddress = args.inputs.ethAddress;
                        var contentPath = path_1.default.join(ethAddress, 'dat', newContentId);
                        var fileInputs = ['video', 'videoTeaser', 'featuredImage'];
                        var contentFileNames = [];
                        var fileStorePromises = [];
                        var newContentDirData = {
                            dirPath: contentPath
                        };
                        router.send('/fs/mkdir', newContentDirData)
                            .then(function () {
                            var _loop_1 = function (i) {
                                var fileInputName = fileInputs[i];
                                fileStorePromises.push(new Promise(function (localResolve, localReject) {
                                    args.inputs[fileInputName].then(function (_a) {
                                        var stream = _a.stream, filename = _a.filename, mimetype = _a.mimetype, encoding = _a.encoding;
                                        // attaching the existing file extension if there is one
                                        var fileName = fileInputName + '.' + filename.substr(filename.lastIndexOf('.') + 1);
                                        contentFileNames[i] = fileName;
                                        var writeStreamData = {
                                            stream: stream,
                                            writePath: path_1.default.join(contentPath, fileName),
                                            encrypt: fileInputName == 'video' ? true : false,
                                            videoStats: fileInputName.includes('video') ? true : false
                                        };
                                        router.send('/fs/writeStream', writeStreamData).then(localResolve).catch(localReject);
                                    }).catch(localReject);
                                }));
                            };
                            for (var i = 0; i < fileInputs.length; i++) {
                                _loop_1(i);
                            }
                            PromiseSeries(fileStorePromises).then(function (results) {
                                debug('submitVideoContent - all files stored');
                                var fileSize = 0;
                                var videoStats = {};
                                for (var i = 0; i < results.length; i++) {
                                    var result = results[i];
                                    if (result.data.videoStats && result.data.key) {
                                        videoStats = result.data.videoStats;
                                        fileSize = result.data.fileSize;
                                    }
                                }
                                //call the dat create
                                var datCreateData = {
                                    newDatDir: contentPath
                                };
                                router.send('/dat/create', datCreateData)
                                    .then(function (datResponse) {
                                    var datKey = datResponse.data.key;
                                    var contentJson = {
                                        id: newContentId,
                                        creatorId: ethAddress,
                                        datKey: datKey,
                                        contentType: 'VOD',
                                        isFolder: false,
                                        isMutable: false,
                                        title: args.inputs.title,
                                        description: args.inputs.description,
                                        stake: args.inputs.stake,
                                        profit: args.inputs.profit,
                                        createdAt: Date.now(),
                                        fileName: contentFileNames[0],
                                        fileUrl: ethAddress + "/dat/" + newContentId + "/" + contentFileNames[0],
                                        fileSize: fileSize,
                                        teaserUrl: ethAddress + "/dat/" + newContentId + "/" + contentFileNames[1],
                                        featuredImageUrl: ethAddress + "/dat/" + newContentId + "/" + contentFileNames[2],
                                        metadata: {
                                            duration: videoStats['duration'],
                                            resolution: videoStats['height'],
                                            encoding: videoStats['codec'],
                                        }
                                    };
                                    var contentWriteData = {
                                        writePath: ethAddress + "/dat/" + newContentId + "/content.json",
                                        data: JSON.stringify(contentJson)
                                    };
                                    router.send('/fs/write', contentWriteData).then(function (result) {
                                        resolve(contentJson);
                                    }).catch(function (error) {
                                        // TODO: attempt to cleanup file storage
                                        reject(error);
                                    });
                                }).catch(reject);
                            }).catch(reject);
                        }).catch(reject);
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