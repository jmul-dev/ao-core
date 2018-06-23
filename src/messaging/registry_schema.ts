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

export default registry_schema