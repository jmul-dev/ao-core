import path from 'path'
import md5 from 'md5'
import { IGraphqlResolverContext } from '../../http';
import { IAORouterMessage } from "../../router/AORouter";
import { AODB_NetworkContentGet_Data } from '../../modules/db/db';
import { IAOFS_DecryptCheck_Data, IAOFS_Mkdir_Data, IAOFS_Reencrypt_Data, IAOFS_Move_Data } from '../../modules/fs/fs';
import { AODat_Create_Data, AODat_ResumeSingle_Data } from '../../modules/dat/dat';


interface IContentRequest_Args {
    contentId: string
    decryptionKey: string
}

export default (obj: any, args: IContentRequest_Args, context: IGraphqlResolverContext, info: any) => {
    return new Promise((resolve, reject) => {
        const {contentId, decryptionKey} = args
        // 1. Pull the Content from user content db
        let networkContentQuery: AODB_NetworkContentGet_Data = {
            query: { id: contentId }
        }
        context.router.send('/db/user/content/get', networkContentQuery).then((contentGetResponse: IAORouterMessage) => {
            // 2. Update the content Database and store the decryption key
            let clonedContent = {
                ...contentGetResponse.data[0],
                state: 'DECRYPTION_KEY_RECEIVED',
                originalDecryptionKey: decryptionKey
            }
            context.router.send('/db/user/content/update',clonedContent).then((contentUpdateResponse:IAORouterMessage) => {
                if ( !contentUpdateResponse.data || contentUpdateResponse.data.length !== 1 ) {
                    reject(new Error(`No discovered content with id: ${contentId}`))
                    return;
                }
                // 4. Decrypt/ffprobe/Checksum the downloaded file and match against the content data.
                const encryptedVideoPath = path.join('content', clonedContent.fileDatKey, clonedContent.fileName )
                const decryptChecksumData: IAOFS_DecryptCheck_Data = {
                    path: encryptedVideoPath,
                    decryptionKey: decryptionKey
                }
                context.router.send('/fs/decryptChecksum', decryptChecksumData).then((decryptChecksumResponse:IAORouterMessage) => {
                    let checksum = decryptChecksumResponse.data[0].checksum

                    // 5. Update content state
                    if(checksum != clonedContent.fileChecksum) {
                        clonedContent.state = 'VERIFICATION_FAILED'
                    } else {
                        clonedContent.state = 'VERIFIED'
                    }                    
                    context.router.send('/db/user/content/update',clonedContent).then((contentVerifiedResponse:IAORouterMessage) => {
                        if(clonedContent.state == 'VERIFICATION_FAILED') {
                            // TODO: Let the rest of the network know that there is a bad actor on the network
                            reject( new Error('Checksums do not match.  We have a problem') )                            
                        }

                        // 6. New directory for data to be re-encrypted
                        const newDatDirData : IAOFS_Mkdir_Data = {
                            dirPath: md5( new Date() )
                        }
                        context.router.send('/fs/mkdir', newDatDirData ).then(() => {
                            
                            // 7. Reencrypt original encrypted file into the new dir
                            const fileReencrypt: IAOFS_Reencrypt_Data = {
                                originalPath: encryptedVideoPath,
                                decryptionKey: decryptionKey,
                                finalPath: path.join('content',newDatDirData.dirPath, clonedContent.fileName)
                            }
                            context.router.send('/fs/reencrypt', fileReencrypt).then((reencryptionResponse:IAORouterMessage) => {
                                let newDecrytionKey = reencryptionResponse.data.newKey
                                if( !newDecrytionKey ) {
                                    // TODO: write clean up code erasing the dirpath.
                                    reject(new Error('No new decryption key'))
                                }

                                // 8. Update Content State to Encrypted
                                clonedContent.state = 'ENCRYPTED'
                                context.router.send('/db/user/content/update',clonedContent).then(() => {

                                    // 9. Make Dat
                                    const tempDatDir = path.join('content', newDatDirData.dirPath)
                                    const createDatData: AODat_Create_Data = {
                                        newDatDir: tempDatDir
                                    }
                                    context.router.send('/dat/create', createDatData).then((datCreateResponse:IAORouterMessage) => {
                                        let newDatKey = datCreateResponse.data.key

                                        // 10. Move Dat to its actual key name
                                        const moveNewDatData: IAOFS_Move_Data = {
                                            srcPath: tempDatDir,
                                            destPath: path.join('content', newDatKey)
                                        }
                                        context.router.send('/fs/move', moveNewDatData).then(()=> {
                                            
                                            //11. Resume Dat
                                            const resumeDatData: AODat_ResumeSingle_Data = {
                                                key: newDatKey
                                            }
                                            context.router.send('/dat/resumeSingle',resumeDatData).then(() => {

                                                // TODO: Figure out the actual return.
                                                resolve(clonedContent)

                                            }).catch(reject) // Start sharing the dat

                                        }).catch(reject) // Move Dat Dir

                                    }).catch(reject) // Dat Creation

                                }).catch(reject) // Content State update to Encrypted

                            }).catch(reject) // Reencryption/copy

                        }).catch(reject) // MakeDir for new dat

                    }).catch(reject) // Content State updated to Verified (or not!)

                }).catch(reject) // Decrypt and Checksum

            }).catch(reject) // Update to Decryption key received
            
        }).catch(reject) // Initial get of user content
    })
}