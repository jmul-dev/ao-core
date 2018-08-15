import { AOCoreProcessRouter } from "../../router/AORouterInterface";
import { IAORouterMessage } from "../../router/AORouter";
import Http, { Http_Args } from '../../modules/http/http';


export default function (aoRouter: AOCoreProcessRouter, options: Http_Args) {
    return (obj: any, args: any, context: any, info: any) => {
        return new Promise((resolve, reject) => {
            aoRouter.send('/db/user/get').then((response: IAORouterMessage) => {
                let localNode = {
                    id: response.data.ethAddress,
                    ethAddress: response.data.ethAddress,
                    creator: {
                        content: []
                    }
                }
                aoRouter.send('/db/user/content/get').then((response: IAORouterMessage) => {
                    let responseData = [].concat(response.data);  // ensures array in case response is single item
                    responseData = responseData.map(content => ({
                        ...content,
                        fileUrl: `${Http.ENCRYPTED_RESOURCES_ENDPOINT}/${content.fileUrl}`,
                        teaserUrl: `${Http.RESOURCES_ENDPOINT}/${content.teaserUrl}`,
                        featuredImageUrl: `${Http.RESOURCES_ENDPOINT}/${content.featuredImageUrl}`,
                    }))
                    localNode.creator.content = responseData
                    resolve(localNode)
                }).catch(error => {
                    reject(error)
                })
            }).catch(reject)
        })
    }
}