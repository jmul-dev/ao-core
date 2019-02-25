import AOFS, { IAOFS_WriteStream_Data } from "./fs";
import fs from "fs";
import path from "path";
import { expect } from "chai";
import "mocha";

describe("AOFS methods", () => {
    // faking process.send
    process.send = () => {};
    process.on("unhandledRejection", (reason, p) => {
        console.log("Unhandled Rejection at: Promise", p, "reason:", reason);
        // application specific logging, throwing an error, or other logic here
    });

    const tmpDir = path.resolve(__dirname, "test");
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
    });
    after(function() {
        fs.rmdirSync(tmpDir);
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
});
