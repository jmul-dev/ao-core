#!/usr/local/bin/node
"use strict";

import AOP2P from "./p2p";
import minimist = require("minimist");
import { AORouterSubprocessArgs } from "../../router/AORouterInterface";

var argv: AORouterSubprocessArgs = minimist<AORouterSubprocessArgs>(
    process.argv.slice(2)
);

if (require.main === module) {
    new AOP2P(argv);
}
