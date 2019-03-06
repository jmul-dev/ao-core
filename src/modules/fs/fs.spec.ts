import AOFS, { IAOFS_WriteStream_Data, IAOFS_ZipStream_Data } from "./fs";
import fs, { ReadStream } from "fs";
import path from "path";
import { expect } from "chai";
import unzipper from "unzipper";
import archiver from "archiver";
import "mocha";
import { Readable } from "stream";
import rimraf from "rimraf";

describe("AOFS methods", () => {
    // faking process.send
    process.send = () => {};
    process.on("unhandledRejection", (reason, p) => {
        console.log("Unhandled Rejection at: Promise", p, "reason:", reason);
        // application specific logging, throwing an error, or other logic here
    });
    // @ts-ignore;
    process.exit = (code?: number) => {
        // ignore for now;
    };

    const tmpDir = path.resolve(__dirname, "test");
    const sampleHtmlFilePath = path.resolve(tmpDir, "sample.html");
    const getFsModuleInstance = (): AOFS => {
        let instance = new AOFS({
            ethNetworkRpc: "string",
            storageLocation: tmpDir,
            httpOrigin: "string",
            coreOrigin: "string",
            corePort: 9999,
            ffprobeBin: "string"
        });
        // faking the router.send method for testing purposes
        instance.router.send = (route, message) => {
            return new Promise((resolve, reject) => {});
        };
        return instance;
    };
    let fsInstance = getFsModuleInstance();

    before(function() {
        fs.mkdirSync(tmpDir);
        fs.writeFileSync(sampleHtmlFilePath, "<html/>");
    });
    after(function(done) {
        rimraf(tmpDir, done);
    });

    it("should write stream to temp directory", done => {
        const expectedWritePath = path.resolve(tmpDir, "writeStream.json");
        const stream = fs.createReadStream(
            path.resolve(__dirname, "package.json")
        );
        const writeStreamParams: IAOFS_WriteStream_Data = {
            stream: stream,
            streamDirection: "write",
            writePath: "writeStream.json",
            encrypt: false,
            videoStats: false
        };
        fsInstance._handleWriteStream({
            id: "1",
            event: "/fs/writeStream",
            data: writeStreamParams,
            respond: () => {
                const fileWritten = fs.existsSync(expectedWritePath);
                expect(fileWritten).to.be.true;
                fs.unlinkSync(expectedWritePath);
                done();
            },
            reject: err => {
                done(err);
            }
        });
    });

    it("should fail to find an index.html file in zipped file", done => {
        const zippedFilePath = path.resolve(tmpDir, "dapp.invalid.zip");
        const archive = archiver("zip", {
            zlib: { level: 9 }
        });
        const zippedFileWriteStream = fs.createWriteStream(zippedFilePath);
        archive.on("end", () => {
            const stream = fs.createReadStream(zippedFilePath);
            const writeStreamParams: IAOFS_WriteStream_Data = {
                stream: stream,
                streamDirection: "write",
                writePath: "writeStream.json",
                encrypt: false,
                videoStats: false
            };
            fsInstance._handleCheckZipForIndexHtml({
                id: "1",
                event: "/fs/checkZipForIndexHtml",
                data: writeStreamParams,
                respond: ({ indexFound }) => {
                    expect(indexFound).to.be.false;
                    fs.unlinkSync(zippedFilePath);
                    done();
                },
                reject: err => {
                    done(err);
                }
            });
        });
        archive.on("error", function(err) {
            done(err);
        });
        archive.pipe(zippedFileWriteStream);
        archive.append("<html/>", { name: "src/index.html" });
        archive.append("<html/>", { name: "dapp.html" });
        archive.finalize();
    });

    it("should find an index.html file in zipped file", done => {
        const zippedFilePath = path.resolve(tmpDir, "dapp.zip");
        const archive = archiver("zip", {
            zlib: { level: 9 }
        });
        const zippedFileWriteStream = fs.createWriteStream(zippedFilePath);
        archive.on("end", () => {
            const stream = fs.createReadStream(zippedFilePath);
            const writeStreamParams: IAOFS_WriteStream_Data = {
                stream: stream,
                streamDirection: "write",
                writePath: "writeStream.json",
                encrypt: false,
                videoStats: false
            };
            fsInstance._handleCheckZipForIndexHtml({
                id: "1",
                event: "/fs/checkZipForIndexHtml",
                data: writeStreamParams,
                respond: ({ indexFound }) => {
                    expect(indexFound).to.be.true;
                    fs.unlinkSync(zippedFilePath);
                    done();
                },
                reject: err => {
                    done(err);
                }
            });
        });
        archive.on("error", function(err) {
            done(err);
        });
        archive.pipe(zippedFileWriteStream);
        archive.append("<html/>", { name: "index.html" });
        archive.finalize();
    });

    it("should zip a stream, writing the zipped contents to our provided write stream", done => {
        const zippedFilePath = path.resolve(tmpDir, "dapp.zip");
        const zippedFileWriteStream = fs.createWriteStream(zippedFilePath);
        const htmlContentStream = fs.createReadStream(sampleHtmlFilePath);

        const args: IAOFS_ZipStream_Data = {
            stream: htmlContentStream,
            writeStream: zippedFileWriteStream,
            filenameWithinZip: "index.html"
        };

        fsInstance._handleZipStream({
            id: "1",
            event: "/fs/checkZipForIndexHtml",
            data: args,
            respond: ({ success }) => {
                expect(success).to.be.true;

                // TODO: check the zip
                expect(fs.existsSync(zippedFilePath)).to.be.true;

                fs.unlinkSync(zippedFilePath);
                done();
            },
            reject: err => {
                done(err);
            }
        });
    });
});
