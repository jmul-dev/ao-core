
export interface ProcessObject {
    send: Function
}

export interface RegistryObject {
    priority: number,
    status: boolean,
    name: string,
    type: string,
    file: string,
    process: ProcessObject
}