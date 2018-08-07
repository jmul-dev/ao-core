import { AOCoreProcessRouter } from "../../router/AORouterInterface";
import { IAORouterMessage } from "../../router/AORouter";


export default function(aoRouter: AOCoreProcessRouter) {
    return (obj: any, args: any, context: any, info: any) => {
        return new Promise((resolve, reject) => {
            aoRouter.send('/db/user/get').then((response: IAORouterMessage) => {
                let localNode = {
                    id: response.data.ethAddress,
                    ethAddress: response.data.ethAddress,
                    content: []
                }
                aoRouter.send('/db/user/content/get', {ethAddress: response.data.ethAddress}).then((response: IAORouterMessage) => {
                    localNode.content = response.data
                    resolve(localNode)
                }).catch(reject)
            }).catch(reject)            
        })
    }    
}