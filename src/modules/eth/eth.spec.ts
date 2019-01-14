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
/*
describe("AO Eth module", () => {
    const aoEth = new AOEth({
        rpcEndpoint: "wss://rinkeby.infura.io/ws", // 'https://rinkeby.infura.io/',
        ethNetworkId: "4",
        // unused args, making typescript happy
        storageLocation: "string",
        httpOrigin: "string",
        coreOrigin: "string",
        corePort: 9999,
        ffprobeBin: "string"
    });
    const mainnetKnownFailedTx =
        "0xa0a5e34b9b19b398c5a073513ecb461899ceb45246f51e6d470ae0cf23b39075";
    const mainnetKnownSuccessfulTx =
        "0xfaa19822a0d907e336146ccba8680e5a3fc6e0ac4d69aa8f5d29fe228aa6447e";

    const mainnetUnknownTx =
        "0xaaa19822a0d907e336146ccba8680e5a3fc6e0ac4d69aa8f5d29fe228aa6447e";

    const rinkebySuccesfullStakeTx =
        "0xeff2ea575f8626f2969f839c5085b0341ec1d707bc0bed29ebaccc9241642317";
    const rinkebySuccesfullStakeTxStakeId =
        "0xe09a21e2d95dbad6b78798deca1cd72c5af5210c23acf802e2a391c1b470b3df";

    const rinkebySuccesfulBuyContentTx =
        "0xe9800a9c8273a4d61b971594e32b96e29c1f31b8417531ebf39b109613de1983";

    it("should connect to rinkeby testnet", done => {
        aoEth.router.emit("/eth/network/set", {
            data: {
                networkId: "4"
            },
            respond: ({ networkId }) => {
                expect(networkId).to.be.oneOf(["4", 4]);
                done();
            },
            reject: err => {
                done(err);
            }
        });
    });

    it("should connect to ethereum mainnet", done => {
        aoEth.router.emit("/eth/network/set", {
            data: {
                networkId: "1"
            },
            respond: ({ networkId }) => {
                expect(networkId).to.be.oneOf(["1", 1]);
                done();
            },
            reject: err => {
                done(err);
            }
        });
    });

    it("should not connect to unkown eth network", done => {
        aoEth.router.emit("/eth/network/set", {
            data: {
                networkId: "10101"
            },
            respond: ({ networkId }) => {
                done(
                    new Error(
                        "Should not have connected to network: " + networkId
                    )
                );
            },
            reject: err => {
                expect(err).to.be.instanceOf(Error);
                done();
            }
        });
    });

    it("should detect failed tx", done => {
        aoEth.router.emit("/eth/tx", {
            data: {
                transactionHash: mainnetKnownFailedTx
            },
            respond: ({ status }) => {
                expect(status).to.not.be.ok;
                done();
            },
            reject: done
        });
    });

    it("should detect succesfull tx", done => {
        aoEth.router.emit("/eth/tx", {
            data: {
                transactionHash: mainnetKnownSuccessfulTx
            },
            respond: ({ status }) => {
                expect(status).to.be.ok;
                done();
            },
            reject: done
        });
    });

    // // Just used for testing the periodic check of tx status
    // it('should timeout listening for unkown tx', (done) => {
    //     aoEth.router.emit('/eth/tx', {
    //         data: {
    //             transactionHash: mainnetUnknownTx,
    //         },
    //         respond: ({status}) => {
    //             expect(status).to.not.be.ok
    //             done(new Error(`This tx should not return succesfully`))
    //         },
    //         reject: done
    //     })
    // }).timeout(20000)

    // it('should return BuyContent event for known transaction', (done) => {
    //     aoEth.router.emit('/eth/tx/BuyContent', {
    //         data: {
    //             transactionHash: mainnetKnownSuccessfulTx,
    //         },
    //         respond: ({status, buyContentEvent}) => {
    //             expect(status).to.be.ok
    //             expect(buyContentEvent).to.be.undefined
    //             done()
    //         },
    //         reject: done
    //     })
    // })

    it("should return logs for succesfull stake tx", done => {
        // Switch to rinkeby
        aoEth.router.emit("/eth/network/set", {
            data: {
                networkId: "4"
            },
            respond: ({ networkId }) => {
                expect(networkId).to.be.oneOf(["4", 4]);
                // Check stake tx
                aoEth.router.emit("/eth/tx/StakeContent", {
                    data: {
                        transactionHash: rinkebySuccesfullStakeTx
                    },
                    respond: ({
                        status,
                        stakeContentEvent,
                        hostContentEvent
                    }) => {
                        expect(status).to.be.ok;
                        expect(stakeContentEvent).any;
                        expect(stakeContentEvent.stakeId).to.equal(
                            rinkebySuccesfullStakeTxStakeId
                        );
                        expect(hostContentEvent).any;
                        done();
                    },
                    reject: done
                });
            },
            reject: err => {
                done(err);
            }
        });
    });

    it("should return logs for succesfull buyContent tx", done => {
        // Switch to rinkeby
        aoEth.router.emit("/eth/network/set", {
            data: {
                networkId: "4"
            },
            respond: ({ networkId }) => {
                expect(networkId).to.be.oneOf(["4", 4]);
                // Check stake tx
                aoEth.router.emit("/eth/tx/BuyContent", {
                    data: {
                        transactionHash: rinkebySuccesfulBuyContentTx
                    },
                    respond: ({ status, buyContentEvent }) => {
                        expect(status).to.be.ok;
                        expect(buyContentEvent).any;
                        // expect(buyContentEvent.stakeId).to.equal('0x1bb20435d2422bc6307162ca0f5bdb50b04dbb7322d30af44c65ee62cefe3d43')
                        done();
                    },
                    reject: done
                });
            },
            reject: err => {
                done(err);
            }
        });
    }).timeout(5000);

    it("should be able to subscribe and unsubscribe from BuyContent events", done => {
        // Check stake tx
        aoEth.router.emit("/eth/events/BuyContent/subscribe", {
            data: {
                contentHostId:
                    "0x1bb20435d2422bc6307162ca0f5bdb50b04dbb7322d30af44c65ee62cefe3d43"
            },
            respond: ({ subscribed }) => {
                expect(subscribed).to.be.true;
                aoEth.router.emit("/eth/events/BuyContent/unsubscribe", {
                    respond: ({ success, subscriptionsCancelled }) => {
                        expect(success).to.be.true;
                        expect(subscriptionsCancelled).to.equal(1);
                        done();
                    },
                    reject: done
                });
            },
            reject: done
        });
    });
});
*/
