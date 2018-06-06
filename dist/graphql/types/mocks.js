'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _casual = require('casual');

var _casual2 = _interopRequireDefault(_casual);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mocks = {
    Video: function Video() {
        return {
            id: _casual2.default.uuid,
            title: _casual2.default.title,
            description: _casual2.default.description
        };
    },
    VideoMetadata: function VideoMetadata() {
        return {
            file_type: _casual2.default.random_element(['mp4', 'mov']),
            file_size: _casual2.default.integer(0, Math.pow(2, 31) - 1) // 32 bit signed max value
        };
    },
    Peer: function Peer() {
        return {
            id: _casual2.default.uuid
        };
    }
};

exports.default = mocks;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9ncmFwaHFsL3R5cGVzL21vY2tzLmpzIl0sIm5hbWVzIjpbIm1vY2tzIiwiVmlkZW8iLCJpZCIsImNhc3VhbCIsInV1aWQiLCJ0aXRsZSIsImRlc2NyaXB0aW9uIiwiVmlkZW9NZXRhZGF0YSIsImZpbGVfdHlwZSIsInJhbmRvbV9lbGVtZW50IiwiZmlsZV9zaXplIiwiaW50ZWdlciIsIk1hdGgiLCJwb3ciLCJQZWVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7Ozs7O0FBRUEsSUFBTUEsUUFBUTtBQUNWQyxXQUFPO0FBQUEsZUFBTztBQUNWQyxnQkFBSUMsaUJBQU9DLElBREQ7QUFFVkMsbUJBQU9GLGlCQUFPRSxLQUZKO0FBR1ZDLHlCQUFhSCxpQkFBT0c7QUFIVixTQUFQO0FBQUEsS0FERztBQU1WQyxtQkFBZTtBQUFBLGVBQU87QUFDbEJDLHVCQUFXTCxpQkFBT00sY0FBUCxDQUFzQixDQUFDLEtBQUQsRUFBUSxLQUFSLENBQXRCLENBRE87QUFFbEJDLHVCQUFXUCxpQkFBT1EsT0FBUCxDQUFlLENBQWYsRUFBa0JDLEtBQUtDLEdBQUwsQ0FBUyxDQUFULEVBQVksRUFBWixJQUFrQixDQUFwQyxDQUZPLENBRWlDO0FBRmpDLFNBQVA7QUFBQSxLQU5MO0FBVVZDLFVBQU07QUFBQSxlQUFPO0FBQ1RaLGdCQUFJQyxpQkFBT0M7QUFERixTQUFQO0FBQUE7QUFWSSxDQUFkOztrQkFlZUosSyIsImZpbGUiOiJtb2Nrcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjYXN1YWwgZnJvbSAnY2FzdWFsJztcblxuY29uc3QgbW9ja3MgPSB7XG4gICAgVmlkZW86ICgpID0+ICh7XG4gICAgICAgIGlkOiBjYXN1YWwudXVpZCxcbiAgICAgICAgdGl0bGU6IGNhc3VhbC50aXRsZSxcbiAgICAgICAgZGVzY3JpcHRpb246IGNhc3VhbC5kZXNjcmlwdGlvblxuICAgIH0pLFxuICAgIFZpZGVvTWV0YWRhdGE6ICgpID0+ICh7XG4gICAgICAgIGZpbGVfdHlwZTogY2FzdWFsLnJhbmRvbV9lbGVtZW50KFsnbXA0JywgJ21vdiddKSxcbiAgICAgICAgZmlsZV9zaXplOiBjYXN1YWwuaW50ZWdlcigwLCBNYXRoLnBvdygyLCAzMSkgLSAxKSAgLy8gMzIgYml0IHNpZ25lZCBtYXggdmFsdWVcbiAgICB9KSxcbiAgICBQZWVyOiAoKSA9PiAoe1xuICAgICAgICBpZDogY2FzdWFsLnV1aWQsXG4gICAgfSlcbn1cblxuZXhwb3J0IGRlZmF1bHQgbW9ja3MiXX0=