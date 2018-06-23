'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var process_schema = {
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
};
exports.default = process_schema;
//# sourceMappingURL=process_schema.js.map