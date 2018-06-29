'use strict';
const registry_schema:Object = {
    "id": "/RegistryObject",
    "type": "object",
    "required": [
        "priority",
        "name",
        "type",
        "file"
    ],
    "properties": {
        "priority": {
            "type": "number"
        },
        "status": {
            "type": "boolean"
        },
        "name": {
            "type": "string"
        },
        "type": {
            "type": "string"
        },
        "file": {
            "type": "string"
        },
        "process": {
            "type": "object"
        }
    }
}

const process_schema:Object = {
    "id": "/ProcessObject",
    "type": "object",
    "required": [
        "registry_name",
        "process"
    ],
    "properties": {
        "registry_name": {
            "type": "string"
        },
        "process": {
            "type": "object"
        }
    }
}

const message_schema:Object = {
    "id": "/MessageObject",
    "type": "object",
    "required": [
        "app_id",
        "event",
        "type_id",
        "data",
        "encoding"
    ],
    "properties": {
        "app_id": {
            "type": "string"
        },
        "event": {
            "type": "string"
        },
        "type_id": {
            "type": "string"
        },
        "message_type": {
            "type": "object"
        },
        "signatures": {
            "type": "object"
        },
        "data": {
            "type": "object"
        },
        "encoding": {
            "type": "string"
        }
    }
}


export {
    registry_schema, 
    process_schema,
    message_schema
}

