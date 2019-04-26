import DataExport from "../modules/fs/DataExport";
import { ICoreOptions } from "..";
import fs from "fs-extra";

export default async (argv: ICoreOptions, outputPath: string) => {
    // Make sure the path exists
    try {
        const stats = fs.statSync(argv.storageLocation);
        if (!stats.isDirectory()) {
            throw new Error(
                `The data storage location provided does not exist or is not a directory: ${
                    argv.storageLocation
                }`
            );
        }
        await DataExport({
            storageLocation: argv.storageLocation,
            outputPath
        });
        console.log(`export succeeded`);
    } catch (error) {
        console.error(error.message);
    }
};
