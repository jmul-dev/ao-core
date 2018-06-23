'use strict';
const process_schema:Object = {
    "id": "/ProcessObject",
    "type": "object",
    "required": [
        "name",
        "process"
    ],
    "properties": {
        "name": {
            "type": "string"
        },
        "process": {
            "type": "object"
        }
    }
}

export default process_schema