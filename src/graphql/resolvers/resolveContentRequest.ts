import { IGraphqlResolverContext } from '../../http';
import { IAORouterMessage } from "../../router/AORouter";
import { AODB_NetworkContentGet_Data } from '../../modules/db/db';

interface IContentRequest_Args {
    id: string
}

export default (obj: any, args: IContentRequest_Args, context: IGraphqlResolverContext, info: any) => {
    return new Promise((resolve, reject) => {
        // 1. Pull the Content from network content db
        let networkContentQuery: AODB_NetworkContentGet_Data = {
            query: { id: args.id }
        }
        context.router.send('/db/network/content/get', networkContentQuery).then((response: IAORouterMessage) => {
            if ( !response.data || response.data.length !== 1 ) {
                reject(new Error(`No discovered content with id: ${args.id}`))
                return;
            }
            // 2. Modify the content to account for it entering user database
            let clonedContent = {
                ...response.data[0],
                nodeId: response.ethAddress,  // AORouter attaches current user address
                state: 'DOWNLOADING',
            }
            // 3. Trigger dat download (before inserting content into user db in case dat is not reachable)
            context.router.send('/dat/download', {key: clonedContent.fileDatKey}).then((downloadResponse: IAORouterMessage) => {                
                if ( downloadResponse.data.complete ) {
                    clonedContent.state = 'DOWNLOADED'
                }
                // 4. Insert the content into user's content DB
                context.router.send('/db/user/content/insert', clonedContent).then((insertResponse: IAORouterMessage) => {
                    resolve(insertResponse.data)
                }).catch(reject)
            }).catch(error => {
                console.log('Error downloading dat://' + clonedContent.fileDatKey, error)
                // FAIL: The dat download failed. This is possibly due to no-one hosting the dat file
                reject(new Error(`Unable to reach the content dat file`))                    
            })
        }).catch(reject)
    })
}