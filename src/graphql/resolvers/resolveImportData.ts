import { IGraphqlResolverContext } from "../../http";
import { IAOFS_DataImport_Data } from "../../modules/fs/fs";
import Debug from 'debug'
import { IAORouterMessage } from "../../router/AORouter";
const debug = Debug('ao:graphQL:importData')

export interface IContentImport_Args {
    inputs: {
        importPath: string
        commandLine?: boolean
    }
}

export default (obj:any, args: IContentImport_Args, context: IGraphqlResolverContext, info:any ) => {
    return new Promise((resolve,reject) => {
        const {commandLine, importPath} = args.inputs
        // 0. Resolve right away if not command line
        if(!commandLine) {
            resolve()
        }
        // 1. Start the import process
        const dataImportData: IAOFS_DataImport_Data = { inputPath: importPath }
        
        context.router.send('/fs/dataImport', dataImportData).then((message:IAORouterMessage) => {
            debug('Everything has been imported from the zip file')
            if(commandLine) {
                resolve()
            }   
        }).catch((err) => {
            debug(err)
            if(commandLine) {
                reject(err)
            }
            
        })
    })
 }