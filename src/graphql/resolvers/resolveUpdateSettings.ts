import { AODB_SettingsUpdate_Data } from "../../modules/db/db";
import { IGraphqlResolverContext } from "../../http";

export default (
    obj: any,
    args: any,
    context: IGraphqlResolverContext,
    info: any
) => {
    return new Promise((resolve, reject) => {
        const updateData: AODB_SettingsUpdate_Data = {
            ...args.inputs
        };
        context.router
            .send("/db/settings/update", updateData)
            .then(response => {
                context.router.send("/core/log", {
                    message: `User settings updated`
                });
                resolve(response.data);
            })
            .catch(reject);
    });
};
