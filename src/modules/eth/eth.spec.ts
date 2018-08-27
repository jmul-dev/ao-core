import AOEth, { AOEth_Args } from './eth'
import { expect } from 'chai'
import 'mocha';


describe('AO Eth module', () => {
    const aoEth = new AOEth({
        rpcMainnet: 'https://mainnet.infura.io/',
        rpcRinkeby: 'https://rinkeby.infura.io/',
    })
    const mainnetKnownFailedTx = '0xa0a5e34b9b19b398c5a073513ecb461899ceb45246f51e6d470ae0cf23b39075'
    const mainnetKnownSuccessfulTx = '0xfaa19822a0d907e336146ccba8680e5a3fc6e0ac4d69aa8f5d29fe228aa6447e'

    it('should connect to rinkeby testnet', (done) => {
        aoEth.router.emit('/eth/network/set', {
            data: {
                networkId: '4',
            },
            respond: ({networkId}) => {
                expect(networkId).to.equal('4')
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
                expect(networkId).to.equal('1')
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

    it('should return status 0 for invalid BuyContent event transaction hash', (done) => {
        aoEth.router.emit('/eth/tx/BuyContent', {
            data: {
                transactionHash: mainnetKnownSuccessfulTx,
            },
            respond: ({status}) => {
                expect(status).to.not.be.ok
                done()
            },
            reject: done
        })
    })
})



