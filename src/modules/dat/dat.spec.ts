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
        "778f8d955175c92e4ced5e4f5563f69bfec0c86cc6f670352c457943666fe639";
    const reachableDatFiles = ["dat_intro.gif", "dat.json"];
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
                    key: reachableDatKey
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
                            "content-4/dats",
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
                respond: ({ connected, progress, files }) => {
                    expect(connected).to.be.true;
                    expect(progress).to.equal(1);
                    expect(files).to.equal(reachableDatFiles.length);
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
            newDatDir = path.join(tmpDir, "content-4", "upload");
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
                    initialImportDir: newDatDir
                },
                respond: ({ key, dir }) => {
                    expect(key).to.not.be.empty;
                    const expectedDatDir = path.join(
                        tmpDir,
                        `content-${4}`,
                        `dats`,
                        key
                    );
                    expect(dir).to.equal(expectedDatDir);
                    newDatKey = key;
                    datDir = expectedDatDir;
                    done();
                },
                reject: done
            });
        }).timeout(10000);

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
                respond: () => {
                    done();
                },
                reject: done
            });
        });

        it("should return stats for newly created dat", done => {
            aoDat.router.emit("/dat/stats", {
                data: {
                    key: newDatKey
                },
                respond: stats => {
                    expect(stats).to.not.be.null;
                    // .datignore, dats.json, test.json, second.json
                    expect(stats.files).to.equal(4);
                    done();
                },
                reject: done
            });
        }).timeout(15000);
    });
});
