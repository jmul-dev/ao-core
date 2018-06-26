
export interface ProcessObject {
    send: Function
}

export interface RegistryObject {
    priority: number,
    name: string,
    type: string,
    file: string,
    process: ProcessObject
}