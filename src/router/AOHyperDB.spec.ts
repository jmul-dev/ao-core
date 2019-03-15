import "mocha";
import { expect } from "chai";
import AOContent from "../models/AOContent";
import AOHyperDB, { AO_Hyper_Options, AODB_Node } from "./AOHyperDB";
import * as AOCrypto from "../AOCrypto";
import EthCrypto from "eth-crypto";
import ram from "random-access-memory";

describe("TaoDB module", () => {
    const actorA: AOCrypto.Identity = AOCrypto.createUserIdentity();
    const actorADecryptionKey = "teeeesting123";
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
            // Content Host signature schema
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
        },
        {
            // Content Host indexData schema
            type: "add-schema",
            key: "schema/AO/Content/*/*/Hosts/%writerAddress%/*/indexData",
            value: {
                keySchema: "AO/Content/*/*/Hosts/%writerAddress%/*/indexData",
                valueValidationKey: "",
                keyValidation: ""
            },
            writerSignature: "",
            writerAddress: ""
        },
        {
            // User Content schema (CLASH)
            type: "add-schema",
            key: "schema/*/AO/Content/*/*/signature",
            value: {
                keySchema: "*/AO/Content/*/*/signature",
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
        it("list of users content space should reflect insert", done => {
            aodb.list(`${actorA.publicKey}`, { recursive: true })
                .then(results => {
                    expect(results[0].key).to.equal(dbKey);
                    done();
                })
                .catch(done);
        });
        it.skip("should not allow actorB to write to actorA's content space", done => {
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
        it("should not allow actorB to write to actorA's content space under malicous schema", done => {
            const malicousValue =
                "I am inserting a fake signature on top of you";
            const writerSignature = aodbSignature({
                privateKey: actorB.privateKey,
                key: dbKey,
                value: malicousValue
            });
            aodb.insert({
                key: dbKey,
                value: malicousValue,
                writerSignature,
                writerAddress: actorB.publicKey,
                schemaKey: aodbSchemas[3].key
            })
                .then(() => {
                    // Insert should have failed, but lets check the actual data to be sure
                    aodb.list(dbKey)
                        .then((nodes: Array<AODB_Node<any>>) => {
                            expect(nodes.length).to.equal(1);
                            expect(nodes[0].key).to.equal(dbKey);
                            expect(nodes[0].value).to.equal(dbValue);
                            done();
                        })
                        .catch(done);
                    // done(
                    //     new Error(
                    //         `actorB should not be allowed to write to actorA's content space under malicous schema`
                    //     )
                    // );
                })
                .catch(error => {
                    expect(error).to.be.instanceOf(Error);
                    done();
                });
        });
        it("inserts content under user content schema (actorB)", done => {
            const dbKey = `${actorB.publicKey}/AO/Content/${
                content.contentType
            }/${content.metadataDatKey}/signature`;
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
                .then(done)
                .catch(done);
        });
    });

    describe("Content Host Schema", () => {
        // schema/AO/Content/*/*/Hosts/%writerAddress%/*/indexData/signature
        const dbKey = `AO/Content/${content.contentType}/${
            content.metadataDatKey
        }/Hosts/${actorA.publicKey}/${content.fileDatKey}/indexData/signature`;
        const dbValue = EthCrypto.hash.keccak256(content);

        it("inserts content under content host schema", done => {
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
                schemaKey: aodbSchemas[1].key
            })
                .then(done)
                .catch(done);
        });
        it("verifies content host insert exists", done => {
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
        it.skip("should not allow actorB to write to actorA's content space", done => {
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

    describe("Content Host indexData", () => {
        const indexData = {
            signature: "signatureofdecryptionkey",
            decryptionKey: "thekeytoencryptedcontent"
        };
        const dbKey = `AO/Content/${content.contentType}/${
            content.metadataDatKey
        }/Hosts/${actorA.publicKey}/${content.fileDatKey}/indexData`;
        const dbValue = indexData;

        it("inserts content indexData under content host schema", done => {
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
                schemaKey: aodbSchemas[2].key
            })
                .then(done)
                .catch(done);
        });
        it("verifies content host insert exists", done => {
            aodb.exists(dbKey)
                .then(exists => {
                    expect(exists).to.be.true;
                    done();
                })
                .catch(done);
        });
        it("verifies the content indexData inserted", done => {
            aodb.query(dbKey)
                .then(value => {
                    expect(value).to.be.an.instanceOf(Object);
                    expect(value.signature).to.equal(dbValue.signature);
                    expect(value.decryptionKey).to.equal(dbValue.decryptionKey);
                    done();
                })
                .catch(done);
        });
    });
});
