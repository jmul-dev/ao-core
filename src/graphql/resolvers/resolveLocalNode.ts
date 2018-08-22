import { AOCoreProcessRouter } from "../../router/AORouterInterface";
import { IAORouterMessage } from "../../router/AORouter";
import { Http_Args } from '../../modules/http/http';


export default function (aoRouter: AOCoreProcessRouter, options: Http_Args) {
    return (obj: any, args: any, context: any, info: any) => {
        return new Promise((resolve, reject) => {
            aoRouter.send('/db/user/get').then((response: IAORouterMessage) => {
                let localNode = {
                    id: response.data.ethAddress,
                    ethAddress: response.data.ethAddress,
                }
                resolve(localNode)
            }).catch(reject)
        })
    }
}