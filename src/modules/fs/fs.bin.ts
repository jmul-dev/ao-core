#!/usr/local/bin/node
"use strict";

import AOFS from "./fs";
import minimist = require("minimist");
import path from "path";
import ffprobeStatic from "ffprobe-static";
import { AORouterSubprocessArgs } from "../../router/AORouterInterface";

var argv: AORouterSubprocessArgs = minimist<AORouterSubprocessArgs>(
    process.argv.slice(2),
    {
        default: {
            storageLocation: path.resolve(__dirname, "../..", "data"),
            ffprobeBin: ffprobeStatic.path
        }
    }
);

if (require.main === module) {
    new AOFS(argv);
}
