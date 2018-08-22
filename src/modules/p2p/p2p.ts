
import AORouterInterface, { IAORouterRequest, AORouterArgs } from "../../router/AORouterInterface";
import { AO_Hyper_Options } from "../../router/AOHyperDB";
import path from 'path'
import Debug from 'debug';
const debug = Debug('ao:p2p');

export interface AOP2P_Args {
    storageLocation: string;
}


export interface AOP2P_New_Content_Data {
    contentType: string;
    datKey: string;
    ethAddress: string;
    metaData: Object;
    indexData: Object;//TODO: Define this better
    signature: string;
}


export interface AOP2P_Watch_Key_Data {
    key: string;
}

export interface AOP2P_Add_Discovery_Data {
    contentType: string;
    datKey: string;
    ethAddress: string;
    metaData: Object;
    indexData: Object;//TODO: Define this better
}

//This is out here since 
const routerArgs:AORouterArgs = {
    enableHyperDB: true
}

export default class AOP2P extends AORouterInterface {
    private dbPath:string
    private dbKey: string = 'e621d41a7fa1649583b70a47423115001476ebc7dd63fd6ba503145e8daea6f3'//TODO: Set the production static dbKey
    private dbPrefix: string
    
    private storageLocation: string

    constructor(args: AOP2P_Args) {
        super(routerArgs)
        this.storageLocation = args.storageLocation
        this.dbPath = path.join(this.storageLocation, 'p2p')
        this.dbPrefix = '/AOSpace/' //Also known as App ID

        //Routes
        this.router.on('/p2p/init', this._handleInit.bind(this) )
        //New Content upload
        this.router.on('/p2p/newContent', this._handleNewContent.bind(this) )
        //Watch for New Key
        this.router.on('/p2p/watchKey', this._handleWatchKey.bind(this))
        //Add content into Discovery
        this.router.on('/p2p/addDiscovery', this._handleAddDiscovery.bind(this))

        debug('started')
    }

    private _handleInit(request: IAORouterRequest) {
        //TODO: Should this be a file or just a key assigned per module?
        const hyperDBOptions: AO_Hyper_Options = {
            dbKey: this.dbKey,
            dbPath: this.dbPath
        }
        this.hyperdb.init(hyperDBOptions).then(() => {
            request.respond({})
        }).catch( e => {
            request.reject(e)
        })
    }

    private _handleNewContent(request:IAORouterRequest) {
        const requestData: AOP2P_New_Content_Data = request.data
        let allInserts = []

        //Content Signature/Meta Data
        const contentRegistrationKey = this.dbPrefix + requestData.contentType + '/' + requestData.ethAddress + '/' + requestData.datKey
        allInserts.push( this.hyperdb.insert(contentRegistrationKey + '/signature', requestData.signature) )
        allInserts.push( this.hyperdb.insert(contentRegistrationKey + '/metaData', requestData.metaData) )

        //IndexData
        const registrationData = requestData.ethAddress + '/' + requestData.datKey + '/indexData'
        const selfRegistrationPrefix = requestData.ethAddress + '/' + this.dbPrefix + '/' + requestData.contentType + '/nodes/'
        const appRegistrationPrefix = this.dbPrefix + '/' + requestData.contentType + '/' + requestData.datKey + '/nodes/'
        allInserts.push( this.hyperdb.insert(selfRegistrationPrefix + registrationData, requestData.indexData) )
        allInserts.push( this.hyperdb.insert(appRegistrationPrefix + registrationData, requestData.indexData) )

        //On/Off/Signatures
        allInserts.push( this.hyperdb.insert(selfRegistrationPrefix + registrationData + '/on/signature', requestData.signature) )
        allInserts.push( this.hyperdb.insert(appRegistrationPrefix + registrationData + '/on/signature', requestData.signature) )

        Promise.all(allInserts).then(() => {
            request.respond({})
        }).catch((e) => {
            request.reject(e)
        })
    }

    private _handleWatchKey(request:IAORouterRequest) {
        const requestData: AOP2P_Watch_Key_Data = request.data
        //TODO: We might consider helping construct the specific key here.  Dunno what exactly we're looking for yet 100%
        this.hyperdb.watch(requestData.key)
        .then(() => {
            request.respond({})
        }).catch( e => {
            request.reject(e)
        })
    }    

    private _handleAddDiscovery(request:IAORouterRequest) {
        const requestData: AOP2P_Add_Discovery_Data = request.data
        const appRegistrationPrefix = this.dbPrefix + '/' + requestData.contentType + '/' + requestData.datKey + '/nodes/'
        const registrationData = requestData.ethAddress  + '/' + requestData.datKey + '/indexData'
        this.hyperdb.insert(appRegistrationPrefix + registrationData, requestData.indexData)
        .then(() => {
            request.respond({})
        })
        .catch(e => {
            request.reject(e)
        })
    }


} 