# AO - Core process

## Build

`npm run build`

Build process:

1. Compile ts into dist folder
2. Copy non-ts files over to dist (like .graphql files)
3. Copy dependencies over to dist (node_modules) that will be included in electron build

The dist folder can then be served without any additional dependencies/node_modules.

## Running

`npm run start`

You may need to add `--ethAddress "0x0000..."` if you are not using core with `ao-frontend`. User context is needed for several interactions. At this point, you should be able to interact with `ao-core` via the graphql interface running at `http://localhost:3003/graphiql`.

## Random Notes

-   `web3@v1.0.0-beta.33`: dependency requirement based on infura rpc filter support https://github.com/ethereum/web3.js/issues/1559. May upgrade to beta.36+ once released.
-   `web3@v0.20.6`: dependency required for parsing log information from transactionReceipt. Forked under `web3-legacy` so that we can use both versions of web3 side by side.
-   `@types/bn.js` might need to be deleted from node_modules folder to make tsc happy.

## Adding content types

List of changes needed to add an additional content type to `ao-core`.

-   Update `ContentType` enum in `src/graphql/types/Content.graphql`
-   Add new type that implements `IContent` in `src/graphql/types/Content.graphql`
-   Resolve the new type in `src/graphql/schema.ts`
-   Update `AOContentType` type in `src/models/AOContent.ts`
-   Add new class that extends `AOContent` in `src/models/AOContent.ts`
-   Instantiate the new class in `AOContent.fromObject` based on the new content type (see switch), in `src/models/AOContent.ts`
-   Add any content specific logic to `src/graphql/resolvers/resolveSubmitContent.ts`
