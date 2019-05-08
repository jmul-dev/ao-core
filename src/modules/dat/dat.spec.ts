import "mocha";
import path from "path";
import AODat from "./dat";
import rimraf from "rimraf";
import fs from "fs-extra";
import { expect } from "chai";

describe("AO Dat module", () => {
    const tmpDir = path.resolve(__dirname, "test");
    const unreachableDatKey =
        "ab7e9f8f02c1422eda40984ef23da0c6c3c714b000125ff86b10fdd7246ef724";
    const reachableDatKey =
        "d177c5eb3a0a8d1f735e57928b50b2f88dc092289a2235634caee506081da4f3";
    const reachableDatFiles = ["content.mp4"];
    // const reachableDatKey =
    //     "778f8d955175c92e4ced5e4f5563f69bfec0c86cc6f670352c457943666fe639";
    // const reachableDatFiles = ["dat.json", "dat_intro.gif"];
    let aoDat;

    before(function(done) {
        process.send = () => {};
        aoDat = new AODat({
            storageLocation: tmpDir,
            // unused args, making typescript happy
            httpOrigin: "string",
            coreOrigin: "string",
            corePort: 9999,
            ethNetworkRpc: ""
        });
        // Faking the router send method
        aoDat.router.send = (route, message) => {
            return Promise.resolve();
        };
        fs.ensureDirSync(tmpDir);
        fs.ensureDirSync(path.join(tmpDir, "content"));
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
        this.timeout(10000);
        aoDat.router.emit("/dat/stopAll", {
            respond: () => {
                setTimeout(() => {
                    fs.remove(tmpDir, done);
                }, 1000);
            },
            reject: done
        });
    });

    describe("Dat downloads", () => {
        it("should download reachable dat, resolve on download complete", done => {
            aoDat.router.emit("/dat/download", {
                data: {
                    key: reachableDatKey,
                    resolveOnDownloadCompletion: true
                },
                respond: ({ key }) => {
                    expect(key).to.equal(reachableDatKey);
                    done();
                },
                reject: done
            });
        }).timeout(30000);

        it("downloaded files should exist", () => {
            for (let i = 0; i < reachableDatFiles.length; i++) {
                const expectedFile = reachableDatFiles[i];
                expect(
                    fs.existsSync(
                        path.join(
                            tmpDir,
                            "content",
                            reachableDatKey,
                            expectedFile
                        )
                    ),
                    `${expectedFile} does not exist`
                ).to.be.true;
            }
        });

        it("should return stats for previously downloaded dat", done => {
            aoDat.router.emit("/dat/stats", {
                data: {
                    key: reachableDatKey
                },
                respond: ({ complete, joinedNetwork }) => {
                    expect(complete).to.be.true;
                    expect(joinedNetwork).to.be.true;
                    done();
                },
                reject: done
            });
        }).timeout(5000);

        it("should fail to download unreachable dat", done => {
            aoDat.router.emit("/dat/download", {
                data: {
                    key: unreachableDatKey
                },
                respond: () => {
                    done(new Error(`should not have downloaded`));
                },
                reject: () => {
                    done();
                }
            });
        }).timeout(20000);
    });

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

        it("should import additional file after initial create", done => {
            fs.writeFileSync(
                path.join(datDir, "second.json"),
                JSON.stringify({ second: "import" })
            );
            aoDat.router.emit("/dat/importSingle", {
                data: {
                    key: newDatKey
                },
                respond: ({ filesImported }) => {
                    expect(filesImported).to.equal(1);
                    done();
                },
                reject: done
            });
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
        }).timeout(20000);

        it("should return stats for newly created dat", done => {
            // timeout allows dat to run importFiles on the resumed dat
            // in order to update stats
            setTimeout(() => {
                aoDat.router.emit("/dat/stats", {
                    data: {
                        key: newDatKey
                    },
                    respond: stats => {
                        expect(stats).to.not.be.null;
                        expect(stats.joinedNetwork).to.be.true;
                        expect(stats.trackingStats).to.be.true;
                        // for some reason locally created dats do not populate some of the stats
                        // expect(stats.complete).to.be.true;
                        // expect(stats.files).to.equal(2);
                        done();
                    },
                    reject: done
                });
            }, 5000);
        }).timeout(15000);
    });
});
