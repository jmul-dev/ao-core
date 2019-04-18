import "mocha";
import path from "path";
import AODat from "./dat";
import rimraf from "rimraf";
import fs from "fs";
import { expect } from "chai";

describe("AO Dat module", () => {
    const tmpDir = path.resolve(__dirname, "test");
    const unreachableDatKey =
        "ab7e9f8f02c1422eda40984ef23da0c6c3c714b000125ff86b10fdd7246ef724";
    const reachableDatKey =
        "1f5f36d68354dbc3ba3f64522f94faee61ea5dc471e8d4695a401d61ac99f5d1";
    let aoDat;

    before(function(done) {
        process.send = () => {};
        aoDat = new AODat({
            storageLocation: tmpDir,
            // unused args, making typescript happy
            httpOrigin: "string",
            coreOrigin: "string",
            corePort: 9999,
            ffprobeBin: "string",
            ethNetworkRpc: ""
        });
        // Faking the router send method
        aoDat.router.send = (route, message) => {
            return Promise.resolve();
        };
        fs.mkdirSync(tmpDir);
        fs.mkdirSync(path.join(tmpDir, "content"));
        aoDat.router.emit("/dat/init", {
            data: {
                ethNetworkId: "4"
            },
            respond: () => {
                done();
            },
            reject: done
        });
    });

    after(function(done) {
        rimraf(tmpDir, done);
    });

    // describe("Dat downloads", () => {
    //     it("should download reachable dat, resolve on download complete", done => {
    //         aoDat.router.emit("/dat/download", {
    //             data: {
    //                 key: reachableDatKey,
    //                 resolveOnDownloadCompletion: true
    //             },
    //             respond: ({ key }) => {
    //                 expect(key).to.equal(reachableDatKey);
    //                 done();
    //             },
    //             reject: done
    //         });
    //     }).timeout(30000);

    //     it("downloaded files should exist", () => {
    //         expect(
    //             fs.existsSync(
    //                 path.join(
    //                     tmpDir,
    //                     "content",
    //                     reachableDatKey,
    //                     "featuredImage.png"
    //                 )
    //             )
    //         ).to.be.true;
    //         expect(
    //             fs.existsSync(
    //                 path.join(
    //                     tmpDir,
    //                     "content",
    //                     reachableDatKey,
    //                     "content.json"
    //                 )
    //             )
    //         ).to.be.true;
    //     });

    //     it("should return stats for previously downloaded dat", done => {
    //         aoDat.router.emit("/dat/stats", {
    //             data: {
    //                 key: reachableDatKey
    //             },
    //             respond: ({ files, complete, joinedNetwork, version }) => {
    //                 expect(files).to.equal(2);
    //                 expect(complete).to.be.true;
    //                 expect(joinedNetwork).to.be.true;
    //                 done();
    //             },
    //             reject: done
    //         });
    //     }).timeout(5000);

    //     it("should fail to download unreachable dat", done => {
    //         aoDat.router.emit("/dat/download", {
    //             data: {
    //                 key: unreachableDatKey
    //             },
    //             respond: () => {
    //                 done(new Error(`should not have downloaded`));
    //             },
    //             reject: () => {
    //                 done();
    //             }
    //         });
    //     }).timeout(10000);
    // });

    describe("Dat uploads", () => {
        let newDatDir = null;
        let newDatKey = null;
        let datDir = null;

        it("should initialize a new dat", done => {
            newDatDir = path.join(tmpDir, "content", "upload");
            fs.mkdirSync(newDatDir);
            fs.writeFileSync(
                path.join(newDatDir, ".datignore"),
                "# ignore\nunpacked\n",
                { encoding: "utf8" }
            );
            fs.writeFileSync(
                path.join(newDatDir, "test.json"),
                JSON.stringify({ hello: "world" })
            );
            aoDat.router.emit("/dat/create", {
                data: {
                    newDatDir: path.join("upload")
                },
                respond: ({ key, complete, dir }) => {
                    expect(key).to.not.be.empty;
                    expect(complete).to.be.true;
                    expect(dir).to.equal("upload");
                    newDatKey = key;
                    datDir = path.join(tmpDir, "content", key);
                    done();
                },
                reject: done
            });
        }).timeout(10000);

        it("should move from upload folder to content dat folder", () => {
            fs.renameSync(newDatDir, datDir);
        });

        it("should read test.json", done => {
            try {
                const data = fs.readFileSync(path.join(datDir, "test.json"), {
                    encoding: "utf8"
                });
                const json = JSON.parse(data);
                expect(json.hello).to.equal("world");
                done();
            } catch (error) {
                done(error);
            }
        });

        it("should resume the newly created dat", done => {
            aoDat.router.emit("/dat/resumeSingle", {
                data: {
                    key: newDatKey
                },
                respond: ({ key, complete }) => {
                    expect(key).to.not.be.empty;
                    expect(complete).to.be.true;
                    newDatKey = key;
                    done();
                },
                reject: done
            });
        }).timeout(10000);

        it("should return stats for newly created dat", done => {
            // timeout allows dat to run importFiles on the resumed dat
            // in order to update stats
            setTimeout(() => {
                aoDat.router.emit("/dat/stats", {
                    data: {
                        key: newDatKey
                    },
                    respond: ({ files, complete, joinedNetwork, version }) => {
                        expect(files).to.equal(1);
                        expect(complete).to.be.true;
                        expect(joinedNetwork).to.be.true;
                        done();
                    },
                    reject: done
                });
            }, 5000);
        }).timeout(15000);
    });
});
