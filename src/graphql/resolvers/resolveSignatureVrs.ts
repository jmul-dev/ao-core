import { IGraphqlResolverContext } from '../../http';
import EthCrypto from 'eth-crypto';


/**
 * Converting a signature into { v, r, s } object
 */
export default (obj: string, args: any, context: IGraphqlResolverContext, info: any) => {
    return EthCrypto.vrs.fromString( obj )
}