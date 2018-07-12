'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var validation_schemas_1 = require("./validation_schemas");
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
        this.message_schema = validation_schemas_1.message_schema;
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
            return;
        }
        error('Message failed validation');
    };
    Object.defineProperty(Message.prototype, "app_id", {
        get: function () { return this._app_id; },
        set: function (val) { this._app_id = val; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Message.prototype, "type_id", {
        get: function () { return this._type_id; },
        set: function (val) { this._type_id = val; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Message.prototype, "instance_id", {
        get: function () { return this._instance_id; },
        set: function (val) { this._instance_id = val; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Message.prototype, "event", {
        get: function () { return this._event; },
        set: function (val) { this._event = val; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Message.prototype, "from", {
        get: function () { return this._from; },
        set: function (val) { this._from = val; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Message.prototype, "message_type", {
        get: function () { return this._message_type; },
        set: function (val) { this._message_type = val; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Message.prototype, "signatures", {
        get: function () { return this._signatures; },
        set: function (val) { this._signatures = val; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Message.prototype, "data", {
        get: function () { return this._data; },
        set: function (val) { this._data = val; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Message.prototype, "encoding", {
        get: function () { return this._encoding; },
        set: function (val) { this._encoding = val; },
        enumerable: true,
        configurable: true
    });
    Message.prototype.toJSON = function () {
        var message = {
            app_id: this._app_id,
            type_id: this._type_id,
            instance_id: this._instance_id,
            event: this._event,
            from: this._from,
            message_type: this._message_type,
            signatures: this._signatures,
            data: this._data,
            encoding: this._encoding
        };
        this.validate(message); //incase someone used getters and setters instead.
        return message;
    };
    return Message;
}());
exports.default = Message;
//# sourceMappingURL=message.js.map