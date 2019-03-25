import "mocha";
import { expect } from "chai";
import AOContent from "../../models/AOContent";
import TaoDB from "./TaoDB";
import * as AOCrypto from "../../AOCrypto";
import EthCrypto from "eth-crypto";
import ram from "random-access-memory";
import { IAODB_Args } from "./AODB";

describe("TaoDB module", () => {
    const actorA: AOCrypto.Identity = AOCrypto.createUserIdentity();
    const actorB: AOCrypto.Identity = AOCrypto.createUserIdentity();
    const contentJson = {
        id: "4dafd6582efbbfe913c4202cf926b700b3f5700ccebe1faf10d5f61e1e5ffda8",
        nodeId: "0x9c7caa71129f534223107e4486ed48afd85de5d6",
        creatorId: "0x9c7caa71129f534223107e4486ed48afd85de5d6",
        metadataDatKey:
            "b7e815da776b9d1610e710bf2e8eca3f8d1972112f62f49997ca3281b73a75ee",
        contentType: "VOD",
        isFolder: false,
        isMutable: false,
        title: "asdfasdf",
        description: "asd fasdf asdf",
        stake: 12092665,
        profit: 10,
        createdAt: 1536254388663,
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
        metadata: { duration: "24.824800", resolution: 1080, encoding: "h264" }
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
});
