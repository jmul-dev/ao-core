import { IGraphqlResolverContext } from "../../http";
import { IAORouterMessage } from "../../router/AORouter";
import AOContent from "../../models/AOContent";
import { AODat_GetDatStats_Data } from "../../modules/dat/dat";
import { DatStats } from "dat-manager";
import { AOP2P_ContentTaodbValues_Data } from "../../modules/p2p/p2p";

export type ContentTaodbKeyValues = Array<{
    key: string;
    value?: any;
    schema: string;
    label: string;
}>;

export default (
    obj: AOContent,
    args: any,
    context: IGraphqlResolverContext,
    info: any
) => {
    return new Promise((resolve, reject) => {
        const contentArg: AOP2P_ContentTaodbValues_Data = {
            content: obj
        };
        context.router
            .send("/p2p/content/taodbKeyValues", contentArg)
            .then((response: IAORouterMessage) => {
                let entries: ContentTaodbKeyValues = response.data;
                entries = entries.map(entry => {
                    if (typeof entry.value === "object") {
                        entry.value = JSON.stringify(entry.value);
                    }
                    return entry;
                });
                if (!entries) return resolve([]);
                resolve(entries);
            })
            .catch(err => {
                // debug(`[${datKey}] failed to get stats: ${err.message}`);
                // In case the dat does not exist yet for whatever reason
                resolve([]);
            });
    });
};
