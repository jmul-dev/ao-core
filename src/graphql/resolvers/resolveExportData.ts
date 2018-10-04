import { IGraphqlResolverContext } from "../../http";
import { IAOFS_DataExport_Data } from "../../modules/fs/fs";
import Debug from 'debug';
import { AODB_SettingsUpdate_Data } from "../../modules/db/db";
import { IAORouterMessage } from "../../router/AORouter";
const debug = Debug('ao:graphQL:exportData')

export interface IContentExport_Args {
    inputs: {
        exportPath: string
    }
}

export default (obj: any, args: IContentExport_Args, context: IGraphqlResolverContext, info: any) => {
    return new Promise((resolve, reject) => {
        let pathToExport = args.inputs ? args.inputs.exportPath : undefined
        if (!pathToExport) {
            pathToExport = context.options.desktopLocation
        }
        if ( !pathToExport ) {
            return reject(new Error(`Expected a path for the zipped export, received undefined`))
        }
        // 1. Start the zipping process
        const dataExportData: IAOFS_DataExport_Data = { outputPath: pathToExport }
        context.router.send('/fs/dataExport', dataExportData).then((message: IAORouterMessage) => {
            if (message.data.exportPath) {
                // 4. Mark last export location in settings
                const storeExportInDB: AODB_SettingsUpdate_Data = {
                    exportPath: message.data.exportPath
                }
                context.router.send('/db/settings/update', storeExportInDB).then(() => {
                    debug('Export path is: ' + message.data.exportPath)
                    resolve(message.data.exportPath)
                }).catch(debug)
            } else {
                debug('No Export Path returned from dataExport')
                reject(new Error('No Export Path returned from dataExport'))
            }
        }).catch((err) => {
            debug(err)
            reject(err)
        })
    })
}