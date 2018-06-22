'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsonschema_1 = require("jsonschema");
var debug_1 = __importDefault(require("debug"));
var debug = debug_1.default('ao:core');
var error = debug_1.default('ao:core:error');
/**
 * Message creation class with basic data validation
 */
var Message = /** @class */ (function () {
    function Message(initializer) {
        var _this = this;
        this.message_schema = {
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
        };
        // return if no initializer is passed in 
        if (initializer === undefined) {
            return;
        }
        // apply 
        Object.keys(initializer).forEach(function (key, index) {
            _this[key] = initializer[key];
        });
    }
    Message.prototype.validate = function (message) {
        var result = jsonschema_1.validate(message, this.message_schema);
        if (result.valid) {
            return true;
        }
        else {
            error('Message failed validation');
        }
        return;
    };
    Object.defineProperty(Message.prototype, "app_id", {
        //Head Getters/Setters
        get: function () { return this.app_id; },
        set: function (val) { this.app_id = val; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Message.prototype, "type_id", {
        get: function () { return this.type_id; },
        set: function (val) { this.type_id = val; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Message.prototype, "message_type", {
        get: function () { return this.message_type; },
        set: function (val) { this.message_type = val; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Message.prototype, "signatures", {
        get: function () { return this.signatures; },
        set: function (val) { this.signatures = val; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Message.prototype, "data", {
        //Message body
        get: function () { return this.data; },
        set: function (val) { this.data = val; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Message.prototype, "encoding", {
        get: function () { return this.encoding; },
        set: function (val) { this.encoding = val; },
        enumerable: true,
        configurable: true
    });
    Message.prototype.toJSON = function () {
        var message = {
            app_id: this.app_id,
            type_id: this.type_id,
            message_type: this.message_type,
            signatures: this.signatures,
            data: this.data,
            encoding: this.encoding
        };
        this.validate(message);
        return message;
    };
    return Message;
}());
exports.default = Message;
//# sourceMappingURL=message.js.map