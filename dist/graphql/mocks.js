"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var casual_1 = __importDefault(require("casual"));
var graphql_tools_1 = require("graphql-tools");
casual_1.default.define('ethAddress', function () {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 40; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return '0x' + text;
});
casual_1.default.define('datHash', function () {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 64; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
});
// https://www.apollographql.com/docs/graphql-tools/mocking.html
var mocks = {
    // Graphql Types
    NodeIdentity: function () { return ({
        id: casual_1.default.uuid,
        // @ts-ignore
        ethAddress: casual_1.default.ethAddress,
        // @ts-ignore
        datProfile: casual_1.default.datHash,
        // @ts-ignore
        datStorage: casual_1.default.datHash,
    }); },
    NodeIdentityLocal: function () { return ({
        localStorageReserved: casual_1.default.integer(20000, Math.pow(1.25, 8)),
        downloadRateCap: casual_1.default.integer(1, 100000),
        uploadRateCap: casual_1.default.integer(1, 100000),
        maxUploadCap: casual_1.default.integer(20000, Math.pow(1.25, 8)),
    }); },
    NodeIdentityContentCreator: function () { return ({
        content: function () { return new graphql_tools_1.MockList([1, 12]); }
    }); },
    IContent: function (data) { return ({
        id: casual_1.default.uuid,
        nodeID: casual_1.default.uuid,
        creatorID: casual_1.default.uuid,
        contentType: 'VOD',
        isFolder: false,
        isMutable: false,
        fileName: casual_1.default.title,
        description: casual_1.default.description,
        stake: casual_1.default.integer,
        fileSize: casual_1.default.integer,
        premium: casual_1.default.integer,
        split: casual_1.default.double(0, 1),
        adSupport: casual_1.default.boolean,
        createdAt: casual_1.default.date,
    }); },
    VideoContent: function () { return ({
        __typename: 'VideoContent',
        contentType: 'VOD',
        teaserFile: 'teaser.mp4',
        coverImage: 'cover.jpg',
    }); },
    NodeStatistics: function () { return ({
        status: 'connected',
        uptime: casual_1.default.double(0, 1000),
        peersConnected: casual_1.default.integer(0, 100),
        videosAvailable: casual_1.default.integer(),
        videosSeeding: casual_1.default.integer(),
        videosStreaming: casual_1.default.integer(),
        storageUsed: casual_1.default.double(),
        bandwidthUp: casual_1.default.double(),
        bandwidthDown: casual_1.default.double(),
    }); },
    Wallet: function () { return ({
        ethNetwork: 'ropsten',
        // @ts-ignore
        ethAddress: casual_1.default.ethAddress,
        ethBalance: casual_1.default.double(),
        aoBalance: casual_1.default.double(),
        aoStaked: casual_1.default.double(),
    }); }
};
exports.default = mocks;
//# sourceMappingURL=mocks.js.map