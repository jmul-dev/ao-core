'use strict';
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
var packageJson = require('../../package.json');
var apollo_upload_server_1 = require("apollo-upload-server");
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
function default_1(router) {
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
                // logs: () => db.getLogs(),
                node: function () { return mockStore.node; },
                state: function () { return mockStore.state; },
                settings: function () {
                    return new Promise(function (resolve, reject) {
                        router.send('/db/core/get', { key: 'settings' }).then(function (response) {
                            resolve(response.data);
                        }).catch(reject);
                    });
                },
                videos: function () { return mockStore.videos; },
            },
            Mutation: {
                register: function (obj, args, context, info) {
                    return new Promise(function (resolve, reject) {
                        mockStore.node = {
                            id: args.inputs.ethAddress,
                            ethAddress: args.inputs.ethAddress,
                            creator: {
                                content: mockVideos_1.generateMockVideoList(2)
                            },
                        };
                        // db.setEthAddress(args.inputs.ethAddress).then(() => {
                        //     //Make Data Folder with the Eth Address
                        //     var data_folder_message = new Message({
                        //         app_id: 'testing',
                        //         type_id: "message",
                        //         event: "make_folder",
                        //         from: 'http',
                        //         data: {
                        //             folder_path: join(args.inputs.ethAddress,'dat') //might as well make the dat folder.  this works like mkdirp
                        //         },
                        //         encoding: 'json'
                        //     })
                        //     router.invokeSubProcess(data_folder_message.toJSON(), 'http').then(() => {
                        //         resolve(mockStore.node)
                        //     }).catch(e => error)
                        // }).catch(e => reject(e))
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
                        // var new_dat_folder:string = md5(new Date)
                        // var eth_address:string = db.getEthAddress()
                        // var base_path:string = join(eth_address , 'dat', new_dat_folder)
                        // // Let's see if we can promise our way through this giant mess
                        // var all_inputs = ['video','videoTeaser','featuredImage']
                        // var all_promises:Array<any> = []
                        // for (let i = 0; i < all_inputs.length; i++) {
                        //     const input_name = all_inputs[i];
                        //     var new_promise = new Promise((res,rej) => {
                        //         args.inputs[input_name].then(({stream, filename, mimetype, encoding}) => {
                        //             //debug(`video: filename[${filename}] mimetype[${mimetype}] encoding[${encoding}]`)
                        //             var full_path = join( base_path, input_name )
                        //             var message_data = {
                        //                 stream: stream,
                        //                 stream_direction: 'output',
                        //                 dat_folder: new_dat_folder,
                        //                 file_path: full_path,
                        //                 callback_event: "dat_file_uploaded",
                        //                 type: input_name.includes('video') ? 'video': 'image',
                        //                 encrypt: input_name == 'video'? true : false
                        //             }
                        //             // send message through router to store file
                        //             var message = new Message({
                        //                 app_id: 'testing', //TBD
                        //                 type_id: "stream",
                        //                 event: "stream_write_file",
                        //                 from: "http",
                        //                 data: message_data,
                        //                 encoding: "json"
                        //             })
                        //             router.invokeSubProcess(message.toJSON(), 'http')
                        //             .then(() => {
                        //                 //debug(`${filename} save started!`)
                        //                 res()
                        //             }).catch(err => {
                        //                 error(`${filename} error during save`, err)
                        //                 rej(err)
                        //             })
                        //         }).catch(e => {rej(e)})
                        //     })
                        //     all_promises.push(new_promise)
                        // }
                        // //All Promises
                        // Promise.all(all_promises)
                        // .then(() => {
                        //     debug('All uploads started')
                        //     //Time to start working on JSON creation
                        //     var file_json:Object = {
                        //         title: args.inputs.title,
                        //         description: args.inputs.description,
                        //         stake: args.inputs.stake,
                        //         profit: args.inputs.profit,
                        //         owner: eth_address
                        //     }
                        //     var write_json_message = new Message({
                        //         app_id: 'testing', //TBD
                        //         type_id: "message",
                        //         event: "write_file",
                        //         from: "http",
                        //         data: {
                        //             file_path: join(base_path, 'video.json'),
                        //             file_data: file_json
                        //         },
                        //         encoding: "json"
                        //     })
                        //     router.invokeSubProcess(write_json_message.toJSON(), 'http')
                        //     .then( () => {
                        //         resolve()
                        //     })
                        //     .catch(e => {
                        //         reject(e)
                        //     })
                        // }).catch(e => {
                        //     reject(e)
                        // })
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