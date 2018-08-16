import casual from 'casual';


const demoAssets = [{
    fileUrl: '/assets/demo/demo-1-src.mov',
    teaserUrl: '/assets/demo/demo-1-src.mov',
    featuredImageUrl: '/assets/demo/demo-1-poster.png',
}, {
    fileUrl: '/assets/demo/demo-2-src.mov',
    teaserUrl: '/assets/demo/demo-2-src.mov',
    featuredImageUrl: '/assets/demo/demo-2-poster.png',
}]

function generateRandomVideo(coreOrigin,corePort) {
    const demoAsset = casual.random_element(demoAssets);
    const fileSize = casual.integer(1000, 1000000)
    const stake = Math.floor( casual.double(1, 4) * fileSize );
    const premium = stake - fileSize
    const originURL = coreOrigin+':'+corePort
//    console.log(originURL+demoAsset.fileUrl)
    return {
        // IContent
        id: casual.uuid,
        nodeId: casual.uuid,
        creatorId: casual.uuid,
        contentType: 'VOD',
        isFolder: false,
        isMutable: false,
        fileName: casual.word + '.mp4',
        title: casual.title,
        description: casual.description,

        fileSize: fileSize,
        stake: stake,
        premium: premium,
        split: casual.double(0, 1),

        adSupport: casual.boolean,
        createdAt: casual.date(),

        fileUrl: originURL+demoAsset.fileUrl,
        teaserUrl: originURL+demoAsset.teaserUrl,
        featuredImageUrl: originURL+demoAsset.featuredImageUrl
    }
}

export function generateMockVideoList(count: number = 90, coreOrigin, corePort) {
    let videos = []
    for (let i = 0; i < count; i++) {
        videos.push( generateRandomVideo(coreOrigin,corePort) )
    }
    return videos;
}