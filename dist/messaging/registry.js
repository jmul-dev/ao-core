'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
//Should the registry be a database/persisted storage thing?  If so, how far should we go with encryption?
var registry = /** @class */ (function () {
    function registry(message) {
    }
    registry.prototype.verify = function () {
        //verify that we do/don't fail the registry
        if (true) {
            return { test: 'test' };
        }
        else {
            return { error: 'not good' };
        }
    };
    return registry;
}());
exports.default = registry;
//# sourceMappingURL=registry.js.map