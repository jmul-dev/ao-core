'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var message_schema = {
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
};
exports.default = message_schema;
//# sourceMappingURL=message_schema.js.map