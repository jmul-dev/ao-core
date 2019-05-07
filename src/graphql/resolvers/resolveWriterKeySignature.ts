import { IGraphqlResolverContext } from "../../http";
import { AOP2P_TaoRequest_Data } from "../../modules/p2p/p2p";
import { IAORouterMessage } from "../../router/AORouter";
import EthCrypto from "eth-crypto";

interface IWriterKeySignature_Args {
    nameId: string;
    nonce: string;
}

export default (
    obj: any,
    args: IWriterKeySignature_Args,
    context: IGraphqlResolverContext,
    info: any
) => {
    return new Promise((resolve, reject) => {
        const taoRequestArgs: AOP2P_TaoRequest_Data = {
            method: "getWriterKeySignature",
            methodArgs: {
                nameId: args.nameId,
                nonce: args.nonce
            }
        };
        context.router
            .send("/p2p/tao", taoRequestArgs)
            .then((response: IAORouterMessage) => {
                resolve(EthCrypto.vrs.fromString(response.data));
            })
            .catch(reject);
    });
};
