'use strict';
const message_schema:Object = {
    "id": "/MessageObject",
    "type": "object",
    "required": [
        "app_id",
        "type_id",
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

export default message_schema