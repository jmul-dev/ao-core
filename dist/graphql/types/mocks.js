"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var casual_1 = __importDefault(require("casual"));
var mocks = {
    Video: function () { return ({
        id: casual_1.default.uuid,
        title: casual_1.default.title,
        description: casual_1.default.description
    }); },
    VideoMetadata: function () { return ({
        file_type: casual_1.default.random_element(['mp4', 'mov']),
        file_size: casual_1.default.integer(0, Math.pow(2, 31) - 1) // 32 bit signed max value
    }); },
    Peer: function () { return ({
        id: casual_1.default.uuid,
    }); }
};
exports.default = mocks;
//# sourceMappingURL=mocks.js.map