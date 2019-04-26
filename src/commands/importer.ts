import DataImport from "../modules/fs/DataImport";
import { ICoreOptions } from "..";
import fs from "fs-extra";
import yesno from "yesno";

export default async (argv: ICoreOptions, inputPath: string) => {
    // Make sure the path exists
    try {
        const stats = fs.statSync(argv.storageLocation);
        if (!stats.isDirectory()) {
            console.error(
                `The data storage location provided does not exist or is not a directory: ${
                    argv.storageLocation
                }`
            );
            return;
        }
        const inputFileStats = fs.statSync(inputPath);
        if (!inputFileStats.isFile()) {
            console.error(`The import path is not valid: ${inputPath}`);
            return;
        }
        // Prompt user to ensure overwrite
        try {
            const proceed = await yesno.ask(
                `This action will overwrite ${
                    argv.storageLocation
                }, are you sure?`,
                false
            );
            if (!proceed) {
                throw new Error("Overwrite canceled");
            }
            await DataImport({
                storageLocation: argv.storageLocation,
                inputPath
            });
        } catch (error) {
            console.error(error.message);
            return;
        }
        console.log(`import succeeded`);
    } catch (error) {
        console.error(error.message);
    }
};
