import * as AOCrypto from "../../AOCrypto";
import { IGraphqlResolverContext } from "../../http";
//const debug = Debug('ao:signatureVRS')

/**
 * Converting a signature into { v, r, s } object
 */
export default (
    obj: string,
    args: any,
    context: IGraphqlResolverContext,
    info: any
) => {
    return obj[info.fieldName]
        ? AOCrypto.vrsFromSignature(obj[info.fieldName])
        : null;
};
