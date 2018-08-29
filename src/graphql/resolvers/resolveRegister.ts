import { IGraphqlResolverContext } from '../../http';
import { IAOFS_Mkdir_Data } from '../../modules/fs/fs';
import path from 'path';
import resolveSetNetwork from './resolveSetNetwork';

interface IRegister_Args {
    inputs: {
        ethAddress: string;
        networkId: number;
    }
}

export default (obj: any, args: IRegister_Args, context: IGraphqlResolverContext, info: any) => {
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
                resolveSetNetwork(obj, args, context, info).then((ethNetworkConnected: boolean) => {
                    console.log(`ethNetworkConnected: ${ethNetworkConnected}`)
                    if ( !ethNetworkConnected ) {
                        reject(new Error(`Unable to connect to ethereum network`))
                    } else {
                        resolve({
                            id: args.inputs.ethAddress,
                            ethAddress: args.inputs.ethAddress,
                        })
                    }
                }).catch(reject)                  
            }).catch(reject)
        }).catch(reject)
    })
}