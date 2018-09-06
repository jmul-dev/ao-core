import AOP2P, { AOP2P_Args, AOP2P_New_Content_Data, AOP2P_Add_Discovery_Data, AOP2P_Watch_Key_Data, AOP2P_Write_Decryption_Key_Data, } from './p2p'
import path from 'path'
import fs from 'fs-extra'
import EthCrypto from 'eth-crypto'
import 'mocha'

const personA = EthCrypto.createIdentity()
const personADecryptionKey = 'teeeesting123'
const personB = EthCrypto.createIdentity()

const contentJson = {"id":"4dafd6582efbbfe913c4202cf926b700b3f5700ccebe1faf10d5f61e1e5ffda8","nodeId":"0x9c7caa71129f534223107e4486ed48afd85de5d6","creatorId":"0x9c7caa71129f534223107e4486ed48afd85de5d6","metadataDatKey":"b7e815da776b9d1610e710bf2e8eca3f8d1972112f62f49997ca3281b73a75ee","contentType":"VOD","isFolder":false,"isMutable":false,"title":"asdfasdf","description":"asd fasdf asdf","stake":12092665,"profit":10,"createdAt":1536254388663,"fileUrl":"4dafd6582efbbfe913c4202cf926b700b3f5700ccebe1faf10d5f61e1e5ffda8/video.mp4","fileDatKey":"4dafd6582efbbfe913c4202cf926b700b3f5700ccebe1faf10d5f61e1e5ffda8","fileName":"video.mp4","fileSize":12092665,"fileChecksum":"066fe55d9f3a744fec738c8fdf8e40bf722b9f48","teaserName":"videoTeaser.mp4","teaserUrl":"b7e815da776b9d1610e710bf2e8eca3f8d1972112f62f49997ca3281b73a75ee/videoTeaser.mp4","featuredImageName":"featuredImage.jpg","featuredImageUrl":"b7e815da776b9d1610e710bf2e8eca3f8d1972112f62f49997ca3281b73a75ee/featuredImage.jpg","metadata":{"duration":"24.824800","resolution":1080,"encoding":"h264"}}
contentJson['decryptionKey'] = personADecryptionKey

describe('AO P2P module', () => {
    const storageLocation = path.resolve(__dirname, '../../../data/p2ptest')
    const args:AOP2P_Args =  {
        storageLocation: storageLocation
    }
    let aoP2P; //scoped outside
    before((done) => {
        fs.ensureDir(storageLocation)
        .then(() => {
            aoP2P = new AOP2P(args)
            done()
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

    it('personA uploads new content', (done) => {
        const keyHash = EthCrypto.hash.keccak256(personADecryptionKey)
        const fakeSignature = EthCrypto.sign(
            personA.privateKey,
            keyHash
        )

        const newContentData: AOP2P_New_Content_Data = {
            contentType: 'VOD',
            datKey: '4dafd6582efbbfe913c4202cf926b700b3f5700ccebe1faf10d5f61e1e5ffda8',//same as the 
            ethAddress: '0x9c7caa71129f534223107e4486ed48afd85de5d6', //Rinkeby test account for RY
            metaData: contentJson,
            indexData: {},//Empty for now.
            signature: fakeSignature
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

    it('personB buys personAs new content, so A drops his keys', (done) => {

        //As personA
        // const soldKeyData: AOP2P_Write_Decryption_Key_Data = {

        // }
        // aoP2P.router.emit('/p2p/soldKey')
    })
    

    it('personB watches to see if personA has dropped his keys', (done) => {
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
            metaDatKey: 'bogusMetaKey',
            fileDatKey: 'bogusKey',
            ethAddress: "bogusEth"
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