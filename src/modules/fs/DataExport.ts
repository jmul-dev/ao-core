import fs from "fs-extra";
import path from "path";
import archiver from "archiver";
import md5 from "md5";

/**
 *
 * @returns {string} Full path to the exported zip
 */
export default async function({ storageLocation, outputPath }): Promise<any> {
    return new Promise((resolve, reject) => {
        let rando: string = md5(new Date()).substring(0, 6);
        const exportFilename: string = `ao-export-${rando}.zip`;
        const exportFullPath: string = path.resolve(outputPath, exportFilename);
        const output = fs.createWriteStream(exportFullPath);
        const archive = archiver("zip", {
            zlib: { level: 9 }
        });
        output.on("close", () => {
            console.log(
                archive.pointer() + " total bytes zipped, export complete"
            );
            resolve(exportFullPath);
        });
        archive.on("error", err => {
            reject(err);
        });
        archive.pipe(output);
        archive.directory(storageLocation, false);
        archive.finalize();
    });
}
