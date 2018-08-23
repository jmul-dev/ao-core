import { IGraphqlResolverContext } from '../../http';
import { IAOFS_Mkdir_Data } from '../../modules/fs/fs';
import path from 'path';


export default (obj: any, args: any, context: IGraphqlResolverContext, info: any) => {
    return new Promise((resolve, reject) => {
        context.router.send('/db/user/init', {ethAddress: args.inputs.ethAddress}).then(() => {
            //Mkdir is to ensure that data folders exist.
            const fsMakeContentDirData: IAOFS_Mkdir_Data = {
                dirPath: 'content'
            }
            const fsMakeEthDirData: IAOFS_Mkdir_Data = {
                dirPath: path.join('users', args.inputs.ethAddress)
            }
            const mkdirPromises: Array<Promise<any>> = [
                context.router.send('/fs/mkdir', fsMakeContentDirData),
                context.router.send('/fs/mkdir', fsMakeEthDirData)
            ]
            Promise.all(mkdirPromises).then(() => {                                
                context.router.send('/core/log', {message: `[AO Core] Registered as user ${args.inputs.ethAddress}`})
                resolve({
                    id: args.inputs.ethAddress,
                    ethAddress: args.inputs.ethAddress,
                })
            }).catch(reject)
        }).catch(reject)
    })
}