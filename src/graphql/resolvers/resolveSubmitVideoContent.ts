import { Http_Args } from '../../modules/http/http';
import { IAORouterMessage } from "../../router/AORouter";
import { AOCoreProcessRouter } from "../../router/AORouterInterface";
import md5 from 'md5';
import path from 'path';
import { AODat_Create_Data } from '../../modules/dat/dat';
import { IAOFS_Mkdir_Data, IAOFS_WriteStream_Data, IAOFS_Write_Data, IAOFS_Move_Data } from '../../modules/fs/fs';
import Debug from 'debug';
import { AOContentState } from '../../models/AOContent';
const debug = Debug('ao:graphql:submitVideoContent');


export default function (aoRouter: AOCoreProcessRouter, options: Http_Args) {
    return (obj: any, args: any, context: any, info: any) => {
        return new Promise((resolve, reject) => {
            const ethAddress: string = args.inputs.ethAddress;

            const newContentId: string = md5(new Date);
            const newPreviewId: string = md5(new Date + '-preview');
            const contentPath: string = path.join('content', newContentId)
            const previewPath: string = path.join('content', newPreviewId)

            const fileInputs = ['video', 'videoTeaser', 'featuredImage']

            let contentFileNames: Array<string> = []
            let fileStorePromises: Array<Promise<any>> = []
            const newContentDirData: IAOFS_Mkdir_Data = {
                dirPath: contentPath
            }
            const newPreviewDirData: IAOFS_Mkdir_Data = {
                dirPath: previewPath
            }
            const mkdirPromises: Array<Promise<any>> = [
                aoRouter.send('/fs/mkdir', newContentDirData),
                aoRouter.send('/fs/mkdir', newPreviewDirData)
            ]
            Promise.all(mkdirPromises).then(() => {
                for (let i = 0; i < fileInputs.length; i++) {
                    const fileInputName = fileInputs[i];
                    fileStorePromises.push(new Promise((localResolve, localReject) => {
                        args.inputs[fileInputName].then(({ stream, filename, mimetype, encoding }) => {
                            // attaching the existing file extension if there is one
                            const fileName = fileInputName + '.' + filename.substr(filename.lastIndexOf('.') + 1)
                            contentFileNames[i] = fileName
                            const writeStreamData: IAOFS_WriteStream_Data = {
                                stream: stream,
                                streamDirection: 'write',
                                writePath: fileInputName == 'video' ? path.join(contentPath, fileName) : path.join(previewPath, fileName),
                                encrypt: fileInputName == 'video' ? true : false,
                                videoStats: fileInputName.includes('video') ? true : false
                            }
                            aoRouter.send('/fs/writeStream', writeStreamData).then(localResolve).catch(localReject)
                        }).catch(localReject)
                    }))
                }
                Promise.all(fileStorePromises).then((results: Array<IAORouterMessage>) => {
                    debug('all files stored')
                    let fileSize = 0
                    let videoStats = {}
                    let decryptionKey: string
                    for (let i = 0; i < results.length; i++) {
                        const result = results[i];
                        if (result.data.videoStats && result.data.key) {
                            videoStats = result.data.videoStats
                            fileSize = result.data.fileSize
                            decryptionKey = result.data.key
                        }
                    }

                    const datCreateContentData: AODat_Create_Data = {
                        newDatDir: newContentId
                    }
                    const datCreatePreviewData: AODat_Create_Data = {
                        newDatDir: newPreviewId
                    }
                    const datCreatePromises: Array<Promise<any>> = [
                        aoRouter.send('/dat/create', datCreateContentData),
                        aoRouter.send('/dat/create', datCreatePreviewData)
                    ]
                    Promise.all(datCreatePromises).then((datResponses) => {
                        let metadataDatKey: string;
                        let contentDatKey: string;
                        let previewDatResponseData: Object;
                        for (let i = 0; i < datResponses.length; i++) {
                            const datResponseData = datResponses[i].data;
                            if (datResponseData.dir == newPreviewId) {
                                metadataDatKey = datResponseData.key
                                previewDatResponseData = datResponseData
                            } else {
                                contentDatKey = datResponseData.key
                            }
                        }

                        const contentJson = {
                            id: contentDatKey,
                            nodeId: ethAddress,

                            creatorId: ethAddress,
                            metadataDatKey: metadataDatKey,
                            contentType: 'VOD',                            
                            isFolder: false, // TODO: determine if args.inputs.video is a folder
                            isMutable: false,
                            title: args.inputs.title,
                            description: args.inputs.description,
                            stake: args.inputs.stake,
                            profit: args.inputs.profit,
                            createdAt: Date.now(),

                            fileUrl: `${contentDatKey}/${contentFileNames[0]}`,
                            fileDatKey: contentDatKey,
                            fileName: contentFileNames[0],
                            fileSize: fileSize,
                            teaserName: `${contentFileNames[1]}`,
                            teaserUrl: `${metadataDatKey}/${contentFileNames[1]}`,
                            featuredImageName: `${contentFileNames[2]}`,
                            featuredImageUrl: `${metadataDatKey}/${contentFileNames[2]}`,

                            metadata: {
                                duration: videoStats['duration'],
                                resolution: videoStats['height'],//we have the width too, but dunno
                                encoding: videoStats['codec'],
                            }
                        }
                        const storagePromises: Array<Promise<any>> = []
                        const contentWriteData: IAOFS_Write_Data = {
                            writePath: `content/${newPreviewId}/content.json`,
                            data: JSON.stringify(contentJson)
                        }

                        const userContentJson = {
                            ...contentJson,
                            decryptionKey: decryptionKey,
                            state: AOContentState.ENCRYPTED,
                        }

                        storagePromises.push(aoRouter.send('/fs/write', contentWriteData))
                        storagePromises.push(aoRouter.send('/db/user/content/insert', userContentJson))

                        Promise.all(storagePromises).then((results: Array<IAORouterMessage>) => {
                            const movePreviewDatData: IAOFS_Move_Data = {
                                srcPath: path.join('content', newPreviewId),
                                destPath: path.join('content', metadataDatKey)
                            }
                            const moveContentDatData: IAOFS_Move_Data = {
                                srcPath: path.join('content', newContentId),
                                destPath: path.join('content', contentDatKey)
                            }
                            const folderMovePromises: Array<Promise<any>> = [
                                aoRouter.send('/fs/move', movePreviewDatData),
                                aoRouter.send('/fs/move', moveContentDatData)
                            ]
                            Promise.all(folderMovePromises).then(() => {
                                resolve(contentJson)
                            }).catch(reject)
                        }).catch((error: Error) => {
                            // We either failed to write contentJson to disk or db, lets cleanup to 
                            // avoid dirty state.
                            // TODO: attempt to cleanup file storage.
                            reject(error)
                        })

                    }).catch(reject)//double dat creation

                }).catch(reject)//filestore/encrypt/get stats

            }).catch(reject)//mkdir
        })
    }
}