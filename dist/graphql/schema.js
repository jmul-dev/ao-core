'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (db) {
    var schema = (0, _graphqlTools.makeExecutableSchema)({
        // TODO: type def's should probably mirror the Database models. Maybe we can 
        // more closely define these at some point
        typeDefs: [SchemaDefinition, _index2.default, _index4.default, _index6.default],
        resolvers: {
            RootQuery: {
                version: function version() {
                    return _package.version;
                }
                // videos: () => db.Video.all(),
                // peers: () => db.Peer.all()
            }
        }
    });
    // NOTE: set preserveResolvers to true if we only want to mock undefined resolvers,
    // and use resolvers that are already defined.
    // TODO: conditional on process.env.NODE_ENV
    (0, _graphqlTools.addMockFunctionsToSchema)({ schema: schema, mocks: _mocks2.default, preserveResolvers: true });
    return schema;
};

var _graphqlTools = require('graphql-tools');

var _index = require('./queries/index');

var _index2 = _interopRequireDefault(_index);

var _index3 = require('./mutations/index');

var _index4 = _interopRequireDefault(_index3);

var _index5 = require('./types/index');

var _index6 = _interopRequireDefault(_index5);

var _mocks = require('./types/mocks');

var _mocks2 = _interopRequireDefault(_mocks);

var _package = require('../../package.json');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SchemaDefinition = '\n    schema {\n        query: RootQuery,\n        mutation: RootMutation,\n    }\n';
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ncmFwaHFsL3NjaGVtYS5qcyJdLCJuYW1lcyI6WyJkYiIsInNjaGVtYSIsInR5cGVEZWZzIiwiU2NoZW1hRGVmaW5pdGlvbiIsIlJvb3RRdWVyeSIsIlJvb3RNdXRhdGlvbiIsIlR5cGVzIiwicmVzb2x2ZXJzIiwidmVyc2lvbiIsIl92ZXJzaW9uIiwibW9ja3MiLCJwcmVzZXJ2ZVJlc29sdmVycyJdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztrQkFnQmUsVUFBVUEsRUFBVixFQUFjO0FBQ3pCLFFBQU1DLFNBQVMsd0NBQXFCO0FBQ2hDO0FBQ0E7QUFDQUMsa0JBQVUsQ0FBQ0MsZ0JBQUQsRUFBbUJDLGVBQW5CLEVBQThCQyxlQUE5QixFQUE0Q0MsZUFBNUMsQ0FIc0I7QUFJaENDLG1CQUFXO0FBQ1BILHVCQUFXO0FBQ1BJLHlCQUFTO0FBQUEsMkJBQU1DLGdCQUFOO0FBQUE7QUFDVDtBQUNBO0FBSE87QUFESjtBQUpxQixLQUFyQixDQUFmO0FBWUE7QUFDQTtBQUNBO0FBQ0EsZ0RBQXlCLEVBQUVSLGNBQUYsRUFBVVMsc0JBQVYsRUFBaUJDLG1CQUFtQixJQUFwQyxFQUF6QjtBQUNBLFdBQU9WLE1BQVA7QUFDSCxDOztBQWpDRDs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBR0EsSUFBTUUsd0dBQU4iLCJmaWxlIjoic2NoZW1hLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuaW1wb3J0IHsgbWFrZUV4ZWN1dGFibGVTY2hlbWEsIGFkZE1vY2tGdW5jdGlvbnNUb1NjaGVtYSB9IGZyb20gJ2dyYXBocWwtdG9vbHMnO1xuaW1wb3J0IFJvb3RRdWVyeSBmcm9tIFwiLi9xdWVyaWVzL2luZGV4XCI7XG5pbXBvcnQgUm9vdE11dGF0aW9uIGZyb20gXCIuL211dGF0aW9ucy9pbmRleFwiO1xuaW1wb3J0IFR5cGVzIGZyb20gXCIuL3R5cGVzL2luZGV4XCI7XG5pbXBvcnQgbW9ja3MgZnJvbSAnLi90eXBlcy9tb2Nrcyc7XG5pbXBvcnQgeyB2ZXJzaW9uIGFzIF92ZXJzaW9uIH0gZnJvbSBcIi4uLy4uL3BhY2thZ2UuanNvblwiO1xuXG5cbmNvbnN0IFNjaGVtYURlZmluaXRpb24gPSBgXG4gICAgc2NoZW1hIHtcbiAgICAgICAgcXVlcnk6IFJvb3RRdWVyeSxcbiAgICAgICAgbXV0YXRpb246IFJvb3RNdXRhdGlvbixcbiAgICB9XG5gXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIChkYikge1xuICAgIGNvbnN0IHNjaGVtYSA9IG1ha2VFeGVjdXRhYmxlU2NoZW1hKHtcbiAgICAgICAgLy8gVE9ETzogdHlwZSBkZWYncyBzaG91bGQgcHJvYmFibHkgbWlycm9yIHRoZSBEYXRhYmFzZSBtb2RlbHMuIE1heWJlIHdlIGNhbiBcbiAgICAgICAgLy8gbW9yZSBjbG9zZWx5IGRlZmluZSB0aGVzZSBhdCBzb21lIHBvaW50XG4gICAgICAgIHR5cGVEZWZzOiBbU2NoZW1hRGVmaW5pdGlvbiwgUm9vdFF1ZXJ5LCBSb290TXV0YXRpb24sIFR5cGVzXSxcbiAgICAgICAgcmVzb2x2ZXJzOiB7XG4gICAgICAgICAgICBSb290UXVlcnk6IHtcbiAgICAgICAgICAgICAgICB2ZXJzaW9uOiAoKSA9PiBfdmVyc2lvbixcbiAgICAgICAgICAgICAgICAvLyB2aWRlb3M6ICgpID0+IGRiLlZpZGVvLmFsbCgpLFxuICAgICAgICAgICAgICAgIC8vIHBlZXJzOiAoKSA9PiBkYi5QZWVyLmFsbCgpXG4gICAgICAgICAgICB9LFxuICAgICAgICB9XG4gICAgfSk7XG4gICAgLy8gTk9URTogc2V0IHByZXNlcnZlUmVzb2x2ZXJzIHRvIHRydWUgaWYgd2Ugb25seSB3YW50IHRvIG1vY2sgdW5kZWZpbmVkIHJlc29sdmVycyxcbiAgICAvLyBhbmQgdXNlIHJlc29sdmVycyB0aGF0IGFyZSBhbHJlYWR5IGRlZmluZWQuXG4gICAgLy8gVE9ETzogY29uZGl0aW9uYWwgb24gcHJvY2Vzcy5lbnYuTk9ERV9FTlZcbiAgICBhZGRNb2NrRnVuY3Rpb25zVG9TY2hlbWEoeyBzY2hlbWEsIG1vY2tzLCBwcmVzZXJ2ZVJlc29sdmVyczogdHJ1ZSB9KTtcbiAgICByZXR1cm4gc2NoZW1hO1xufSJdfQ==