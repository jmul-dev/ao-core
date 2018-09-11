import { IGraphqlResolverContext } from '../../http';
import { generateMockVideoList } from '../mockVideos';
import { IAORouterMessage } from '../../router/AORouter';
import { AODB_NetworkContentGet_Data } from '../../modules/db/db';
import Fuse from 'fuse.js'

interface IVideos_Args {
    query?: string;
}

export default (obj: any, args: IVideos_Args, context: IGraphqlResolverContext, info: any) => {
    return new Promise((resolve, reject) => {
        //TODO: Add query validation?
        const {query} = args
        const networkQueryData:AODB_NetworkContentGet_Data = {
            query: {
                content: {
                    $ne: null,
                    $exists: true
                }
            }
        }
        context.router.send('/db/network/content/get', networkQueryData).then((networkContentResponse:IAORouterMessage) => {
            let returnData = networkContentResponse.data.map( (a) => {
                return a.content
            })
            if(!query) {
                resolve(returnData)
            } else {
                //Fuzzy search
                const fuseOptions = {
                    shouldSort: true,
                    threshold: 0.6,
                    location: 0,
                    distance: 100,
                    maxPatternLength: 32,
                    minMatchCharLength: 1,
                    keys: [
                        "title",
                        "description"
                    ]
                }
                const fuse = new Fuse(returnData, fuseOptions)
                let results = fuse.search(query)
                resolve(results)
            }
        }).catch(reject)
    })
}