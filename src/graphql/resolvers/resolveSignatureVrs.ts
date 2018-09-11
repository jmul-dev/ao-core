import { IGraphqlResolverContext } from '../../http';
import * as AOCrypto from '../../AOCrypto';


/**
 * Converting a signature into { v, r, s } object
 */
export default (obj: string, args: any, context: IGraphqlResolverContext, info: any) => {
    return AOCrypto.vrsFromSignature( obj )
}