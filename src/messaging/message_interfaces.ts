
export interface ProcessObject {
    in_use: boolean,
    process: any
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