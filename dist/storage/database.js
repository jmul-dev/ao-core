"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var sequelize_1 = __importStar(require("sequelize"));
var debug_1 = __importDefault(require("debug"));
var debug = debug_1.default('ao:db');
var Database = /** @class */ (function () {
    function Database() {
        this.memoryDB = new sequelize_1.default('sqlite::memory:', {
        // logging: false
        });
        this.persistedDB = null;
        // Model definitions
        this.Video = this.memoryDB.define('video', {
            title: sequelize_1.STRING
        });
        this.Peer = this.memoryDB.define('peer', {
            id: {
                type: sequelize_1.STRING,
                primaryKey: true,
            }
        });
        this.Log = this.memoryDB.define('log', {
            createdAt: { type: sequelize_1.DATE, defaultValue: sequelize_1.NOW },
            message: sequelize_1.STRING
        });
    }
    Database.prototype.init = function () {
        return this.memoryDB.sync({ force: true }); // syncs all models (create tables)
    };
    Database.prototype.close = function () {
        return this.memoryDB.close();
    };
    return Database;
}());
exports.default = Database;
//# sourceMappingURL=database.js.map