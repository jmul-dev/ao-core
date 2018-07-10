# AO - Core process
This package exposes the core AO module as a node script via `bin` folder.


# P2P
Ran into a fairly major issue while trying to get libp2p stack running. Basically, when a peer disconects it causes an Error somewhere that I cannot seem to catch, which results in the process terminating. This *may* be the [relevant issue](https://github.com/libp2p/js-libp2p-switch/pull/245) but not 100%. In the meantime, I have a nice little hack: comment out the following `stream.emit('error', err)` on line 757 of `app/node_modules/spdy-transport/lib/spdy-transport/connection.js` which prevents the stream error from crashing everything.


Basically using `libp2p` stack. 
* [proto3](https://developers.google.com/protocol-buffers/docs/proto3) allows us to define a protocol within the p2p network that peers will communicate through. Also allows for versioning!
* [libp2p-connection-manager](https://github.com/libp2p/js-libp2p-connection-manager) adds peer constraints (max peers, bandwidth, etc).

[Initial peer discovery mechanisms](https://github.com/libp2p/js-libp2p/tree/b28eba067e5e4aecd5bee08513a0f05b2d25e426/examples/discovery-mechanisms). See example 1 for ipfs node seed.

# Graphql
