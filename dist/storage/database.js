"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _sqlite = require("sqlite3");

var _sqlite2 = _interopRequireDefault(_sqlite);

var _sequelize = require("sequelize");

var _sequelize2 = _interopRequireDefault(_sequelize);

var _assert = require("assert");

var _assert2 = _interopRequireDefault(_assert);

var _debug = require("debug");

var _debug2 = _interopRequireDefault(_debug);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var debug = (0, _debug2.default)('ao:db');

var Database = function () {
    function Database() {
        _classCallCheck(this, Database);

        this.memoryDB = new _sequelize2.default('sqlite::memory:', {
            // logging: false
        });
        this.persistedDB = null;
        // Model definitions
        this.Video = this.memoryDB.define('video', {
            title: _sequelize.STRING
        });
        this.Peer = this.memoryDB.define('peer', {
            id: {
                type: _sequelize.STRING,
                primaryKey: true
            }
        });
        this.Log = this.memoryDB.define('log', {
            createdAt: { type: _sequelize.DATE, defaultValue: _sequelize.NOW },
            message: _sequelize.STRING
        });
    }

    _createClass(Database, [{
        key: "init",
        value: function init() {
            return this.memoryDB.sync({ force: true }); // syncs all models (create tables)
        }
    }, {
        key: "close",
        value: function close() {
            return this.memoryDB.close();
        }
    }]);

    return Database;
}();

exports.default = Database;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zdG9yYWdlL2RhdGFiYXNlLmpzIl0sIm5hbWVzIjpbImRlYnVnIiwiRGF0YWJhc2UiLCJtZW1vcnlEQiIsIlNlcXVlbGl6ZSIsInBlcnNpc3RlZERCIiwiVmlkZW8iLCJkZWZpbmUiLCJ0aXRsZSIsIlNUUklORyIsIlBlZXIiLCJpZCIsInR5cGUiLCJwcmltYXJ5S2V5IiwiTG9nIiwiY3JlYXRlZEF0IiwiREFURSIsImRlZmF1bHRWYWx1ZSIsIk5PVyIsIm1lc3NhZ2UiLCJzeW5jIiwiZm9yY2UiLCJjbG9zZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7QUFDQSxJQUFNQSxRQUFRLHFCQUFNLE9BQU4sQ0FBZDs7SUFFTUMsUTtBQUNGLHdCQUFjO0FBQUE7O0FBQ1YsYUFBS0MsUUFBTCxHQUFnQixJQUFJQyxtQkFBSixDQUFjLGlCQUFkLEVBQWlDO0FBQzdDO0FBRDZDLFNBQWpDLENBQWhCO0FBR0EsYUFBS0MsV0FBTCxHQUFtQixJQUFuQjtBQUNBO0FBQ0EsYUFBS0MsS0FBTCxHQUFhLEtBQUtILFFBQUwsQ0FBY0ksTUFBZCxDQUFxQixPQUFyQixFQUE4QjtBQUN2Q0MsbUJBQU9DO0FBRGdDLFNBQTlCLENBQWI7QUFHQSxhQUFLQyxJQUFMLEdBQVksS0FBS1AsUUFBTCxDQUFjSSxNQUFkLENBQXFCLE1BQXJCLEVBQTZCO0FBQ3JDSSxnQkFBSTtBQUNBQyxzQkFBTUgsaUJBRE47QUFFQUksNEJBQVk7QUFGWjtBQURpQyxTQUE3QixDQUFaO0FBTUEsYUFBS0MsR0FBTCxHQUFXLEtBQUtYLFFBQUwsQ0FBY0ksTUFBZCxDQUFxQixLQUFyQixFQUE0QjtBQUNuQ1EsdUJBQVcsRUFBRUgsTUFBTUksZUFBUixFQUFjQyxjQUFjQyxjQUE1QixFQUR3QjtBQUVuQ0MscUJBQVNWO0FBRjBCLFNBQTVCLENBQVg7QUFJSDs7OzsrQkFDTTtBQUNILG1CQUFPLEtBQUtOLFFBQUwsQ0FBY2lCLElBQWQsQ0FBbUIsRUFBQ0MsT0FBTyxJQUFSLEVBQW5CLENBQVAsQ0FERyxDQUN1QztBQUM3Qzs7O2dDQUNPO0FBQ0osbUJBQU8sS0FBS2xCLFFBQUwsQ0FBY21CLEtBQWQsRUFBUDtBQUNIOzs7Ozs7a0JBR1VwQixRIiwiZmlsZSI6ImRhdGFiYXNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHNxbGl0ZTMgZnJvbSBcInNxbGl0ZTNcIjtcbmltcG9ydCBTZXF1ZWxpemUsIHsgU1RSSU5HLCBEQVRFLCBOT1cgfSBmcm9tIFwic2VxdWVsaXplXCI7XG5pbXBvcnQgYXNzZXJ0IGZyb20gXCJhc3NlcnRcIjtcbmltcG9ydCBEZWJ1ZyBmcm9tICdkZWJ1Zyc7XG5jb25zdCBkZWJ1ZyA9IERlYnVnKCdhbzpkYicpO1xuXG5jbGFzcyBEYXRhYmFzZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMubWVtb3J5REIgPSBuZXcgU2VxdWVsaXplKCdzcWxpdGU6Om1lbW9yeTonLCB7XG4gICAgICAgICAgICAvLyBsb2dnaW5nOiBmYWxzZVxuICAgICAgICB9KVxuICAgICAgICB0aGlzLnBlcnNpc3RlZERCID0gbnVsbFxuICAgICAgICAvLyBNb2RlbCBkZWZpbml0aW9uc1xuICAgICAgICB0aGlzLlZpZGVvID0gdGhpcy5tZW1vcnlEQi5kZWZpbmUoJ3ZpZGVvJywge1xuICAgICAgICAgICAgdGl0bGU6IFNUUklOR1xuICAgICAgICB9KVxuICAgICAgICB0aGlzLlBlZXIgPSB0aGlzLm1lbW9yeURCLmRlZmluZSgncGVlcicsIHtcbiAgICAgICAgICAgIGlkOiB7XG4gICAgICAgICAgICAgICAgdHlwZTogU1RSSU5HLFxuICAgICAgICAgICAgICAgIHByaW1hcnlLZXk6IHRydWUsXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIHRoaXMuTG9nID0gdGhpcy5tZW1vcnlEQi5kZWZpbmUoJ2xvZycsIHtcbiAgICAgICAgICAgIGNyZWF0ZWRBdDogeyB0eXBlOiBEQVRFLCBkZWZhdWx0VmFsdWU6IE5PVyB9LFxuICAgICAgICAgICAgbWVzc2FnZTogU1RSSU5HXG4gICAgICAgIH0pXG4gICAgfVxuICAgIGluaXQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1lbW9yeURCLnN5bmMoe2ZvcmNlOiB0cnVlfSkgIC8vIHN5bmNzIGFsbCBtb2RlbHMgKGNyZWF0ZSB0YWJsZXMpXG4gICAgfVxuICAgIGNsb3NlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5tZW1vcnlEQi5jbG9zZSgpXG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBEYXRhYmFzZTsiXX0=