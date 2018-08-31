import { IGraphqlResolverContext } from '../../http';
import { IAOFS_Mkdir_Data, IAOFS_PathExists_Data } from '../../modules/fs/fs';
import path from 'path';
import resolveSetNetwork from './resolveSetNetwork';
import { IAORouterMessage } from '../../router/AORouter';

interface IRegister_Args {
    inputs: {
        ethAddress: string;
        networkId: number;
    }
}

export default (obj: any, args: IRegister_Args, context: IGraphqlResolverContext, info: any) => {
    return new Promise((resolve, reject) => {
        //Is this like the first time this dude is coming here?
        const checkPathData:IAOFS_PathExists_Data = { path: path.join('data','users',args.inputs.ethAddress)}
        context.router.send('/fs/exists',checkPathData).then((existsData:IAORouterMessage)=> {
            context.router.send('/db/user/init', {ethAddress: args.inputs.ethAddress}).then(() => {
                //Mkdir is to ensure that data folders exist.
                const fsMakeContentDirData: IAOFS_Mkdir_Data = {
                    dirPath: 'content'
                }
                const fsMakeEthDirData: IAOFS_Mkdir_Data = {
                    dirPath: path.join('users', args.inputs.ethAddress)
                }
                let mkdirPromises: Array<Promise<any>> = [
                    context.router.send('/fs/mkdir', fsMakeContentDirData),
                    context.router.send('/fs/mkdir', fsMakeEthDirData)
                ]


                Promise.all(mkdirPromises).then(() => {                                
                    context.router.send('/core/log', {message: `[AO Core] Registered as user ${args.inputs.ethAddress}`})

                    resolveSetNetwork(obj, args, context, info).then((ethNetworkConnected: boolean) => {
                        if ( !ethNetworkConnected ) {
                            reject(new Error(`Unable to connect to ethereum network`))
                        } else {
                            resolve({
                                id: args.inputs.ethAddress,
                                ethAddress: args.inputs.ethAddress,
                            })
                        }
                    }).catch(reject)
                    
                    //User folder did not exist at the start so make the private/public key combo here.
                    if( !existsData.data.exists ) {
                        
                    }

                }).catch(reject) //End of Promise.all
            }).catch(reject)//End if db init
        }).catch(reject)//First time checker
    })
}