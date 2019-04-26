import fs from "fs-extra";
import unzipper from "unzipper";

export default async function({ storageLocation, inputPath }): Promise<any> {
    return new Promise((resolve, reject) => {
        fs.remove(storageLocation, err => {
            if (err) {
                reject(err);
                return null;
            }
            const unzip = unzipper.Extract({ path: storageLocation });
            const input = fs.createReadStream(inputPath);
            input.pipe(unzip);
            input.on("error", error => {
                reject(error);
            });
            unzip.on("close", () => {
                resolve();
            });
            unzip.on("error", error => {
                reject(error);
            });
        });
    });
}
