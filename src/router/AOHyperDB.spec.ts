import "mocha";
import { expect } from "chai";
import AOContent from "../models/AOContent";
import AOHyperDB, { AO_Hyper_Options } from "./AOHyperDB";
import * as AOCrypto from "../AOCrypto";
import EthCrypto from "eth-crypto";
import ram from "random-access-memory";

/**
 * Active questions:
 *
 * 1. There seems to be some confusion around the difference
 * between address and publicKey where `writerAddress` is actually
 * referring to the users `publicKey`.
 */

describe("AO P2P module", () => {
    const actorA: AOCrypto.Identity = AOCrypto.createUserIdentity();
    const actorADecryptionKey = "teeeesting123";
    const actorB: AOCrypto.Identity = AOCrypto.createUserIdentity();
    const dbNameSpace = "/AOSpace/";
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
    const aodbSchemas = [
        {
            // User Content schema
            type: "add-schema",
            key: "schema/%writerAddress%/AO/Content/*/*/signature",
            value: {
                keySchema: "%writerAddress%/AO/Content/*/*/signature",
                valueValidationKey: "",
                keyValidation: ""
            },
            writerSignature: "",
            writerAddress: ""
        },
        {
            // Content Host schema
            type: "add-schema",
            key:
                "schema/AO/Content/*/*/Hosts/%writerAddress%/*/indexData/signature",
            value: {
                keySchema:
                    "AO/Content/*/*/Hosts/%writerAddress%/*/indexData/signature",
                valueValidationKey: "",
                keyValidation: ""
            },
            writerSignature: "",
            writerAddress: ""
        }
    ];
    let aodb: AOHyperDB;
    let aodbSignature = ({ privateKey, key, value }): string => {
        return EthCrypto.sign(privateKey, aodb.createSignHash(key, value));
    };

    before(function(done) {
        // Storing this db in ram, no need to persist
        aodb = new AOHyperDB();
        let aodbOptions: AO_Hyper_Options = {
            dbKey: undefined,
            dbPath: function(filename) {
                return ram();
            }
        };
        aodb.init(aodbOptions)
            .then(done)
            .catch(done);
    });

    it("registers content schemas for actor A", done => {
        const batchList = [];
        for (let i = 0; i < aodbSchemas.length; i++) {
            let schema = Object.assign({}, aodbSchemas[i]);
            schema.writerAddress = actorA.publicKey;
            schema.writerSignature = aodbSignature({
                privateKey: actorA.privateKey,
                key: schema.key,
                value: schema.value
            });
            batchList.push(schema);
            // Just making sure...
            const messageHash = aodb.createSignHash(schema.key, schema.value);
            const recoveredPublicKey = EthCrypto.recoverPublicKey(
                schema.writerSignature,
                messageHash
            );
            expect(recoveredPublicKey).to.equal(actorA.publicKey);
        }
        // console.log(batchList);
        aodb.batchInsert(batchList)
            .then(done)
            .catch(done);
    });

    describe("User Content Schema", () => {
        const dbKey = `${actorA.publicKey}/AO/Content/${content.contentType}/${
            content.metadataDatKey
        }/signature`;
        const dbValue = EthCrypto.hash.keccak256(content);

        it("inserts content under user content schema", done => {
            const writerSignature = aodbSignature({
                privateKey: actorA.privateKey,
                key: dbKey,
                value: dbValue
            });
            aodb.insert({
                key: dbKey,
                value: dbValue,
                writerSignature,
                writerAddress: actorA.publicKey,
                schemaKey: aodbSchemas[0].key
            })
                .then(done)
                .catch(done);
        });
        it("verifies user content insert exists", done => {
            aodb.exists(dbKey)
                .then(exists => {
                    expect(exists).to.be.true;
                    done();
                })
                .catch(done);
        });
        it("verifies the content inserted", done => {
            aodb.query(dbKey)
                .then(value => {
                    expect(value).to.equal(dbValue);
                    done();
                })
                .catch(done);
        });
        it("should not allow actorB to write to actorA's content space", done => {
            const writerSignature = aodbSignature({
                privateKey: actorB.privateKey,
                key: dbKey,
                value: dbValue
            });
            aodb.insert({
                key: dbKey,
                value: dbValue,
                writerSignature,
                writerAddress: actorB.publicKey,
                schemaKey: aodbSchemas[0].key
            })
                .then(() => {
                    done(
                        new Error(
                            `actorB should not be allowed to write to actorA's content space`
                        )
                    );
                })
                .catch(error => {
                    expect(error).to.be.instanceOf(Error);
                    done();
                });
        });
    });

    // it("inserts content under content host schema", done => {});
});
