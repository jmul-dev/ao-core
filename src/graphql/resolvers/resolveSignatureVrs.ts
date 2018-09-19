import { IGraphqlResolverContext } from '../../http';
import * as AOCrypto from '../../AOCrypto';
import Debug from 'debug'
//const debug = Debug('ao:signatureVRS')

/**
 * Converting a signature into { v, r, s } object
 */
export default (obj: string, args: any, context: IGraphqlResolverContext, info: any) => {
    return AOCrypto.vrsFromSignature( obj[info.fieldName] )
}