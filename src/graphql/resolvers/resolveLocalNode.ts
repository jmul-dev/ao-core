import { AOCoreProcessRouter } from "../../router/AORouterInterface";


export default function(aoRouter: AOCoreProcessRouter) {
    return (obj: any, args: any, context: any, info: any) => {
        return new Promise((resolve, reject) => {
            aoRouter.send('/db/user/get').then(({ethAddress}) => {
                let localNode = {
                    id: ethAddress,
                    ethAddress,
                    content: []
                }
                aoRouter.send('/db/user/content/get', {}).then((content) => {
                    console.log(content)
                    localNode.content = content
                    resolve(localNode)
                }).catch(reject)
            }).catch(reject)            
        })
    }    
}