import AOEth, { AOEth_Args } from './eth'
import { expect } from 'chai'
import 'mocha';


describe('AO Eth module', () => {
    const aoEth = new AOEth({
        rpcMainnet: 'https://mainnet.infura.io/',
        rpcRinkeby: 'https://rinkeby.infura.io/',
    })

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
})



