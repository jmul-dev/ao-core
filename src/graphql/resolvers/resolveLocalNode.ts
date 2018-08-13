import { AOCoreProcessRouter } from "../../router/AORouterInterface";
import { IAORouterMessage } from "../../router/AORouter";



export default function(aoRouter: AOCoreProcessRouter) {
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
                    let responseData = [].concat(response.data)// ensures array in case response is single item
                    localNode.creator.content = responseData  
                    resolve(localNode)
                }).catch(error => {
                    reject(error)
                })
            }).catch(reject)            
        })
    }    
}