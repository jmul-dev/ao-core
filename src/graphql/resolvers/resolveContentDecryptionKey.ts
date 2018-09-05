import Debug from 'debug';
import md5 from 'md5';
import path from 'path';
import EthCrypto from 'eth-crypto'
import { IGraphqlResolverContext } from '../../http';
import { AOContentState } from '../../models/AOContent';
import { AODat_Create_Data, AODat_ResumeSingle_Data } from '../../modules/dat/dat';
import { AODB_UserContentUpdate_Data } from '../../modules/db/db';
import { IAOFS_DecryptCheck_Data, IAOFS_Mkdir_Data, IAOFS_Move_Data, IAOFS_Reencrypt_Data, IAOFS_Unlink_Data } from '../../modules/fs/fs';
import { IAORouterMessage } from "../../router/AORouter";
const debug = Debug('ao:graphql:resolveContentDecryptionKey');


export interface IContentDecryptionKey_Args {
    contentId: string
    decryptionKey: string
}

export default (obj: any, args: IContentDecryptionKey_Args, context: IGraphqlResolverContext, info: any) => {
    return new Promise((resolve, reject) => {
        const { contentId, decryptionKey } = args
        // 1. Update the content state to reflect that we have decrypted the encrypted decryption key
        let contentUpdateQuery: AODB_UserContentUpdate_Data = {
            id: contentId,
            update: {
                $set: {
                    "state": "DECRYPTION_KEY_DECRYPTED"
                }
            }
        }
        context.router.send('/db/user/content/update', contentUpdateQuery).then((contentUpdateResponse: IAORouterMessage) => {
            if (!contentUpdateResponse.data || contentUpdateResponse.data.length !== 1) {
                reject(new Error(`No discovered content with id: ${contentId}`))
                return;
            }
            const content = contentUpdateResponse.data
            // 2. Resolve the updated content
            resolve(contentUpdateResponse.data)

            // 3. Decrypt/ffprobe/Checksum the downloaded file and match against the content data.
            const encryptedVideoPath = path.join('content', content.fileDatKey, content.fileName)
            const decryptChecksumData: IAOFS_DecryptCheck_Data = {
                path: encryptedVideoPath,
                decryptionKey: decryptionKey
            }
            context.router.send('/fs/decryptChecksum', decryptChecksumData).then((decryptChecksumResponse: IAORouterMessage) => {
                let checksum = decryptChecksumResponse.data[0].checksum
                // 4. Check that the decrypted file's checksum actually matches the original content checksum
                if (checksum != content.fileChecksum) {
                    content.state = AOContentState.VERIFICATION_FAILED
                } else {
                    content.state = AOContentState.VERIFIED
                }
                // 5. Update the content with verification state
                let contentUpdateQuery: AODB_UserContentUpdate_Data = {
                    id: contentId,
                    update: {
                        $set: {
                            "state": content.state
                        }
                    }
                }
                context.router.send('/db/user/content/update', contentUpdateQuery).then((contentVerifiedResponse: IAORouterMessage) => {
                    if (content.state === AOContentState.VERIFICATION_FAILED) {
                        // TODO: Let the rest of the network know that there is a bad actor on the network
                        debug(new Error('Checksums do not match.  We have a problem'))
                        return;
                    }

                    // 6. New directory for data to be re-encrypted
                    const newDatDirData: IAOFS_Mkdir_Data = {
                        dirPath: md5(new Date())
                    }
                    context.router.send('/fs/mkdir', newDatDirData).then(() => {

                        // 7. Reencrypt original encrypted file into the new dir
                        const fileReencrypt: IAOFS_Reencrypt_Data = {
                            originalPath: encryptedVideoPath,
                            decryptionKey: decryptionKey,
                            finalPath: path.join('content', newDatDirData.dirPath, content.fileName)
                        }
                        context.router.send('/fs/reencrypt', fileReencrypt).then((reencryptionResponse: IAORouterMessage) => {
                            let newDecryptionKey = reencryptionResponse.data.newKey
                            //Below is used later for encChallenge
                            let newEncryptedChecksum = reencryptionResponse.data.encryptedChecksum
                            if (!newDecryptionKey) {
                                const error = new Error('No new decryption key')
                                debug(error)
                                const dirCleanupData: IAOFS_Unlink_Data = {
                                    removePath: newDatDirData.dirPath
                                }
                                context.router.send('/fs/unlink', dirCleanupData).then(() => {
                                    debug('Reencryption folder cleaned up.')
                                }).catch(e => {
                                    debug('Reencryption folder could not be cleaned up.')
                                })
                                return reject(error)
                            }

                            // 8. Update Content State to Encrypted
                            content.state = AOContentState.ENCRYPTED
                            let contentUpdateQuery: AODB_UserContentUpdate_Data = {
                                id: contentId,
                                update: {
                                    $set: {
                                        "state": content.state,
                                        "decryptionKey": newDecryptionKey
                                    }
                                }
                            }
                            context.router.send('/db/user/content/update', contentUpdateQuery).then(() => {

                                // 9. Make Dat
                                const tempDatDir = path.join('content', newDatDirData.dirPath)
                                const createDatData: AODat_Create_Data = {
                                    newDatDir: tempDatDir
                                }
                                context.router.send('/dat/create', createDatData).then((datCreateResponse: IAORouterMessage) => {
                                    let newDatKey = datCreateResponse.data.key

                                    // 10. Move Dat to its actual key name
                                    const moveNewDatData: IAOFS_Move_Data = {
                                        srcPath: tempDatDir,
                                        destPath: path.join('content', newDatKey)
                                    }
                                    context.router.send('/fs/move', moveNewDatData).then(() => {

                                        // 11. Resume Dat
                                        const resumeDatData: AODat_ResumeSingle_Data = {
                                            key: newDatKey
                                        }
                                        context.router.send('/dat/resumeSingle', resumeDatData).then(() => {

                                            // 12. Store the newDatKey
                                            content.state = AOContentState.ENCRYPTED
                                            content.fileDatKey = newDatKey
                                            let contentUpdateQuery: AODB_UserContentUpdate_Data = {
                                                id: contentId,
                                                update: {
                                                    $set: {
                                                        "state": content.state,
                                                        "fileDatKey": content.fileDatKey,
                                                        // Note, baseChallenge is not updated since that's just the file checksum which is verified earlier.  If that fails, we have a bad actor on the network/corrupted file
                                                        "encChallenge": EthCrypto.hash.keccak256(newEncryptedChecksum)
                                                    }
                                                }
                                            }
                                            context.router.send('/db/user/content/update', contentUpdateQuery).then(() => {
                                                // Done!
                                            }).catch(debug)

                                        }).catch(debug) // Start sharing the dat

                                    }).catch(debug) // Move Dat Dir

                                }).catch((e) => {
                                    debug(e)
                                    let removePathData: IAOFS_Unlink_Data = {
                                        removePath: path.join(fileReencrypt.finalPath, '.dat')
                                    }
                                    context.router.send('/fs/unlink', removePathData)
                                        .then(() => { })
                                        .catch(debug)
                                }) // Dat Creation

                            }).catch(debug) // Content State update to Encrypted

                        }).catch((e) => {
                            debug(e)
                            let removePathData: IAOFS_Unlink_Data = {
                                removePath: fileReencrypt.finalPath
                            }
                            context.router.send('/fs/unlink', removePathData)
                                .then(() => { })
                                .catch(debug)
                        }) // Reencryption/copy

                    }).catch(debug) // MakeDir for new dat

                }).catch(debug) // Content State updated to Verified (or not!)

            }).catch(debug) // Decrypt and Checksum
            //Don't reject up from here.

        }).catch(reject) // Update to Decryption key received
    })
}