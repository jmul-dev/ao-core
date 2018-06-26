'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var process_schema = {
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
};
exports.default = process_schema;
//# sourceMappingURL=process_schema.js.map