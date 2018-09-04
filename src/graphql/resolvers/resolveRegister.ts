import Debug from 'debug'
import { IGraphqlResolverContext } from '../../http';
import { IAOFS_Mkdir_Data, IAOFS_PathExists_Data } from '../../modules/fs/fs';
import EthCrypto from 'eth-crypto';
import path from 'path';
import resolveSetNetwork from './resolveSetNetwork';
import { IAORouterMessage } from '../../router/AORouter';
import { AODB_UserInsert_Data } from '../../modules/db/db';
const debug = Debug('ao:graphql:register')

interface IRegister_Args {
    inputs: {
        ethAddress: string;
        networkId: number;
    }
}

export default (obj: any, args: IRegister_Args, context: IGraphqlResolverContext, info: any) => {
    return new Promise((resolve, reject) => {
        //Is this like the first time this dude is coming here?
        const checkPathData:IAOFS_PathExists_Data = { path: path.join('users',args.inputs.ethAddress)}
        context.router.send('/fs/exists', checkPathData).then((existsData:IAORouterMessage)=> {
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
                    //User folder did not exist at the start so make the private/public key combo here.

                    let setupPromises: Array<Promise<any>> = [
                        resolveSetNetwork(obj, args, context, info)
                    ]
                    if( !existsData.data.exists ) {
                        const identity = EthCrypto.createIdentity()
                        const storeIdentityData:AODB_UserInsert_Data = {
                            object: {
                                id: 'identity',
                                data: identity
                            }
                        }
                        setupPromises.push(context.router.send('/db/user/insert', storeIdentityData))
                    }

                    Promise.all(setupPromises).then((results) => {
                        let ethNetworkConnected: boolean = results[0]
                        if ( !ethNetworkConnected ) {
                            reject(new Error(`Unable to connect to ethereum network`))
                        } else {
                            resolve({
                                id: args.inputs.ethAddress,
                                ethAddress: args.inputs.ethAddress,
                            })
                        }
                    }).catch(reject)
                }).catch(reject) //End of Promise.all
            }).catch(reject)//End if db init
        }).catch(reject)//First time checker
    })
}