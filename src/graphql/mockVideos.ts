import casual from 'casual';


function generateRandomVideo() {
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
        createdAt: casual.date,
        fileUrl: casual.random_element([
            'https://devshed.y-designs.com/linotagliapietra/wp-content/uploads/2016/07/intro.fast_.mp4',
            'https://devshed.y-designs.com/linotagliapietra/wp-content/uploads/2016/07/360-intro-5.fast_.mp4',
            'https://devshed.y-designs.com/linotagliapietra/wp-content/uploads/2016/07/rotate6.fast_.mp4',
        ]),
        // VideoContent
        teaserUrl: casual.random_element([
            'https://devshed.y-designs.com/linotagliapietra/wp-content/uploads/2016/07/intro.fast_.mp4',
            'https://devshed.y-designs.com/linotagliapietra/wp-content/uploads/2016/07/360-intro-5.fast_.mp4',
            'https://devshed.y-designs.com/linotagliapietra/wp-content/uploads/2016/07/rotate6.fast_.mp4',
        ]),
        coverImageUrl: casual.random_element([
            'https://devshed.y-designs.com/linotagliapietra/wp-content/uploads/2017/08/RAJ2889-web.jpg'
        ]),
    }
}

export function generateMockVideoList(count: number = 90) {
    let videos = []
    for (let i = 0; i < count; i++) {
        videos.push( generateRandomVideo() )
    }
    return videos;
}