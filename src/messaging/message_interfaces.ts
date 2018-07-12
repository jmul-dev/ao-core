
export interface ProcessObject {
    in_use: boolean,
    process: any,
    instance_id: string
}

export interface RegistryObject {
    priority: number,
    status: boolean,
    multi_instance: boolean,
    name: string,
    type: string,
    file: string,
    instances: Array<ProcessObject>
}

export interface MessageObject {
    app_id: string,
    type_id: string,
    instance_id: string,
    event:string,
    from:string,
    message_type:Object,
    signatures:Object,
    data:any,
    encoding:string
}