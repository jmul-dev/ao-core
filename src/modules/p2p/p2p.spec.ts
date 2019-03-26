import EthCrypto from "eth-crypto";
import "mocha";
import path from "path";
import ram from "random-access-memory";
import * as AOCrypto from "../../AOCrypto";
import AOContent from "../../models/AOContent";
import AOP2P, { AOP2P_Init_Data } from "./p2p";

describe("AO P2P module", () => {
    const actorA: AOCrypto.Identity = AOCrypto.createUserIdentity();
    const actorB: AOCrypto.Identity = AOCrypto.createUserIdentity();
    const actorC: AOCrypto.Identity = AOCrypto.createUserIdentity();
    const contentJson = {
        id: "4dafd6582efbbfe913c4202cf926b700b3f5700ccebe1faf10d5f61e1e5ffda8",
        nodeId: actorA.publicKey,
        creatorId: actorA.publicKey,
        contentHostId: "somerandomhostidgeneratedbyethereumnetwork",
        metadataDatKey:
            "b7e815da776b9d1610e710bf2e8eca3f8d1972112f62f49997ca3281b73a75ee",
        contentType: "VOD",
        isFolder: false,
        isMutable: false,
        title: "asdfasdf",
        description: "asd fasdf asdf",
        stake: 12092665,
        profit: 10,
        createdAt: "1536254388663",
        fileUrl:
            "4dafd6582efbbfe913c4202cf926b700b3f5700ccebe1faf10d5f61e1e5ffda8/video.mp4",
        fileDatKey:
            "4dafd6582efbbfe913c4202cf926b700b3f5700ccebe1faf10d5f61e1e5ffda8",
        fileName: "video.mp4",
        fileSize: 12092665,
        fileChecksum: "066fe55d9f3a744fec738c8fdf8e40bf722b9f48",
        teaserName: "videoTeaser.mp4",
        teaserUrl:
            "b7e815da776b9d1610e710bf2e8eca3f8d1972112f62f49997ca3281b73a75ee/videoTeaser.mp4",
        featuredImageName: "featuredImage.jpg",
        featuredImageUrl:
            "b7e815da776b9d1610e710bf2e8eca3f8d1972112f62f49997ca3281b73a75ee/featuredImage.jpg",
        metadata: { duration: 24.8248, resolution: 1080, encoding: "h264" },
        decryptionKey: "0xDEADBEEF"
    };
    let content = AOContent.fromObject(contentJson);
    content.baseChallenge = EthCrypto.hash.keccak256(
        "base challenge of fake content"
    );
    content.baseChallengeSignature = AOCrypto.generateBaseChallengeSignature({
        baseChallenge: content.baseChallenge,
        privateKey: actorA.privateKey
    });

    const storageLocation = path.resolve(__dirname, "../../../data/p2ptest");
    let aoP2P: AOP2P;
    before(done => {
        // faking process.send
        process.send = () => {};
        process.on("unhandledRejection", (reason, p) => {
            console.log(
                "Unhandled Rejection at: Promise",
                p,
                "reason:",
                reason
            );
            // application specific logging, throwing an error, or other logic here
        });
        aoP2P = new AOP2P({
            storageLocation: storageLocation,
            // unused args, making typescript happy
            ethNetworkRpc: "",
            httpOrigin: "string",
            coreOrigin: "string",
            corePort: 9999,
            ffprobeBin: "string"
        });
        // faking the router.send method for testing purposes
        aoP2P.router.send = (route, message) => {
            return new Promise((resolve, reject) => {});
        };
        const p2pInitData: AOP2P_Init_Data = {
            dbKey: undefined,
            dbPath: function() {
                return ram();
            }
        };
        aoP2P.router.emit("/p2p/init", {
            data: p2pInitData,
            respond: () => {
                aoP2P.router.emit("/p2p/setUserIdentity", {
                    data: { userIdentity: actorA },
                    respond: done,
                    reject: done
                });
            },
            reject: done
        });
    });

    describe("New content registration", () => {
        it("should register new content for actorA", done => {
            aoP2P.router.emit("/p2p/init", {
                data: p2pInitData,
                respond: () => {
                    aoP2P.router.emit("/p2p/setUserIdentity", {
                        data: { userIdentity: actorA },
                        respond: done,
                        reject: done
                    });
                },
                reject: done
            });
        });
    });

    // it("personA uploads new content", done => {
    //     const keyHash = EthCrypto.hash.keccak256(personADecryptionKey);
    //     const fakeSignature = EthCrypto.sign(personA.privateKey, keyHash);

    //     const newContentData: AOP2P_New_Content_Data = {
    //         contentType: "VOD",
    //         metaDatKey: content.metadataDatKey, //same as the test contentDat
    //         fileDatKey: content.fileDatKey,
    //         ethAddress: personA.address,
    //         metaData: content.toMetadataJson(),
    //         indexData: {}, //Empty for now.
    //         signature: fakeSignature
    //     };
    //     aoP2P.router.emit("/p2p/registerContent", {
    //         data: newContentData,
    //         respond: message => {
    //             done();
    //         },
    //         reject: message => {
    //             done(message);
    //         }
    //     });
    // });

    // it("personB buys personAs new content.  personA puts key in indexData", async () => {
    //     //As personA
    //     const keyHash = EthCrypto.hash.keccak256(personADecryptionKey);
    //     const fakeSignature = EthCrypto.sign(personA.privateKey, keyHash);
    //     let encrypted = {};
    //     try {
    //         encrypted = await EthCrypto.encryptWithPublicKey(
    //             personB.publicKey,
    //             personADecryptionKey
    //         );
    //     } catch (e) {
    //         console.log(e);
    //     }
    //     let stringifiedEncrypted = EthCrypto.cipher.stringify(encrypted);
    //     const soldKeyData: AOP2P_Write_Decryption_Key_Data = {
    //         content: content,
    //         buyerEthAddress: personB.address,
    //         sellerEthAddress: personA.address,
    //         encryptedDecryptionKey: stringifiedEncrypted,
    //         encryptedKeySignature: fakeSignature
    //     };
    //     return new Promise((resolve, reject) => {
    //         aoP2P.router.emit("/p2p/soldKey", {
    //             data: soldKeyData,
    //             respond: message => {
    //                 resolve(message);
    //             },
    //             reject: message => {
    //                 console.log(new Error("failed"));
    //                 reject(message);
    //             }
    //         });
    //     });
    // });

    // it("personB watches to see if personA has dropped his keys", () => {
    //     //As person B
    //     const watchKey = AOP2P.routeNodeRegistration({
    //         nameSpace: dbNameSpace,
    //         contentType: contentJson.contentType,
    //         metaDatKey: contentJson.metadataDatKey,
    //         ethAddress: personA.address,
    //         fileDatKey: content.fileDatKey
    //     });
    //     const watchKeyData: AOP2P_Watch_AND_Get_IndexData_Data = {
    //         key: watchKey,
    //         ethAddress: personB.address
    //     };
    //     return new Promise((resolve, reject) => {
    //         aoP2P.router.emit("/p2p/watchAndGetIndexData", {
    //             data: watchKeyData,
    //             respond: async message => {
    //                 let indexDataRow: ITaoDB_ContentHost_IndexData_Entry =
    //                     message.indexDataRow;
    //                 let parsedDecryptionKey = EthCrypto.cipher.parse(
    //                     indexDataRow.decryptionKey
    //                 );
    //                 let parsed = "";
    //                 try {
    //                     parsed = await EthCrypto.decryptWithPrivateKey(
    //                         personB.privateKey,
    //                         parsedDecryptionKey
    //                     );
    //                 } catch (error) {
    //                     reject(error);
    //                 }
    //                 if (parsed == personADecryptionKey) {
    //                     resolve();
    //                 } else {
    //                     reject(
    //                         new Error(
    //                             "Decryption key did not decrypt correctly and do not match"
    //                         )
    //                     );
    //                 }
    //             },
    //             reject: message => {
    //                 reject(message);
    //             }
    //         });
    //     });
    // });

    // it("add content discovery", done => {
    //     const addDiscoveryData: AOP2P_Add_Discovery_Data = {
    //         content
    //     };
    //     aoP2P.router.emit("/p2p/registerContentHost", {
    //         data: addDiscoveryData,
    //         respond: message => {
    //             done();
    //         },
    //         reject: message => {
    //             done(message);
    //         }
    //     });
    // });
});
