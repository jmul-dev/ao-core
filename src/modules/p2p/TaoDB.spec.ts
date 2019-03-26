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
        nodeId: actorA.publicKey,
        nodeEthAddress: actorA.address,
        creatorNodeId: actorA.publicKey,
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
    content.baseChallenge = EthCrypto.hash.keccak256(
        "base challenge of fake content"
    );
    content.baseChallengeSignature = AOCrypto.generateBaseChallengeSignature({
        baseChallenge: content.baseChallenge,
        privateKey: actorA.privateKey
    });

    let taoDB: TaoDB;

    before(function(done) {
        // Storing this db in ram, no need to persist
        taoDB = new TaoDB();
        let aodbOptions: IAODB_Args = {
            dbKey: undefined,
            dbPath: function(filename) {
                return ram();
            }
        };
        taoDB
            .start(aodbOptions)
            .then(done)
            .catch(done);
    });

    it("sets user context and registers schemas", done => {
        taoDB
            .setUserIdentity(actorA)
            .then(done)
            .catch(done);
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
            taoDB
                .insertUserContentSignature({ content })
                .then(done)
                .catch(done);
        });
        it("signature recovery reflects actorA", done => {
            taoDB
                .get(dbKey)
                .then(value => {
                    expect(value).to.equal(content.baseChallengeSignature);
                    const recoveredPublicKey = EthCrypto.recoverPublicKey(
                        value,
                        content.baseChallenge
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
                        taoDB
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
            taoDB
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
                        taoDB
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
            taoDB
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
    });

    describe("Content Host Schema - timestamps", () => {
        it("inserts timestamp for content host", done => {
            taoDB
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
            taoDB
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
});
