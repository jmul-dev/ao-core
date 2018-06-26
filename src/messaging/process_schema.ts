'use strict';
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

export default process_schema