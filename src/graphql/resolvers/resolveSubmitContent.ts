import Debug from "../../AODebug";
import md5 from "md5";
import path from "path";
import { IGraphqlResolverContext } from "../../http";
import AOContent, {
    AOContentState,
    AOContentType,
    AOContentLicense,
    AODappContent,
    AOContentTypes
} from "../../models/AOContent";
import {
    AODat_Create_Data,
    AODat_ImportSingle_Data
} from "../../modules/dat/dat";
import {
    IAOFS_Mkdir_Data,
    IAOFS_Move_Data,
    IAOFS_WriteStream_Data,
    IAOFS_Write_Data,
    IAOFS_CheckZipFormIndex_Data
} from "../../modules/fs/fs";
import { IAORouterMessage } from "../../router/AORouter";
import { ReadStream } from "fs";
import archiver from "archiver";
import os from "os";
import fs from "fs";
const debug = Debug("ao:graphql:submitContent");

export interface ISubmitContent_Args {
    inputs: {
        contentType: AOContentType;
        contentLicense: AOContentLicense;
        contentAttribution?: string;
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
        const contentTempId: string = md5(new Date());
        const metadataTempId: string = md5(new Date() + "-preview");
        const contentTempPath: string = path.join("content/tmp", contentTempId);
        const metadataTempPath: string = path.join(
            "content/tmp",
            metadataTempId
        );
        const metadataFileFields = ["featuredImage", "videoTeaser"];

        let contentJson: AOContent = AOContent.fromObject({
            nodePublicKey: context.userSession.publicKey,
            nodeEthAddress: context.userSession.ethAddress,
            creatorNodePublicKey: context.userSession.publicKey,
            creatorEthAddress: context.userSession.ethAddress,
            creatorNameId: context.userSession.aoNameId,
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
                        `Beginning storage of metadata file uploads [featuredImage, videoTeaser]...`
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
                                            filename,
                                            mimetype,
                                            createReadStream
                                        }) => {
                                            const stream = createReadStream();
                                            stream.on("error", error => {
                                                debug(
                                                    `${fieldName} read stream error:`,
                                                    error
                                                );
                                            });
                                            // attaching the existing file extension if there is one
                                            debug(
                                                `inputUploadPromise: ${fieldName}, ${filename}, haveStream: ${
                                                    !stream ? `false` : "true"
                                                }, attempt to writeStream...`
                                            );
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
                                                fieldName === "videoTeaser"
                                            ) {
                                                contentJson.teaserUrl = fileName;
                                            }
                                            const writeStreamData: IAOFS_WriteStream_Data = {
                                                stream: stream,
                                                streamDirection: "write",
                                                writePath: path.join(
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
                debug(
                    `Additional processing based on content type: ${
                        contentJson.contentType
                    }...`
                );
                return new Promise((localResolve, localReject) => {
                    if (Array.isArray(args.inputs.content)) {
                        localReject(
                            new Error(
                                `Multiple file uploads are not supported at this time. Expected 'content' field to be a single file.`
                            )
                        );
                        return null;
                    }
                    args.inputs.content.then(
                        ({ filename, mimetype, createReadStream }) => {
                            const stream = createReadStream();
                            switch (contentJson.contentType) {
                                case AOContent.Types.DAPP:
                                    if (mimetype.indexOf("zip") > -1) {
                                        // Validate zip and make sure there is an index.html file
                                        const checkForIndexArgs: IAOFS_CheckZipFormIndex_Data = {
                                            stream: createReadStream(), // NOTE: we are creating another instance of this read stream that will be consumed seperatly
                                            streamDirection: "write"
                                        };
                                        context.router
                                            .send(
                                                "/fs/checkZipForIndexHtml",
                                                checkForIndexArgs
                                            )
                                            .then(
                                                (
                                                    checkForIndexResponse: IAORouterMessage
                                                ) => {
                                                    if (
                                                        checkForIndexResponse
                                                            .data.indexFound ===
                                                        true
                                                    ) {
                                                        let dappContentJson: AODappContent = contentJson as AODappContent;
                                                        dappContentJson.dappIndexPath =
                                                            checkForIndexResponse.data.indexPath;
                                                        dappContentJson.unpacked = false;
                                                        dappContentJson.mimetype =
                                                            "text/html";
                                                        contentJson = dappContentJson;
                                                        localResolve({
                                                            contentReadStream: stream,
                                                            filename
                                                        });
                                                    } else {
                                                        localReject(
                                                            new Error(
                                                                "The uploaded zip file does not contain an index.html file in its root"
                                                            )
                                                        );
                                                    }
                                                }
                                            )
                                            .catch(localReject);
                                    } else if (mimetype.indexOf("html") > -1) {
                                        // Gzip the html file into a folder to ensure consitent format/structure
                                        dappHtmlFileUploadHandler(
                                            stream,
                                            contentTempId
                                        )
                                            .then(zippedContentStream => {
                                                let dappContentJson: AODappContent = contentJson as AODappContent;
                                                dappContentJson.dappIndexPath = `index.html`;
                                                dappContentJson.unpacked = false;
                                                dappContentJson.mimetype =
                                                    "text/html";
                                                contentJson = dappContentJson;
                                                localResolve({
                                                    contentReadStream: zippedContentStream,
                                                    filename: filename + ".zip"
                                                });
                                            })
                                            .catch(localReject);
                                    } else {
                                        localReject(
                                            new Error(
                                                `Invalid content mimetype, expecting html file or gzipped file, got ${mimetype}`
                                            )
                                        );
                                    }
                                    break;
                                case AOContent.Types.PDF:
                                    if (mimetype.indexOf("pdf") < 0) {
                                        localReject(
                                            new Error(
                                                `Invalid content mimetype, expecting pdf file, got ${mimetype}`
                                            )
                                        );
                                        break;
                                    }
                                default:
                                    contentJson.mimetype = mimetype;
                                    localResolve({
                                        contentReadStream: stream,
                                        filename
                                    });
                                    return null;
                            }
                        }
                    );
                });
            })
            .then(
                ({
                    contentReadStream,
                    filename
                }: {
                    contentReadStream: ReadStream;
                    filename: string;
                }) => {
                    // 4. Content storage
                    debug(`Attempting to encrypt and write content...`);
                    return new Promise((localResolve, localReject) => {
                        // attaching the existing file extension if there is one
                        const fileName =
                            "content." +
                            filename.substr(filename.lastIndexOf(".") + 1);
                        contentJson.fileName = fileName;
                        contentJson.fileUrl = fileName;
                        contentJson.encryptionAlgorithm = "aes-256-ctr"; // TODO: this should be passed to the write stream method
                        const writeStreamData: IAOFS_WriteStream_Data = {
                            stream: contentReadStream,
                            streamDirection: "write",
                            writePath: path.join(contentTempPath, fileName),
                            encrypt: true,
                            videoStats:
                                args.inputs.contentType === AOContent.Types.VOD // TODO: videoStats should be pulled in the resolver above (switch based on content type)
                        };
                        context.router
                            .send("/fs/writeStream", writeStreamData)
                            .then(localResolve)
                            .catch(localReject);
                    });
                }
            )
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
                    // 5a. Content (and metadata files) have been writin to disk, update contentJson
                    debug(`Content encrypted and stored to temp directory`);
                    contentJson.decryptionKey = key;
                    contentJson.encChallenge = encryptedChecksum;
                    contentJson.state = AOContent.States.DAT_INITIALIZED;
                    contentJson.fileChecksum = checksum;
                    contentJson.baseChallenge = checksum;
                    contentJson.fileSize = fileSize;
                    contentJson.metadata = videoStats;
                    return Promise.resolve();
                }
            )
            .then(() => {
                // 5b. Additionally, add base challenge signature
                return new Promise((localResolve, localReject) => {
                    context.userSession
                        .getContentBaseChallengeSignature({
                            contentChecksum: contentJson.fileChecksum
                        })
                        .then(baseChallengeSignature => {
                            contentJson.baseChallengeSignature = baseChallengeSignature;
                            localResolve();
                        })
                        .catch(localReject);
                });
            })
            .then(() => {
                // Add datignore for initial dat create importFiles call
                // Mainly used for ignoring DAPP unpacked folder
                debug(`writing datignore file for initial importFiles`);
                const datignoreWriteData: IAOFS_Write_Data = {
                    writePath: path.join(contentTempPath, `.datignore`),
                    data:
                        contentJson.contentType === AOContentTypes.DAPP
                            ? "# ignore\n.dat\nunpacked\n"
                            : "# ignore\n.dat\n"
                };
                return context.router.send("/fs/write", datignoreWriteData);
            })
            .then(() => {
                // 6. Dat intialization, both content and metadata (used in discovery)
                // newDatDir is relative to the content folder, so we cant use contentTempPath
                debug(`Initializing content and metadata Dats...`);
                const datCreateContentData: AODat_Create_Data = {
                    newDatDir: path.join("tmp", contentTempId)
                };
                const datCreatePreviewData: AODat_Create_Data = {
                    newDatDir: path.join("tmp", metadataTempId)
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
                    writePath: path.join(metadataTempPath, "content.json"),
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
                        srcPath: metadataTempPath,
                        destPath: path.join(
                            "content",
                            contentJson.metadataDatKey
                        )
                    };
                    const moveContentDatData: IAOFS_Move_Data = {
                        srcPath: contentTempPath,
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
                    // 10. Import processed files into dat
                    const importMetadataDatData: AODat_ImportSingle_Data = {
                        key: contentJson.metadataDatKey
                    };
                    const importFileDatData: AODat_ImportSingle_Data = {
                        key: contentJson.fileDatKey
                    };
                    return Promise.all([
                        context.router.send(
                            "/dat/importSingle",
                            importMetadataDatData
                        ),
                        context.router.send(
                            "/dat/importSingle",
                            importFileDatData
                        )
                    ]);
                }
            )
            .then(() => {
                // 11. We made it!
                debug(`Content succesfully uploaded!`);
                resolve(contentJson);
                // NOTE: processContent handles any side effects that take place after uploading content.
                // Currently this only involves unpacking a DAPP.
                context.userSession.processContent(contentJson);
                context.router.send("/db/logs/insert", {
                    message: `[${
                        contentJson.title
                    }] has been uploaded locally, waiting for content stake transaction before this content becomes part of the AO network`,
                    userId: context.userSession.ethAddress
                });
            })
            .catch((error: Error) => {
                // TODO: This is a catch all for now, but we may want to do some resource cleanup at this stage!
                debug(`Error occured during content upload: ${error.message}`);
                // TODO: Remove from user db
                // TODO: cleanup files
                reject(error);
            });
    });
};

function dappHtmlFileUploadHandler(
    indexFileStream,
    contentTempId
): Promise<ReadStream> {
    return new Promise((resolve, reject) => {
        const tmpZipLocation = path.resolve(
            os.tmpdir(),
            contentTempId + ".zip"
        );
        const zippedWriteStream = fs.createWriteStream(tmpZipLocation);
        const archive = archiver("zip", {
            zlib: { level: 9 }
        });
        archive.on("entry", entry => {
            debug(`appended ${entry.name} to zip`);
        });
        archive.on("end", () => {
            try {
                resolve(fs.createReadStream(tmpZipLocation));
                debug(`zip complete`);
            } catch (error) {
                debug(`Error creating read stream on temp zip location`);
                reject(error);
            }
        });
        archive.on("error", function(err) {
            debug(`Error archiving index.html file for content type DAPP`);
            reject(err);
        });
        archive.pipe(zippedWriteStream);
        archive.append(indexFileStream, { name: "index.html" });
        archive.finalize();
    });
}
