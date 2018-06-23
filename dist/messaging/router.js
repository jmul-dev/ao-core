'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var registry_1 = __importDefault(require("./registry"));
var debug_1 = __importDefault(require("debug"));
var debug = debug_1.default('ao:core');
var error = debug_1.default('ao:core:error');
var Router = /** @class */ (function () {
    function Router(message) {
        var _this = this;
        this.registry = new registry_1.default();
        //data validation
        this.registry.loadRegistry()
            .then(function () {
            _this.validate(message);
        })
            .then(this.registryCheck.bind(this)) //registration check
            .catch(function (err) {
            error(err);
        });
    }
    Router.prototype.validate = function (message) {
        return new Promise(function (resolve, reject) {
            //basic data validation
            resolve(message);
        });
    };
    Router.prototype.registryCheck = function (message) {
        return new Promise(function (resolve, reject) {
            var registry = new registry_1.default();
            var verification = registry.verify();
            if (verification.error) {
                reject('failed regsitry verification');
            }
            resolve(message);
        });
    };
    return Router;
}());
exports.default = Router;
//# sourceMappingURL=router.js.map