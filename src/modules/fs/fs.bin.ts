#!/usr/local/bin/node
"use strict";

import AOFS from "./fs";
import minimist = require("minimist");
import path from "path";
import { AORouterSubprocessArgs } from "../../router/AORouterInterface";

var argv: AORouterSubprocessArgs = minimist<AORouterSubprocessArgs>(
    process.argv.slice(2),
    {
        default: {
            storageLocation: path.resolve(__dirname, "../..", "data")
        }
    }
);

if (require.main === module) {
    new AOFS(argv);
}
