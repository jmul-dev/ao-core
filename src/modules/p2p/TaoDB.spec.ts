import "mocha";
import { expect } from "chai";
import AOContent, { AOVideoContent } from "../../models/AOContent";
import TaoDB, {
    ITaoDB_ContentHost_IndexData_Entry,
    ITaoDB_ContentHost_IndexData,
    ITaoDB_ContentHost_Timestamp
} from "./TaoDB";
import * as AOCrypto from "../../AOCrypto";
import EthCrypto from "eth-crypto";
import ram from "random-access-memory";
import { IAODB_Args } from "./AODB";

describe("TaoDB module", () => {
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
        decryptionKey: "0xDEADBEEF",
        baseChallenge: "0xBASECHALLANGE"
    };
    let content = AOContent.fromObject(contentJson);

    const baseChallengeHash = AOCrypto.generateContentBaseChallengeHash({
        baseChallenge: content.fileChecksum,
        contractAddress: "0x0000"
    });
    content.baseChallengeSignature = AOCrypto.generateBaseChallengeSignature({
        baseChallengeHash,
        privateKey: actorA.privateKey
    });

    let taoDb: TaoDB;
    let taoDbForActorB: TaoDB;

    before(function(done) {
        /**
         * Setup two instances of aodb
         * Storing this db in ram, no need to persist
         */
        taoDb = new TaoDB();
        let aodbOptions: IAODB_Args = {
            dbKey: undefined,
            dbPath: function(filename) {
                return ram();
            }
        };
        taoDb
            .start(aodbOptions)
            .then(dbKey => {
                taoDbForActorB = new TaoDB();
                taoDbForActorB
                    .start({
                        dbKey,
                        dbPath: function(filename) {
                            return ram();
                        }
                    })
                    .then(dbKey => {
                        done();
                    })
                    .catch(done);
            })
            .catch(done);
    });

    it("sets user context and registers schemas for actorA", () => {
        taoDb.setUserIdentity(actorA);
    });

    it("sets user context and registers schemas for actorB", () => {
        taoDbForActorB.setUserIdentity(actorB);
    });

    describe("User Content Schema", () => {
        const dbKey = TaoDB.getUserContentSignatureKey({
            usersPublicKey: actorA.publicKey,
            contentMetadataDatKey: content.metadataDatKey,
            contentType: content.contentType
        });
        it("should reflect correct db insert path", () => {
            expect(dbKey).to.equal(
                `${actorA.publicKey}/AO/Content/${content.contentType}/${
                    content.metadataDatKey
                }/signature`
            );
        });
        it("inserts content under user content schema", done => {
            taoDb
                .insertUserContentSignature({ content })
                .then(done)
                .catch(done);
        });
        it("signature recovery reflects actorA", done => {
            taoDb
                .get(dbKey)
                .then(value => {
                    expect(value).to.equal(content.baseChallengeSignature);
                    const recoveredPublicKey = EthCrypto.recoverPublicKey(
                        value,
                        baseChallengeHash
                    );
                    expect(recoveredPublicKey).to.equal(actorA.publicKey);
                    done();
                })
                .catch(done);
        });
    });

    describe("Content Host Schema - indexData", () => {
        const dbKey = TaoDB.getContentHostIndexDataKey({
            hostsPublicKey: actorA.publicKey,
            contentDatKey: content.fileDatKey,
            contentMetadataDatKey: content.metadataDatKey,
            contentType: content.contentType
        });

        let indexDataForActorB: ITaoDB_ContentHost_IndexData_Entry;
        let indexDataForActorC: ITaoDB_ContentHost_IndexData_Entry;

        it("inserts content host indexData (assumes actorB purchased, actorA wrote indexData)", done => {
            AOCrypto.generateContentEncryptionKeyForUser({
                contentDecryptionKey: content.decryptionKey,
                contentOwnersPrivateKey: actorA.privateKey,
                contentRequesterPublicKey: actorB.publicKey
            })
                .then(
                    ({
                        encryptedDecryptionKey,
                        encryptedDecryptionKeySignature
                    }) => {
                        indexDataForActorB = {
                            signature: encryptedDecryptionKeySignature,
                            decryptionKey: encryptedDecryptionKey
                        };
                        taoDb
                            .insertContentHostIndexData({
                                content,
                                indexData: {
                                    [actorB.publicKey]: indexDataForActorB
                                }
                            })
                            .then(done)
                            .catch(done);
                    }
                )
                .catch(done);
        });

        it("verifies content host indexData was written for actorB", done => {
            taoDb
                .get(dbKey)
                .then((indexData: ITaoDB_ContentHost_IndexData) => {
                    expect(indexData).to.not.be.empty;
                    const entry: ITaoDB_ContentHost_IndexData_Entry =
                        indexData[actorB.publicKey];
                    expect(entry).to.not.be.empty;
                    expect(entry.decryptionKey).to.equal(
                        indexDataForActorB.decryptionKey
                    );
                    expect(entry.signature).to.equal(
                        indexDataForActorB.signature
                    );
                    // Double check that actorA signed this decryption key
                    const signersPublicKey = EthCrypto.recoverPublicKey(
                        entry.signature,
                        EthCrypto.hash.keccak256(entry.decryptionKey)
                    );
                    expect(signersPublicKey).to.equal(actorA.publicKey);
                    done();
                })
                .catch(done);
        });

        it("inserts content host indexData (assumes actorB purchased, actorA wrote indexData)", done => {
            AOCrypto.generateContentEncryptionKeyForUser({
                contentDecryptionKey: content.decryptionKey,
                contentOwnersPrivateKey: actorA.privateKey,
                contentRequesterPublicKey: actorC.publicKey
            })
                .then(
                    ({
                        encryptedDecryptionKey,
                        encryptedDecryptionKeySignature
                    }) => {
                        indexDataForActorC = {
                            signature: encryptedDecryptionKeySignature,
                            decryptionKey: encryptedDecryptionKey
                        };
                        // NOTE: normally this would append to the existing index data but we are skipping that logic
                        taoDb
                            .insertContentHostIndexData({
                                content,
                                indexData: {
                                    [actorB.publicKey]: indexDataForActorB,
                                    [actorC.publicKey]: indexDataForActorC
                                }
                            })
                            .then(done)
                            .catch(done);
                    }
                )
                .catch(done);
        });

        it("verifies content host indexData exists for both actorB & actorC", done => {
            taoDb
                .get(dbKey)
                .then((indexData: ITaoDB_ContentHost_IndexData) => {
                    expect(indexData).to.not.be.empty;
                    const entryB: ITaoDB_ContentHost_IndexData_Entry =
                        indexData[actorB.publicKey];
                    expect(entryB).to.not.be.empty;
                    expect(entryB.decryptionKey).to.equal(
                        indexDataForActorB.decryptionKey
                    );
                    expect(entryB.signature).to.equal(
                        indexDataForActorB.signature
                    );
                    const entryC: ITaoDB_ContentHost_IndexData_Entry =
                        indexData[actorC.publicKey];
                    expect(entryC).to.not.be.empty;
                    expect(entryC.decryptionKey).to.equal(
                        indexDataForActorC.decryptionKey
                    );
                    expect(entryC.signature).to.equal(
                        indexDataForActorC.signature
                    );
                    done();
                })
                .catch(done);
        });

        // it("fails to insert content host indexData for invalid writerAddress", done => {
        //     const invalidKey = 'AO/Content/VOD/8612c0ae1c97c5133ad0d67c87ddd84c3f0c7c520a92676e11ed16817c93004a/Hosts/7aa8f10d143791b251b41cf36f2e58a87a0c12ca51a05ad18a4df77864741ea93ef9fb14e816b4acfbb9cf0f00c61da689782a29c46dc60a663d6730c6fbc480/514bbdf84fa1008cca3903080bca77698d25b3fc42e45af3a76afd04df050794/indexData'

        // })
    });

    describe("Content Host Schema - timestamps", () => {
        it("inserts timestamp for content host", done => {
            taoDb
                .insertContentHostTimestamp({ content })
                .then(done)
                .catch(done);
        });
        it("verifies timestamp was written for content host", done => {
            const timestampKey = TaoDB.getContentHostTimestampKey({
                hostsPublicKey: actorA.publicKey,
                contentType: content.contentType,
                contentMetadataDatKey: content.metadataDatKey
            });
            taoDb
                .get(timestampKey)
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
    });

    describe("Permissions", () => {
        before(() => {
            taoDb.setUserIdentity(actorB);
        });

        it("verifies timestamp was written for content host", done => {
            const timestampKey = TaoDB.getContentHostTimestampKey({
                hostsPublicKey: actorA.publicKey,
                contentType: content.contentType,
                contentMetadataDatKey: content.metadataDatKey
            });
            taoDb
                .get(timestampKey)
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

        it("should let actorB query for indexData that was written by actorA", done => {
            const dbKey = TaoDB.getContentHostIndexDataKey({
                hostsPublicKey: actorA.publicKey,
                contentDatKey: content.fileDatKey,
                contentMetadataDatKey: content.metadataDatKey,
                contentType: content.contentType
            });

            taoDb
                .get(dbKey)
                .then(indexData => {
                    console.log(indexData);
                    done();
                })
                .catch(done);
        });
    });

    // TODO: test replication to actorB's instance of taodb
});
