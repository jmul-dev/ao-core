import Debug from 'debug'
import { IGraphqlResolverContext } from '../../http';
import { IAORouterMessage } from "../../router/AORouter";
import { AODB_NetworkContentGet_Data } from '../../modules/db/db';
import AOContent, { AOContentState } from '../../models/AOContent';
import { AOP2P_Get_File_Node_Data } from '../../modules/p2p/p2p';
import { AODat_Encrypted_Download_Data } from '../../modules/dat/dat';
const debug = Debug('ao:graphql:contentRequest')
interface IContentRequest_Args {
    id: string
}

export default (obj: any, args: IContentRequest_Args, context: IGraphqlResolverContext, info: any) => {
    return new Promise((resolve, reject) => {
        // 1. Pull the Content from network content db
        let networkContentQuery: AODB_NetworkContentGet_Data = {
            query: { id: args.id }
        }
        // TODO: We need to add a new p2p/db network that handles encrypted content discovery.  This should be separate from preview content dats
        context.router.send('/db/network/content/get', networkContentQuery).then((response: IAORouterMessage) => {
            if (!response.data || response.data.length !== 1) {
                reject(new Error(`No discovered content with id: ${args.id}`))
                return;
            }
            // 2. Modify the content to account for it entering user database
            let clonedContent: AOContent = AOContent.fromObject({
                ...response.data[0],
                nodeId: context.userSession.id,  // AORouter attaches current user address
                state: AOContentState.DOWNLOADING,
            })

            // 3. Grab the key nodes/ethaddress
            const findEncryptedNodeData:AOP2P_Get_File_Node_Data = {content: clonedContent.toMetadataJson()}
            context.router.send('/p2p/findEncryptedNode',findEncryptedNodeData).then((fileNodesResponse:IAORouterMessage) => {
                const resultNodes = fileNodesResponse.data
                const nodes:{[key:string]: string;} = {}
                resultNodes.map( (a) => {
                    let datKey = a.splitKey[1]
                    nodes[datKey] = a.value.contentHostId //<-- datkey to contentHostId
                })
                
                // 4. Trigger encrypted file dat download
                const encryptedDownloadData:AODat_Encrypted_Download_Data = { nodes }
                context.router.send('/dat/encryptedFileDownload', encryptedDownloadData ).then((downloadResponse: IAORouterMessage) => {
                    if (downloadResponse.data.datEntry.complete) {
                        clonedContent.state = 'DOWNLOADED'
                        clonedContent.contentHostId = downloadResponse.data.contentHostId
                    }
                    // 5. Insert the content into user's content DB
                    context.router.send('/db/user/content/insert', clonedContent.toRawJson()).then((insertResponse: IAORouterMessage) => {
                        resolve(insertResponse.data)
                    }).catch(reject)
                }).catch(error => {
                    debug('Error downloading dat://' + clonedContent.fileDatKey, error)
                    // FAIL: The dat download failed. This is possibly due to no-one hosting the dat file
                    reject(new Error(`Unable to reach the content dat file`))
                })
            }).catch(error => {
                reject(error)
            })
        }).catch(reject)
    })
}