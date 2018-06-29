'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var registry_schema = {
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
};
exports.default = registry_schema;
//# sourceMappingURL=registry_schema.js.map