import EthCrypto from "eth-crypto";
import "mocha";
import path from "path";
import ram from "random-access-memory";
import * as AOCrypto from "../../AOCrypto";
import AOContent from "../../models/AOContent";
import AOP2P, {
    AOP2P_Init_Data,
    AOP2P_Write_Decryption_Key_Data,
    NetworkContentHostEntry
} from "./p2p";
import TaoDB, {
    ITaoDB_ContentHost_Timestamp,
    ITaoDB_ContentHost_IndexData
} from "./TaoDB";
import { expect } from "chai";
import { IAORouterMessage } from "../../router/AORouter";

describe("AO P2P module", () => {
    const actorA: AOCrypto.Identity = AOCrypto.createUserIdentity();
    const actorB: AOCrypto.Identity = AOCrypto.createUserIdentity();
    const actorC: AOCrypto.Identity = AOCrypto.createUserIdentity();
    const contentJson = {
        id: "4dafd6582efbbfe913c4202cf926b700b3f5700ccebe1faf10d5f61e1e5ffda8",
        nodePublicKey: actorA.publicKey,
        nodeEthAddress: actorA.address,
        creatorNodePublicKey: actorA.publicKey,
        creatorEthAddress: actorA.address,
        contentHostId: "somerandomhostidgeneratedbyethereumnetwork",
        metadataDatKey:
            "b7e815da776b9d1610e710bf2e8eca3f8d1972112f62f49997ca3281b73a75ee",
        contentType: "VOD",
        isFolder: false,
        isMutable: false,
        title: "asdfasdf",
        description: "asd fasdf asdf",
        stake: 12092665,
        profitSplitPercentage: 10,
        createdAt: "1536254388663",
        fileUrl:
            "4dafd6582efbbfe913c4202cf926b700b3f5700ccebe1faf10d5f61e1e5ffda8/video.mp4",
        fileDatKey:
            "4dafd6582efbbfe913c4202cf926b700b3f5700ccebe1faf10d5f61e1e5ffda8",
        fileName: "video.mp4",
        fileSize: 12092665,
        fileChecksum: "066fe55d9f3a744fec738c8fdf8e40bf722b9f48",
        teaserUrl:
            "b7e815da776b9d1610e710bf2e8eca3f8d1972112f62f49997ca3281b73a75ee/videoTeaser.mp4",
        featuredImageUrl:
            "b7e815da776b9d1610e710bf2e8eca3f8d1972112f62f49997ca3281b73a75ee/featuredImage.jpg",
        metadata: { duration: 24.8248, resolution: 1080, encoding: "h264" },
        decryptionKey: "0xDEADBEEF"
    };
    let content = AOContent.fromObject(contentJson);

    content.baseChallenge = AOCrypto.generateContentBaseChallenge({
        fileChecksum: content.fileChecksum,
        contractAddress: "0x0000"
    });
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
            aoP2P.router.emit("/p2p/registerContent", {
                data: { content },
                respond: () => {
                    done();
                },
                reject: done
            });
        });
        it("verifies content was registered under the User Content schema", done => {
            const dbKey = TaoDB.getUserContentSignatureKey({
                usersPublicKey: actorA.publicKey,
                contentType: content.contentType,
                contentMetadataDatKey: content.metadataDatKey
            });
            aoP2P.taodb
                .get(dbKey)
                .then(value => {
                    expect(value).to.not.be.empty;
                    const recoveredSigner = EthCrypto.recoverPublicKey(
                        value,
                        content.baseChallenge
                    );
                    expect(recoveredSigner).to.equal(actorA.publicKey);
                    done();
                })
                .catch(done);
        });
    });

    describe("New content host registration", () => {
        it("should register actorA as new content host", done => {
            aoP2P.router.emit("/p2p/registerContentHost", {
                data: { content },
                respond: () => {
                    done();
                },
                reject: done
            });
        });
        it("verifies content host signature was registered under the Content Host signature schema", done => {
            const dbKey = TaoDB.getContentHostSignatureKey({
                hostsPublicKey: actorA.publicKey,
                contentDatKey: content.fileDatKey,
                contentType: content.contentType,
                contentMetadataDatKey: content.metadataDatKey
            });
            aoP2P.taodb
                .get(dbKey)
                .then(value => {
                    expect(value).to.not.be.empty;
                    const recoveredSigner = EthCrypto.recoverPublicKey(
                        value,
                        content.baseChallenge
                    );
                    expect(recoveredSigner).to.equal(actorA.publicKey);
                    done();
                })
                .catch(done);
        });
        it("verifies content host indexData was added under the Content Host indexData schema", done => {
            const dbKey = TaoDB.getContentHostIndexDataKey({
                hostsPublicKey: actorA.publicKey,
                contentDatKey: content.fileDatKey,
                contentType: content.contentType,
                contentMetadataDatKey: content.metadataDatKey
            });
            aoP2P.taodb
                .get(dbKey)
                .then(value => {
                    // IndexData should be empty after initial host registration
                    expect(value).to.be.deep.equal({});
                    done();
                })
                .catch(done);
        });
        it("verifies content host timestamp was added under the Content Host timestamp schema", done => {
            const dbKey = TaoDB.getContentHostTimestampKey({
                hostsPublicKey: actorA.publicKey,
                contentType: content.contentType,
                contentMetadataDatKey: content.metadataDatKey
            });
            aoP2P.taodb
                .get(dbKey)
                .then((value: ITaoDB_ContentHost_Timestamp) => {
                    expect(value).to.not.be.empty;
                    expect(value.contentDatKey).to.equal(content.fileDatKey);
                    expect(value.contentHostId).to.equal(content.contentHostId);
                    expect(value.timestamp).to.be.a("number");
                    expect(value.timestamp).to.be.lessThan(Date.now());
                    done();
                })
                .catch(done);
        });
        it("verifies content host exists", done => {
            aoP2P.router.emit("/p2p/content/getContentHosts", {
                data: { content },
                respond: (results: Array<NetworkContentHostEntry>) => {
                    expect(results.length).to.equal(1);
                    const contentHost = results[0];
                    expect(contentHost.nodePublicKey).to.equal(
                        actorA.publicKey
                    );
                    done();
                },
                reject: done
            });
        });
    });

    describe("Decryption key handoff, actorB purchases registered content from actorA", async () => {
        let encryptedKeyAndSignature;

        before(async () => {
            const contentDecryptParams = {
                contentDecryptionKey: content.decryptionKey,
                contentRequesterPublicKey: actorB.publicKey,
                contentOwnersPrivateKey: actorA.privateKey
            };
            encryptedKeyAndSignature = await AOCrypto.generateContentEncryptionKeyForUser(
                contentDecryptParams
            );
        });

        it("should insert index data with decryption key handoff", done => {
            const handoffData: AOP2P_Write_Decryption_Key_Data = {
                content,
                buyersPublicKey: actorB.publicKey,
                hostsPublicKey: actorA.publicKey,
                encryptedDecryptionKey:
                    encryptedKeyAndSignature.encryptedDecryptionKey,
                encryptedKeySignature:
                    encryptedKeyAndSignature.encryptedDecryptionKeySignature
            };
            aoP2P.router.emit("/p2p/decryptionKeyHandoff", {
                data: handoffData,
                respond: () => {
                    done();
                },
                reject: done
            });
        });

        it("verifies decryption key handoff for actorB", done => {
            const dbKey = TaoDB.getContentHostIndexDataKey({
                hostsPublicKey: actorA.publicKey,
                contentDatKey: content.fileDatKey,
                contentMetadataDatKey: content.metadataDatKey,
                contentType: content.contentType
            });
            aoP2P.taodb
                .get(dbKey)
                .then((indexData: ITaoDB_ContentHost_IndexData) => {
                    expect(indexData).to.not.be.empty;
                    const actorBIndexData = indexData[actorB.publicKey];
                    expect(actorBIndexData).to.not.be.empty;
                    expect(actorBIndexData.decryptionKey).to.not.be.empty;
                    AOCrypto.decryptMessage({
                        message: actorBIndexData.decryptionKey,
                        privateKey: actorB.privateKey
                    })
                        .then(decryptionKey => {
                            expect(decryptionKey).to.equal(
                                content.decryptionKey
                            );
                            done();
                        })
                        .catch(done);
                })
                .catch(done);
        });

        // it("logs some shit", done => {
        //     aoP2P.taodb
        //         .list("AO", { recursive: true })
        //         .then(data => {
        //             console.log(data);
        //             done();
        //         })
        //         .catch(done);
        // });
    });
});
