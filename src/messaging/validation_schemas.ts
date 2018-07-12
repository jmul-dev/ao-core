'use strict';
const registry_schema:Object = {
    "id": "/RegistryObject",
    "type": "object",
    "required": [
        "priority",
        "multi_instance",
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
        "multi_instance": {
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
        "instances": {
            "type": "array"
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
        "type_id",
        "event",
        "from",
        "data",
        "encoding"
    ],
    "properties": {
        "app_id": {
            "type": "string"
        },
        "type_id": {
            "type": "string"
        },
        "instance_id": {
            "type": "string"
        },
        "event": {
            "type": "string"
        },
        "from": {
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

