# AO - Core process
This package exposes the core AO module as a node script via `bin` folder.

## Build
`npm run build`

Build process (handled via webpack):
1. Compile ts
2. Compile js into single source files (one for main, one for each submodule that needs to be spawned)
3. Copy any static binary dependencies (ex: ffprobe) to the dist folder

The dist folder can then be served without any additional dependencies/node_modules.