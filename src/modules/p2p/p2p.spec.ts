import AOP2P, { AOP2P_Args, AOP2P_New_Content_Data, AOP2P_Add_Discovery_Data, AOP2P_Watch_Key_Data, } from './p2p'
import path from 'path'
import fs from 'fs-extra'
import {assert} from'chai'
import 'mocha'


describe('AO P2P module', () => {
    const storageLocation = path.resolve(__dirname, '../../../data/test/p2p')
    const args:AOP2P_Args =  {
        storageLocation: storageLocation
    }
    let aoP2P; //scoped outside
    before((done) => {
        fs.ensureDir(storageLocation)
        .then(() => {
            aoP2P = new AOP2P(args)
            aoP2P.router.emit('/p2p/init', {
                data: {},
                respond: (message) => {
                    assert(true)
                    done()
                },
                reject: (message) => {
                    throw new Error(message)
                }
            })
        }).catch(e => {
            console.log(e)
        })
    })

    after((done) => {
        fs.remove(storageLocation)
        .then(()=> {
            done()
        })
        .catch(e => {
            console.log(e)
            done(e)
        })
    })
    
    // The init is part of "before"
    // it('initialize p2p/hyperdb',(done) => {
    //     aoP2P.router.emit('/p2p/init', {
    //         data: {},
    //         respond: done,
    //         reject: done
    //     })
    // })

    it('new content upload', (done) => {
        const newContentData: AOP2P_New_Content_Data = {
            contentType: 'VOD',
            //TODO: Assign more believable values?
            datKey: 'boguskey',
            ethAddress: 'bogusEth',
            metaData: {},
            indexData: {},
            signature: 'Signature'
        }
        aoP2P.router.emit('/p2p/newContent',{
            data: newContentData,
            respond: (message)=> {
                done()
            },
            reject: (message)=> {
                done(message)
            }
        })
    })

    it('test watcher', (done) => {
        const watchKeyData: AOP2P_Watch_Key_Data = {
            key: '/p2p/testing'
        }
        aoP2P.router.emit('/p2p/watchKey', {
            data: watchKeyData,
            respond: (message)=> {
                done()
            },
            reject: (message)=> {
                done(message)
            }
        })
        aoP2P.hyperdb.insert(watchKeyData.key, 'testing')
        .then(()=> {

        }).catch(e => {
            console.log(e)
        })
    })

    it('add content discovery', (done) => {
        const addDiscoveryData: AOP2P_Add_Discovery_Data = {
            contentType: 'VOD',
            //TODO: Assign more believable values?
            datKey: 'bogusKey',
            ethAddress: "bogusEth",
            metaData: {},
            indexData: {}
        }
        aoP2P.router.emit('/p2p/addDiscovery',{
            data: addDiscoveryData,
            respond: (message)=> {
                done()
            },
            reject: (message)=> {
                done(message)
            }
        })
    })
})