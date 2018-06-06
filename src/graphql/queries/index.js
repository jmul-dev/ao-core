// NOTE: we need a resolver for each root query
const RootQuery = `
    type RootQuery {
        version: String,
        videos: [Video],
        peers: [Peer],
    }
`

module.exports = RootQuery