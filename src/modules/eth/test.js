const Web3 = require("web3");

// const rpcEndpoint = "http://y-designs.com";
// const rpcEndpoint = "wss://echo.websocket.org";
const rpcEndpoint = "wss://rinkeby.infura.io/ws";

try {
    const provider = new Web3.providers.WebsocketProvider(rpcEndpoint);
    const web3 = new Web3();
    let wasConnected = false;
    provider.on("error", function(error) {
        console.log(`provider.on(error):`, error);
    });
    provider.on("end", function(error) {
        if (wasConnected === false) {
            // WS could not make connection...
            provider.reset();
            console.log(`provider.on(end), was not connected:`, error);
        } else {
            // We were connected and then ws closed...
            console.log(`provider.on(end), was connected:`, error);
        }
    });
    provider.on("connect", () => {
        console.log(`provider.on(connect)!`);
        // web3.eth.net
        //     .getId()
        //     .then(function(networkId) {
        //         console.log(`Connected to network with id [${networkId}]`);
        //     })
        //     .catch(function(error) {
        //         console.log(`Error getting network id:`, error);
        //         // Failure location 2, ws endpoint is likely an invalid RPC endpoint
        //         // even thought the WS connection was established
        //     });
    });
} catch (error) {
    if (error.name === "TypeError [ERR_INVALID_URL]") {
        // Failure location 1: invalid url
    }
    console.log(error.name);
    console.log(error);
}
