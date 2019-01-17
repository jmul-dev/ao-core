import express, { Express, Response } from "express";
import schema from "./graphql/schema";
import { Server, AddressInfo } from "net";
import cors from "cors";
import path from "path";
import { json } from "body-parser";
import { graphqlExpress, graphiqlExpress } from "apollo-server-express";
import { apolloUploadExpress } from "apollo-upload-server";
import Debug from "./AODebug";
import { AOCoreProcessRouter } from "./router/AORouterInterface";
import { AODat_Check_Data } from "./modules/dat/dat";
import { IAOFS_ReadStream_Data, IAOFS_FileStat_data } from "./modules/fs/fs";
import { AODB_UserContentGet_Data } from "./modules/db/db";
import AOUserSession from "./AOUserSession";
import AOContent from "./models/AOContent";
const debug = Debug("ao:http");

export interface Http_Args {
    httpOrigin: string;
    coreOrigin: string;
    corePort: number;
    storageLocation: string;
    desktopLocation?: string;
}

export interface IGraphqlResolverContext {
    router: AOCoreProcessRouter;
    options: Http_Args;
    userSession: AOUserSession;
}

export default class Http {
    public static RESOURCES_ENDPOINT = "resources";
    public static ENCRYPTED_RESOURCES_ENDPOINT = "resources/user";
    private express: Express;
    private server: Server;
    private router: AOCoreProcessRouter;
    public corePort: number;
    public httpOrigin: string;

    constructor(
        router: AOCoreProcessRouter,
        options: Http_Args,
        userSession: AOUserSession
    ) {
        this.router = router;
        this.corePort = options.corePort;
        this.httpOrigin = options.httpOrigin;
        this.express = express();
        const graphqlSchema = schema();
        this.express.use(
            "/graphql",
            cors({ origin: options.httpOrigin }),
            json(),
            apolloUploadExpress({ maxFieldSize: "1gb" }),
            graphqlExpress({
                schema: graphqlSchema,
                // context given to our graphql resolvers
                context: {
                    router,
                    options,
                    userSession
                }
            })
        );
        if (process.env.NODE_ENV !== "production") {
            this.express.get(
                "/graphiql",
                graphiqlExpress({ endpointURL: "/graphql" })
            );
        }
        this.express.get(
            `/${Http.RESOURCES_ENDPOINT}/:key/:filename`,
            async (request, response: Response, next) => {
                this._streamFile(request, response)
                    .then(({ data }) => {
                        // response.end();
                    })
                    .catch(error => {
                        debug(error);
                        next(error);
                    });
            }
        );
        this.express.get(
            `/${Http.ENCRYPTED_RESOURCES_ENDPOINT}/:key/:filename`,
            async (request, response: Response, next) => {
                this._streamEncryptedFile(request, response)
                    .then(() => {
                        // response.end();
                    })
                    .catch(error => {
                        debug(error);
                        next(error);
                    });
            }
        );
    }

    public start(): Promise<any> {
        let promiseHandled = false;
        return new Promise((resolve, reject) => {
            this.server = this.express.listen(this.corePort, () => {
                const address: AddressInfo = <AddressInfo>this.server.address();
                debug("Express server running on port: " + address.port);
                this.router.send("/core/log", {
                    message: `AO http interface running on port ${
                        address.port
                    }, accesible from origin ${this.httpOrigin}`
                });
                debug(`started`);
                promiseHandled = true;
                resolve();
            });
            this.server.on("error", (error: Error) => {
                this.shutdown(error);
                if (!promiseHandled) {
                    promiseHandled = true;
                    reject();
                }
            });
        });
    }

    private _streamFile(request, response) {
        return new Promise((resolve, reject) => {
            const datKey = request.params.key;
            const filename = request.params.filename;

            //First check to make sure the file exists in the dat check
            const datCheckData: AODat_Check_Data = {
                key: datKey
            };
            this.router
                .send("/dat/exists", datCheckData)
                .then(() => {
                    const filePath = path.join("content", datKey, filename);
                    const statFileData: IAOFS_FileStat_data = {
                        path: filePath
                    };
                    this.router
                        .send("/fs/stats", statFileData)
                        .then(fileStats => {
                            const fileSize = fileStats.data.size;
                            let streamOptions: Object = {};
                            //Images and smaller files
                            let head200 = {
                                "Accept-Ranges": "bytes",
                                "Content-Length": fileSize
                            };
                            debug(
                                `/${datKey}/${filename}: Content-Length: ${fileSize}`
                            );
                            response.writeHead(200, head200);
                            const readFileData: IAOFS_ReadStream_Data = {
                                stream: response,
                                streamDirection: "read",
                                streamOptions: streamOptions,
                                readPath: filePath
                            };
                            this.router
                                .send("/fs/readStream", readFileData)
                                .then(resolve)
                                .catch(reject);
                        })
                        .catch(reject);
                })
                .catch(reject);
        });
    }

    private _streamEncryptedFile(request, response) {
        return new Promise((resolve, reject) => {
            const datKey = request.params.key;
            const filename = request.params.filename;

            //make sure dat exists
            const datCheckData: AODat_Check_Data = {
                key: datKey
            };
            this.router
                .send("/dat/exists", datCheckData)
                .then(() => {
                    //get the decryption key
                    const userContentData: AODB_UserContentGet_Data = {
                        query: { fileDatKey: datKey }
                    };
                    this.router
                        .send("/db/user/content/get", userContentData)
                        .then(doc => {
                            if (doc.data.length) {
                                let docData: AOContent = AOContent.fromObject(
                                    doc.data[0]
                                );
                                let total = docData.fileSize;
                                let streamOptions: Object = {};
                                let head200 = {
                                    "Accept-Ranges": "bytes",
                                    "Content-Length": total
                                };
                                response.writeHead(200, head200);

                                //Stream the freaken file
                                const readFileData: IAOFS_ReadStream_Data = {
                                    stream: response,
                                    streamDirection: "read",
                                    streamOptions: streamOptions,
                                    readPath: path.join(
                                        "content",
                                        datKey,
                                        filename
                                    ),
                                    key: docData.decryptionKey
                                };
                                this.router
                                    .send("/fs/readStream", readFileData)
                                    .then(resolve)
                                    .catch(reject);
                            } else {
                                reject(new Error("No such datKey"));
                            }
                        })
                        .catch(reject);
                })
                .catch(reject);
        });
    }

    public shutdown(err?: Error) {
        debug("Http shutting down");
        debug(err);
        this.server.close();
    }
}
