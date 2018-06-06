export default `
    type Video {
        id: ID,
        title: String,
        metadata: VideoMetadata,
    }
    type VideoMetadata {
        file_type: String,
        file_size: Int,
    }
    type Peer {
        id: ID,
    }
`;