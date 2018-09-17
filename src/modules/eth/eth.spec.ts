import AOEth, { AOEth_Args } from './eth'
import { expect } from 'chai'
import 'mocha';


describe('AO Eth module', () => {
    const aoEth = new AOEth({
        rpcMainnet: 'wss://mainnet.infura.io/ws', // 'https://mainnet.infura.io/',
        rpcRinkeby: 'wss://rinkeby.infura.io/ws', // 'https://rinkeby.infura.io/' ,
        network: '4',
    })
    const mainnetKnownFailedTx = '0xa0a5e34b9b19b398c5a073513ecb461899ceb45246f51e6d470ae0cf23b39075'
    const mainnetKnownSuccessfulTx = '0xfaa19822a0d907e336146ccba8680e5a3fc6e0ac4d69aa8f5d29fe228aa6447e'

    const mainnetUnknownTx = '0xaaa19822a0d907e336146ccba8680e5a3fc6e0ac4d69aa8f5d29fe228aa6447e'

    const rinkebySuccesfullStakeTx = '0xeff2ea575f8626f2969f839c5085b0341ec1d707bc0bed29ebaccc9241642317'
    const rinkebySuccesfullStakeTxStakeId = '0xe09a21e2d95dbad6b78798deca1cd72c5af5210c23acf802e2a391c1b470b3df'

    const rinkebySuccesfulBuyContentTx = '0xe9800a9c8273a4d61b971594e32b96e29c1f31b8417531ebf39b109613de1983'

    it('should connect to rinkeby testnet', (done) => {
        aoEth.router.emit('/eth/network/set', {
            data: {
                networkId: '4',
            },
            respond: ({networkId}) => {
                expect(networkId).to.be.oneOf(['4', 4])
                done()
            },
            reject: (err) => {
                done(err)
            }
        })
    })

    it('should connect to ethereum mainnet', (done) => {
        aoEth.router.emit('/eth/network/set', {
            data: {
                networkId: '1',
            },
            respond: ({networkId}) => {
                expect(networkId).to.be.oneOf(['1', 1])
                done()
            },
            reject: (err) => {
                done(err)
            }
        })
    })

    it('should not connect to unkown eth network', (done) => {
        aoEth.router.emit('/eth/network/set', {
            data: {
                networkId: '10101',
            },
            respond: ({networkId}) => {
                done(new Error('Should not have connected to network: ' + networkId))
            },
            reject: (err) => {
                expect(err).to.be.instanceOf(Error)
                done()
            }
        })
    })

    it('should detect failed tx', (done) => {
        aoEth.router.emit('/eth/tx', {
            data: {
                transactionHash: mainnetKnownFailedTx,
            },
            respond: ({status}) => {
                expect(status).to.not.be.ok
                done()
            },
            reject: done
        })
    })

    it('should detect succesfull tx', (done) => {
        aoEth.router.emit('/eth/tx', {
            data: {
                transactionHash: mainnetKnownSuccessfulTx,
            },
            respond: ({status}) => {
                expect(status).to.be.ok
                done()
            },
            reject: done
        })
    })

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

    it('should return logs for succesfull stake tx', (done) => {
        // Switch to rinkeby
        aoEth.router.emit('/eth/network/set', {
            data: {
                networkId: '4',
            },
            respond: ({networkId}) => {
                expect(networkId).to.be.oneOf(['4', 4])
                // Check stake tx
                aoEth.router.emit('/eth/tx/StakeContent', {
                    data: {
                        transactionHash: rinkebySuccesfullStakeTx,
                    },
                    respond: ({status, stakeContentEvent, hostContentEvent}) => {
                        expect(status).to.be.ok
                        expect(stakeContentEvent).any
                        expect(stakeContentEvent.stakeId).to.equal(rinkebySuccesfullStakeTxStakeId)
                        expect(hostContentEvent).any
                        done()
                    },
                    reject: done
                })
            },
            reject: (err) => {
                done(err)
            }
        })        
    })

    it('should return logs for succesfull buyContent tx', (done) => {
        // Switch to rinkeby
        aoEth.router.emit('/eth/network/set', {
            data: {
                networkId: '4',
            },
            respond: ({networkId}) => {
                expect(networkId).to.be.oneOf(['4', 4])
                // Check stake tx
                aoEth.router.emit('/eth/tx/BuyContent', {
                    data: {
                        transactionHash: rinkebySuccesfulBuyContentTx,
                    },
                    respond: ({status, buyContentEvent}) => {
                        expect(status).to.be.ok
                        expect(buyContentEvent).any
                        // expect(buyContentEvent.stakeId).to.equal('0x1bb20435d2422bc6307162ca0f5bdb50b04dbb7322d30af44c65ee62cefe3d43')
                        done()
                    },
                    reject: done
                })
            },
            reject: (err) => {
                done(err)
            }
        })        
    }).timeout(5000)

    it('should be able to subscribe and unsubscribe from BuyContent events', (done) => {
        // Check stake tx
        aoEth.router.emit('/eth/events/BuyContent/subscribe', {
            data: {
                contentHostId: '0x1bb20435d2422bc6307162ca0f5bdb50b04dbb7322d30af44c65ee62cefe3d43'
            },
            respond: ({subscribed}) => {
                expect(subscribed).to.be.true
                aoEth.router.emit('/eth/events/BuyContent/unsubscribeAll', {
                    respond: ({success, subscriptionsCancelled}) => {
                        expect(success).to.be.true
                        expect(subscriptionsCancelled).to.equal(1)
                        done()
                    },
                    reject: done
                })
            },
            reject: done
        })
    })    
})



