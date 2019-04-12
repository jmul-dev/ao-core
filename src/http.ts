import { graphiqlExpress, graphqlExpress } from "apollo-server-express";
import { json } from "body-parser";
import cors from "cors";
import crypto from "crypto";
import express, { Express, NextFunction, Request, Response } from "express";
import fs from "fs";
import { graphqlUploadExpress } from "graphql-upload";
import { AddressInfo, Server } from "net";
import path from "path";
import Debug from "./AODebug";
import AOUserSession from "./AOUserSession";
import schema from "./graphql/schema";
import AOContent from "./models/AOContent";
import { AODB_UserContentGet_Data } from "./modules/db/db";
import { IAORouterMessage } from "./router/AORouter";
import { AOCoreProcessRouter } from "./router/AORouterInterface";
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
    public options: Http_Args;

    constructor(
        router: AOCoreProcessRouter,
        options: Http_Args,
        userSession: AOUserSession
    ) {
        this.router = router;
        this.options = options;
        this.express = express();
        const graphqlSchema = schema();
        const corsOrigin =
            process.env.NODE_ENV === "development"
                ? [
                      options.httpOrigin,
                      "http://localhost",
                      "http://localhost:3000"
                  ]
                : options.httpOrigin;
        debug(
            `settings cors on server: ${corsOrigin}, process.env.NODE_ENV=${
                process.env.NODE_ENV
            }`
        );
        this.express.use(
            "/graphql",
            cors({
                origin: corsOrigin
            }),
            json(),
            graphqlUploadExpress({ maxFieldSize: "1gb" }),
            graphqlExpress({
                schema: graphqlSchema,
                // debug prints additional info when execution error occurs
                debug: debug,
                // context given to our graphql resolvers
                context: {
                    router,
                    options,
                    userSession
                }
            })
        );
        if (process.env.NODE_ENV === "development") {
            this.express.get(
                "/graphiql",
                graphiqlExpress({ endpointURL: "/graphql" })
            );
        }
        this.express.get(
            `/${Http.ENCRYPTED_RESOURCES_ENDPOINT}/:key/:filename`,
            this._serveResource.bind(this, { encrypted: true })
        );
        this.express.get(
            `/${Http.RESOURCES_ENDPOINT}/:key/:filename`,
            this._serveResource.bind(this, { encrypted: false })
        );
        this.express.get(
            `/${Http.RESOURCES_ENDPOINT}/:key/:folder/*`,
            this._serveResource.bind(this, { encrypted: false })
        );
    }

    public start(): Promise<any> {
        let promiseHandled = false;
        return new Promise((resolve, reject) => {
            this.server = this.express.listen(this.options.corePort, () => {
                const address: AddressInfo = <AddressInfo>this.server.address();
                debug("Express server running on port: " + address.port);
                this.router.send("/core/log", {
                    message: `AO http interface running on port ${
                        address.port
                    }, accesible from origin ${this.options.httpOrigin}`
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

    private _serveResource(
        resourceOptions: { encrypted: boolean },
        request: Request,
        response: Response,
        next: NextFunction
    ) {
        const { key, filename } = request.params;
        const contentRelativePath = request.path.substring(
            request.path.indexOf(key)
        );
        const resourceLocation = path.resolve(
            this.options.storageLocation,
            "content",
            contentRelativePath
        );
        Promise.resolve()
            .then(() => {
                // 1. Ensure resource exists
                return new Promise((resolve, reject) => {
                    fs.access(
                        resourceLocation,
                        fs.constants.R_OK,
                        (error?: Error) => {
                            if (error) {
                                reject(error);
                            } else {
                                resolve();
                            }
                        }
                    );
                });
            })
            .then(() => {
                return new Promise((resolve, reject) => {
                    if (!resourceOptions.encrypted) {
                        // Non-encrypted resource does not need to fetch content from user db
                        return resolve();
                    }
                    // 2. Fetch corresponding content
                    const userContentData: AODB_UserContentGet_Data = {
                        query: { fileDatKey: key }
                    };
                    this.router
                        .send("/db/user/content/get", userContentData)
                        .then((userContentResponse: IAORouterMessage) => {
                            if (
                                !userContentResponse.data ||
                                userContentResponse.data.length < 1
                            ) {
                                reject(
                                    new Error(
                                        `Content not found for the current user`
                                    )
                                );
                                return;
                            }
                            const content: AOContent = AOContent.fromObject(
                                userContentResponse.data[0]
                            );
                            resolve(content);
                        })
                        .catch(reject);
                });
            })
            .then((content?: AOContent) => {
                // 3. Stat file for content length
                return new Promise((resolve, reject) => {
                    fs.stat(
                        resourceLocation,
                        (error: Error, stats: fs.Stats) => {
                            if (error) {
                                reject(error);
                            } else {
                                // Write headers
                                response.set("Accept-Ranges", "bytes");
                                response.set("Content-Length", `${stats.size}`);
                                if (content && content.mimetype) {
                                    response.set(
                                        "Content-Type",
                                        content.mimetype
                                    );
                                }
                                resolve(content);
                            }
                        }
                    );
                });
            })
            .then((content?: AOContent) => {
                // 4. Time to stream response
                return new Promise((resolve, reject) => {
                    response.status(200);
                    const contentStream: fs.ReadStream = fs.createReadStream(
                        resourceLocation
                    );
                    if (resourceOptions.encrypted) {
                        const encryptionAlgorithm =
                            content.encryptionAlgorithm || "aes-256-ctr";
                        const availableCiphers = crypto.getCiphers();
                        if (
                            availableCiphers.indexOf(encryptionAlgorithm) === -1
                        ) {
                            reject(
                                new Error(
                                    `Unsupported cipher: ${encryptionAlgorithm}`
                                )
                            );
                            return;
                        }
                        const decryptionTransformer = crypto.createDecipher(
                            encryptionAlgorithm,
                            content.decryptionKey
                        );
                        contentStream
                            .pipe(decryptionTransformer)
                            .on("error", reject)
                            .pipe(response)
                            .on("error", reject);
                    } else {
                        contentStream.pipe(response).on("error", reject);
                    }
                });
            })
            .catch(next);
    }

    public shutdown(err?: Error) {
        debug("Http shutting down");
        debug(err);
        this.server.close();
    }
}
