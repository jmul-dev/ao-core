var copy = require("recursive-copy");

copy("src", "dist", {
    overwrite: true,
    filter: ["**/*.graphql", "**/*.json"]
})
    .then(function(results) {
        console.info("Copied " + results.length + " files");
    })
    .catch(function(error) {
        console.error("Copy failed: " + error);
    });
