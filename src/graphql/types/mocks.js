import casual from 'casual';

const mocks = {
    Video: () => ({
        id: casual.uuid,
        title: casual.title,
        description: casual.description
    }),
    VideoMetadata: () => ({
        file_type: casual.random_element(['mp4', 'mov']),
        file_size: casual.integer(0, Math.pow(2, 31) - 1)  // 32 bit signed max value
    }),
    Peer: () => ({
        id: casual.uuid,
    })
}

export default mocks