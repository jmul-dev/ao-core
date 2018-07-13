import casual from 'casual';


const demoAssets = [{
    fileUrl: 'http://localhost:3003/assets/demo/demo-1-src.mov',
    teaserUrl: 'http://localhost:3003/assets/demo/demo-1-src.mov',
    coverImageUrl: 'http://localhost:3003/assets/demo/demo-1-poster.png',
}, {
    fileUrl: 'http://localhost:3003/assets/demo/demo-2-src.mov',
    teaserUrl: 'http://localhost:3003/assets/demo/demo-2-src.mov',
    coverImageUrl: 'http://localhost:3003/assets/demo/demo-2-poster.png',
}]

function generateRandomVideo() {
    const demoAsset = casual.random_element(demoAssets);
    return {
        // IContent
        id: casual.uuid,
        nodeID: casual.uuid,
        creatorID: casual.uuid,
        contentType: 'VOD',
        isFolder: false,
        isMutable: false,
        fileName: casual.word + '.mp4',
        title: casual.title,
        description: casual.description,
        stake: casual.integer,
        fileSize: casual.integer,
        premium: casual.integer,
        split: casual.double(0, 1),
        adSupport: casual.boolean,
        createdAt: casual.date(),
        ...demoAsset,
    }
}

export function generateMockVideoList(count: number = 90) {
    let videos = []
    for (let i = 0; i < count; i++) {
        videos.push( generateRandomVideo() )
    }
    return videos;
}