import casual from 'casual';
import { MockList } from 'graphql-tools';

casual.define('ethAddress', () => {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 40; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return '0x' + text;
});

casual.define('datHash', () => {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 64; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
});

// https://www.apollographql.com/docs/graphql-tools/mocking.html
const mocks = {
    // Graphql Types
    NodeIdentity: () => ({
        id: casual.uuid,
        // @ts-ignore
        ethAddress: casual.ethAddress,
        // @ts-ignore
        datProfile: casual.datHash,
        // @ts-ignore
        datStorage: casual.datHash,
    }),
    NodeIdentityLocal: () => ({
        localStorageReserved: casual.integer(20000, Math.pow(1.25, 8)),  // 20MB - 1TB
        downloadRateCap: casual.integer(1, 100000), // 1KB/s - 100MB/s
        uploadRateCap: casual.integer(1, 100000), // 1KB/s - 100MB/s
        maxUploadCap: casual.integer(20000, Math.pow(1.25, 8)),  // 20MB - 1TB
    }),
    NodeIdentityContentCreator: () => ({
        content: () => new MockList([1, 12])
    }),
    IContent: (data) => ({
        id: casual.uuid,
        nodeID: casual.uuid,
        creatorID: casual.uuid,
        contentType: 'VOD',
        isFolder: false,
        isMutable: false,
        fileName: casual.word + '.mp4',
        fileUrl: 'http://localhost:3000/content/' + casual.word + '.mp4',
        title: casual.title,
        description: casual.description,
        stake: casual.integer,
        fileSize: casual.integer,
        premium: casual.integer,
        split: casual.double(0, 1),
        adSupport: casual.boolean,
        createdAt: casual.date,
    }),
    VideoContent: () => ({
        __typename: 'VideoContent',
        contentType: 'VOD',
        teaserUrl: casual.word + '.mp4',
        coverImageUrl: casual.word + '.jpg',
    }),
    NodeStatistics: () => ({
        status: 'connected',
        uptime: casual.double(0, 1000),
        peersConnected: casual.integer(0, 100),
        videosAvailable: casual.integer(),
        videosSeeding: casual.integer(),
        videosStreaming: casual.integer(),
        storageUsed: casual.double(),
        bandwidthUp: casual.double(),
        bandwidthDown: casual.double(),
    }),
    Wallet: () => ({
        ethNetwork: 'ropsten',
        // @ts-ignore
        ethAddress: casual.ethAddress,
        ethBalance: casual.double(),
        aoBalance: casual.double(),
        aoStaked: casual.double(),
    })
}

export default mocks