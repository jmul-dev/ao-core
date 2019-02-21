import Debug from "../../AODebug";
import md5 from "md5";
import path from "path";
import { IGraphqlResolverContext } from "../../http";
import AOContent, {
    AOContentState,
    AOContentType,
    AOContentLicense
} from "../../models/AOContent";
import { AODat_Create_Data } from "../../modules/dat/dat";
import {
    IAOFS_Mkdir_Data,
    IAOFS_Move_Data,
    IAOFS_WriteStream_Data,
    IAOFS_Write_Data
} from "../../modules/fs/fs";
import { IAORouterMessage } from "../../router/AORouter";
const debug = Debug("ao:graphql:submitContent");

export interface ISubmitContent_Args {
    inputs: {
        contentType: AOContentType;
        contentLicense: AOContentLicense;
        contentAttribution?: string;
        ethAddress: string;
        content: Promise<any>;
        videoTeaser?: Promise<any>;
        featuredImage: Promise<any>;
        title: string;
        description: string;
        stake: number;
        profitSplitPercentage: number;
        stakePrimordialPercentage: number;
        taoId?: string;
    };
}

export default (
    obj: any,
    args: ISubmitContent_Args,
    context: IGraphqlResolverContext,
    info: any
) => {
    return new Promise((resolve, reject) => {
        /**
         * Quick note on this process, we initialize and store content in temp
         * locations
         */
        const ethAddress: string = args.inputs.ethAddress;
        const contentTempId: string = md5(new Date());
        const metadataTempId: string = md5(new Date() + "-preview");
        const contentTempPath: string = path.join("content", contentTempId);
        const metadataTempPath: string = path.join("content", metadataTempId);
        const metadataFileFields = ["featuredImage", "videoTeaser"];
        let contentJson: AOContent = AOContent.fromObject({
            nodeId: ethAddress,
            creatorId: ethAddress,
            taoId: args.inputs.taoId,
            contentType: args.inputs.contentType,
            contentLicense: args.inputs.contentLicense,
            contentAttribution: args.inputs.contentAttribution,
            isFolder: false, // TODO: determine if args.inputs.content is a folder
            isMutable: false,
            title: args.inputs.title,
            description: args.inputs.description,
            stake: args.inputs.stake,
            profitSplitPercentage: args.inputs.profitSplitPercentage,
            stakePrimordialPercentage: args.inputs.stakePrimordialPercentage,
            createdAt: Date.now().toString()
        });

        Promise.resolve()
            .then(() => {
                // 1. Ensure directories exist before writing content
                debug(`Beginning upload process...`);
                const newContentDirData: IAOFS_Mkdir_Data = {
                    dirPath: contentTempPath
                };
                const newPreviewDirData: IAOFS_Mkdir_Data = {
                    dirPath: metadataTempPath
                };
                const mkdirPromises: Array<Promise<any>> = [
                    context.router.send("/fs/mkdir", newContentDirData),
                    context.router.send("/fs/mkdir", newPreviewDirData)
                ];
                return Promise.all(mkdirPromises);
            })
            .then(
                ([contentDirResponse, metadataDirResponse]: Array<
                    IAORouterMessage
                >) => {
                    // 2. Metadata content store
                    debug(`Temp directories created`);
                    debug(
                        `Beginning storage of metadata file uploads [featuredImage, teaserVideo]...`
                    );
                    const storagePromises: Array<
                        Promise<any>
                    > = metadataFileFields.reduce((acc, fieldName) => {
                        const inputUploadPromise = args.inputs[fieldName];
                        if (
                            !inputUploadPromise ||
                            typeof inputUploadPromise.then !== "function"
                        ) {
                            // safety check to make sure we have the upload
                            return acc;
                        }
                        acc.push(
                            new Promise((localResolve, localReject) => {
                                inputUploadPromise
                                    .then(
                                        ({
                                            stream,
                                            filename,
                                            mimetype,
                                            encoding
                                        }) => {
                                            // attaching the existing file extension if there is one
                                            const fileName =
                                                fieldName +
                                                "." +
                                                filename.substr(
                                                    filename.lastIndexOf(".") +
                                                        1
                                                );
                                            if (fieldName === "featuredImage") {
                                                contentJson.featuredImageUrl = fileName;
                                            } else if (
                                                fieldName === "teaserVideo"
                                            ) {
                                                contentJson.teaserUrl = fileName;
                                            }
                                            const writeStreamData: IAOFS_WriteStream_Data = {
                                                stream: stream,
                                                streamDirection: "write",
                                                writePath:
                                                    fieldName == "content"
                                                        ? path.join(
                                                              contentTempPath,
                                                              fileName
                                                          )
                                                        : path.join(
                                                              metadataTempPath,
                                                              fileName
                                                          ),
                                                encrypt: false,
                                                videoStats: false
                                            };
                                            context.router
                                                .send(
                                                    "/fs/writeStream",
                                                    writeStreamData
                                                )
                                                .then(localResolve)
                                                .catch(localReject);
                                        }
                                    )
                                    .catch(localReject);
                            })
                        );
                        return acc;
                    }, []);
                    return Promise.all(storagePromises);
                }
            )
            .then(([]: Array<IAORouterMessage>) => {
                // 3. TODO Content processing based on contentType (if necessary)
                debug(`Metadata file uploads written to temp directory`);
                return Promise.resolve();
            })
            .then(() => {
                // 4. Content storage
                debug(`Attempting to encrypt and write content...`);
                return new Promise((localResolve, localReject) => {
                    args.inputs.content
                        .then(({ stream, filename, mimetype, encoding }) => {
                            // attaching the existing file extension if there is one
                            const fileName =
                                "content." +
                                filename.substr(filename.lastIndexOf(".") + 1);
                            contentJson.fileName = fileName;
                            contentJson.fileUrl = fileName;
                            const writeStreamData: IAOFS_WriteStream_Data = {
                                stream: stream,
                                streamDirection: "write",
                                writePath: path.join(contentTempPath, fileName),
                                encrypt: true,
                                videoStats:
                                    args.inputs.contentType ===
                                    AOContent.Types.VOD
                            };
                            context.router
                                .send("/fs/writeStream", writeStreamData)
                                .then(localResolve)
                                .catch(localReject);
                        })
                        .catch(localReject);
                });
            })
            .then(
                ({
                    data: {
                        key,
                        fileSize,
                        checksum,
                        encryptedChecksum,
                        videoStats
                    }
                }) => {
                    // 5. Content (and metadata files) have been writin to disk, update contentJson
                    debug(`Content encrypted and stored to temp directory`);
                    contentJson.decryptionKey = key;
                    contentJson.baseChallenge = checksum;
                    contentJson.encChallenge = encryptedChecksum;
                    contentJson.state = AOContent.States.DAT_INITIALIZED;
                    contentJson.fileChecksum = checksum;
                    contentJson.fileSize = fileSize;
                    contentJson.metadata = videoStats;
                    return Promise.resolve();
                }
            )
            .then(() => {
                // 6. Dat intialization, both content and metadata (used in discovery)
                debug(`Initializing content and metadata Dats...`);
                const datCreateContentData: AODat_Create_Data = {
                    newDatDir: contentTempId
                };
                const datCreatePreviewData: AODat_Create_Data = {
                    newDatDir: metadataTempId
                };
                return Promise.all([
                    context.router.send("/dat/create", datCreateContentData),
                    context.router.send("/dat/create", datCreatePreviewData)
                ]);
            })
            .then(
                ([contentDatResponse, metadataDatResponse]: Array<
                    IAORouterMessage
                >) => {
                    // 7. Update contentJson with dat keys
                    debug(
                        `Metadata Dat initialized: dat://${
                            metadataDatResponse.data.key
                        }`
                    );
                    debug(
                        `Content Dat initialized: dat://${
                            contentDatResponse.data.key
                        }`
                    );
                    contentJson.id = metadataDatResponse.data.key;
                    contentJson.metadataDatKey = metadataDatResponse.data.key;
                    contentJson.fileDatKey = contentDatResponse.data.key;
                    return Promise.resolve();
                }
            )
            .then(() => {
                // 8. Dats are initialized, lets update the contentJson with those dat keys and then write contentJson into metadata dat repo
                // NOTE: there is an important distinction between the following:
                //  contentJson.toMetadataJson(): contains information needed for public discovery
                //  contentJson.toRawJson(): contains all of this content's fields, including decryption key!
                debug(
                    `Writing metadata content.json and inserting content into user db...`
                );
                const contentWriteData: IAOFS_Write_Data = {
                    writePath: `content/${metadataTempId}/content.json`,
                    data: JSON.stringify(contentJson.toMetadataJson())
                };
                return Promise.all([
                    context.router.send("/fs/write", contentWriteData),
                    context.router.send(
                        "/db/user/content/insert",
                        contentJson.toRawJson()
                    )
                ]);
            })
            .then(
                ([contentJsonWriteResponse, contentInsertResponse]: Array<
                    IAORouterMessage
                >) => {
                    // 9. Everything is written and good to go, now we move everything from temp location to perminent residence
                    debug(
                        `content.json stored in metadata dat, content inserted into user db`
                    );
                    debug(`Moving content from temp directories...`);
                    const movePreviewDatData: IAOFS_Move_Data = {
                        srcPath: path.join("content", metadataTempId),
                        destPath: path.join(
                            "content",
                            contentJson.metadataDatKey
                        )
                    };
                    const moveContentDatData: IAOFS_Move_Data = {
                        srcPath: path.join("content", contentTempId),
                        destPath: path.join("content", contentJson.fileDatKey)
                    };
                    return Promise.all([
                        context.router.send("/fs/move", movePreviewDatData),
                        context.router.send("/fs/move", moveContentDatData)
                    ]);
                }
            )
            .then(
                ([metadataDatMoveResponse, contentDatMoveResponse]: Array<
                    IAORouterMessage
                >) => {
                    // 10. We made it!
                    debug(`Content succesfully uploaded!`);
                    resolve(contentJson);
                    context.router.send("/db/logs/insert", {
                        message: `[${
                            contentJson.title
                        }] has been uploaded locally, waiting for content stake transaction before this content becomes part of the AO network`,
                        userId: ethAddress
                    });
                }
            )
            .catch((error: Error) => {
                // TODO: This is a catch all for now, but we may want to do some resource cleanup at this stage!
                reject(error);
            });
    });
};

function videoContentUploadHandler(): Promise<any> {
    return new Promise((resolve, reject) => {});
}
