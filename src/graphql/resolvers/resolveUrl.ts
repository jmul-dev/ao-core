import Http, { IGraphqlResolverContext } from '../../http';


export default (obj: any, args: any, context: IGraphqlResolverContext, info: any) => {
    switch (info.fieldName) {
        case 'teaserUrl':
            return `${Http.RESOURCES_ENDPOINT}/${obj.metadataDatKey}/${obj.teaserUrl}`
        case 'featuredImageUrl':
            return `${Http.RESOURCES_ENDPOINT}/${obj.metadataDatKey}/${obj.featuredImageUrl}`
        case 'fileUrl':
            return `${Http.ENCRYPTED_RESOURCES_ENDPOINT}/${obj.fileDatKey}/${obj.fileUrl}`
        default:
            console.warn(`Attempting to resolve field[${info.fieldName}] but unkown url resolver`)
            return obj[info.fieldName]
    }    
}