import AOP2P, {AOP2P_Args} from './p2p'
import {expect} from 'chai'
import 'mocha'

describe('AO P2P module', () => {
    const args:AOP2P_Args =  {
        storageLocation: 'data/'
    }
    const aoP2P = new AOP2P(args)

    it('initialize p2p/hyperdb',(done) => {
        //aoP2P.router.emit('/')
    })
})