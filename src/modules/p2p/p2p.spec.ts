import AOP2P, { AOP2P_Args, AOP2P_New_Content_Data, AOP2P_Add_Discovery_Data, AOP2P_Watch_Key_Data, AOP2P_Write_Decryption_Key_Data, AOP2P_Watch_AND_Get_IndexData_Data, AOP2P_IndexDataRow, } from './p2p'
import path from 'path'
import fs from 'fs-extra'
import EthCrypto from 'eth-crypto'
import 'mocha'
import AOContent from '../../models/AOContent';

const personA = EthCrypto.createIdentity()
const personADecryptionKey = 'teeeesting123'
const personB = EthCrypto.createIdentity()

const contentJson = {"id":"4dafd6582efbbfe913c4202cf926b700b3f5700ccebe1faf10d5f61e1e5ffda8","nodeId":"0x9c7caa71129f534223107e4486ed48afd85de5d6","creatorId":"0x9c7caa71129f534223107e4486ed48afd85de5d6","metadataDatKey":"b7e815da776b9d1610e710bf2e8eca3f8d1972112f62f49997ca3281b73a75ee","contentType":"VOD","isFolder":false,"isMutable":false,"title":"asdfasdf","description":"asd fasdf asdf","stake":12092665,"profit":10,"createdAt":1536254388663,"fileUrl":"4dafd6582efbbfe913c4202cf926b700b3f5700ccebe1faf10d5f61e1e5ffda8/video.mp4","fileDatKey":"4dafd6582efbbfe913c4202cf926b700b3f5700ccebe1faf10d5f61e1e5ffda8","fileName":"video.mp4","fileSize":12092665,"fileChecksum":"066fe55d9f3a744fec738c8fdf8e40bf722b9f48","teaserName":"videoTeaser.mp4","teaserUrl":"b7e815da776b9d1610e710bf2e8eca3f8d1972112f62f49997ca3281b73a75ee/videoTeaser.mp4","featuredImageName":"featuredImage.jpg","featuredImageUrl":"b7e815da776b9d1610e710bf2e8eca3f8d1972112f62f49997ca3281b73a75ee/featuredImage.jpg","metadata":{"duration":"24.824800","resolution":1080,"encoding":"h264"}}
let content = AOContent.fromObject(contentJson)

describe('AO P2P module', () => {
    const storageLocation = path.resolve(__dirname, '../../../data/p2ptest')
    const args:AOP2P_Args =  {
        storageLocation: storageLocation,
        dbNameSpace: "/AOTest/"
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
            metaDatKey: content.metadataDatKey,//same as the test contentDat
            fileDatKey: content.fileDatKey,
            ethAddress: personA.address,
            metaData: content.toMetadataJson(),
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

    it('personB buys personAs new content.  personA puts key in indexData', async () => {
        //As personA
        const keyHash = EthCrypto.hash.keccak256(personADecryptionKey)
        const fakeSignature = EthCrypto.sign(
            personA.privateKey,
            keyHash
        )
        let encrypted = {}
        try {
            encrypted = await EthCrypto.encryptWithPublicKey(personB.publicKey, personADecryptionKey)
        } catch (e) {
            console.log(e)
        }
        let stringifiedEncrypted = EthCrypto.cipher.stringify(encrypted)
        const soldKeyData: AOP2P_Write_Decryption_Key_Data = {
            content: content.toMetadataJson(),
            buyerEthAddress: personB.address,
            sellerEthAddress: personA.address,
            encryptedDecryptionKey: stringifiedEncrypted,
            encryptedKeySignature:fakeSignature
        }
        return new Promise((resolve,reject) => {    
            aoP2P.router.emit('/p2p/soldKey', {
                data: soldKeyData,
                respond: (message) => {
                    resolve(message)
                },
                reject: (message) => {
                    console.log(new Error('failed'))
                    reject(message)
                }
            })
        })
    })
    

    it('personB watches to see if personA has dropped his keys', () => {
        //As person B
        const watchKeyData: AOP2P_Watch_AND_Get_IndexData_Data = {
            key: '/AOSpace/VOD/'+contentJson.metadataDatKey + '/nodes/'+ personA.address +'/' + content.fileDatKey + '/indexData',
            ethAddress: personB.address
        }
        return new Promise((resolve,reject) => {
            aoP2P.router.emit('/p2p/watchAndGetIndexData', {
                data: watchKeyData,
                respond: async (message)=> {
                    let indexDataRow: AOP2P_IndexDataRow = message.indexDataRow
                    let parsedDecryptionKey = EthCrypto.cipher.parse(indexDataRow.decryptionKey)
                    let parsed = ''
                    try {
                        parsed = await EthCrypto.decryptWithPrivateKey(personB.privateKey, parsedDecryptionKey)
                    } catch (error) {
                        reject(error)
                    }
                    if(parsed == personADecryptionKey) {
                        resolve()
                    } else {
                        reject(new Error('Decryption key did not decrypt correctly and do not match'))
                    }
                },
                reject: (message)=> {
                    reject(message)
                }
            })
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