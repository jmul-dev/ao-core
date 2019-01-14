import AOEth, { EthereumNetworkError } from "./eth";
import { expect } from "chai";
import "mocha";

describe("Ethereum connection behavior", () => {
    // faking process.send
    process.send = () => {};
    process.on("unhandledRejection", (reason, p) => {
        console.log("Unhandled Rejection at: Promise", p, "reason:", reason);
        // application specific logging, throwing an error, or other logic here
    });

    const getEthModuleInstance = args => {
        let instance = new AOEth({
            rpcEndpoint: "",
            storageLocation: "string",
            httpOrigin: "string",
            coreOrigin: "string",
            corePort: 9999,
            ffprobeBin: "string",
            ...args
        });
        // faking the router.send method for testing purposes
        instance.router.send = (route, message) => {
            return new Promise((resolve, reject) => {});
        };
        return instance;
    };

    it("should fail with an rpc that is not a websocket: INVALID_WS_URL", done => {
        const aoEth = getEthModuleInstance({
            rpcEndpoint: "http://rinkeby.infura.io/ws"
        });
        aoEth.router.emit("/eth/init", {
            data: {},
            respond: ({ networkId }) => {
                done(
                    new Error("should have failed due to invalid websocket url")
                );
            },
            reject: err => {
                expect(err).to.be.instanceOf(EthereumNetworkError);
                expect(err.code).to.equal(
                    EthereumNetworkError.ErrorCodes.INVALID_WS_URL
                );
                done();
            }
        });
    });

    it("should fail with a valid websocket connection that does not represent an ethereum rpc: INVALID_RPC", function(done) {
        const aoEth = getEthModuleInstance({
            rpcEndpoint: "wss://echo.websocket.org"
        });
        aoEth.router.emit("/eth/init", {
            data: {},
            respond: ({ networkId }) => {
                done(
                    new Error(
                        "should have failed fast due to invalid websocket rpc endpoint"
                    )
                );
            },
            reject: err => {
                expect(err).to.be.instanceOf(EthereumNetworkError);
                expect(err.code).to.equal(
                    EthereumNetworkError.ErrorCodes.INVALID_RPC
                );
                done();
            }
        });
    }).timeout(4000);

    it("should fail as a result of an unsupported network: UNSUPPORTED_NETWORK", function(done) {
        const aoEth = getEthModuleInstance({
            rpcEndpoint: "wss://ropsten.infura.io/ws"
        });
        aoEth.router.emit("/eth/init", {
            data: {},
            respond: ({ networkId }) => {
                done(
                    new Error(
                        "should have failed because contracts are not deployed to the given network"
                    )
                );
            },
            reject: err => {
                expect(err).to.be.instanceOf(EthereumNetworkError);
                expect(err.code).to.equal(
                    EthereumNetworkError.ErrorCodes.UNSUPPORTED_NETWORK
                );
                done();
            }
        });
    }).timeout(4000);

    it("should succesfully connect to the rinkeby network", function(done) {
        const aoEth = getEthModuleInstance({
            rpcEndpoint: "wss://rinkeby.infura.io/ws"
        });
        aoEth.router.emit("/eth/init", {
            data: {},
            respond: ({ networkId }) => {
                expect(networkId).to.equal("4");
                done();
            },
            reject: err => {
                done(err);
            }
        });
    }).timeout(4000);
});
