"use strict";

var _index = require("../index");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Storage = require("node-localstorage").LocalStorage; // localStorage = new LocalStorage("./scratch");


var printste = function printste(cache) {
  for (var i = 0; i < cache.storage.length; i++) {
    console.log(cache.storage.key(i), cache.storage.getItem(cache.storage.key(i)));
  }
};

var SSS =
/*#__PURE__*/
function (_Storage) {
  _inherits(SSS, _Storage);

  function SSS() {
    _classCallCheck(this, SSS);

    return _possibleConstructorReturn(this, _getPrototypeOf(SSS).apply(this, arguments));
  }

  return SSS;
}(Storage);

var ss = new SSS("./scratch.js");
var cache = new _index.LSCache({
  storage: ss
});
cache.setBatch({
  key1: "val1",
  key2: "val1",
  key3: "val1",
  key4: "val1",
  key5: "val1",
  key6: "val1"
}); // cache.set("key1", "value1");
// cache.set("key2", "value1");
// cache.set("key3", "value2");
// cache.set("key4", "value3");
// cache.set("key4", {
// 	a: "a",
// 	b: 1,
// 	c: 1.23,
// 	d: {
// 		a: 1
// 	}
// });
// cache.set("key5", "value3");
// cache.set("key6", "value3");
// cache.set("key7", "value3");

setTimeout(function () {
  printste(cache);
}, 3000);
printste(cache);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90ZXN0cy90ZXN0LmpzIl0sIm5hbWVzIjpbIlN0b3JhZ2UiLCJyZXF1aXJlIiwiTG9jYWxTdG9yYWdlIiwicHJpbnRzdGUiLCJjYWNoZSIsImkiLCJzdG9yYWdlIiwibGVuZ3RoIiwiY29uc29sZSIsImxvZyIsImtleSIsImdldEl0ZW0iLCJTU1MiLCJzcyIsIkxTQ2FjaGUiLCJzZXRCYXRjaCIsImtleTEiLCJrZXkyIiwia2V5MyIsImtleTQiLCJrZXk1Iiwia2V5NiIsInNldFRpbWVvdXQiXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7QUFHQSxJQUFJQSxPQUFPLEdBQUdDLE9BQU8sQ0FBQyxtQkFBRCxDQUFQLENBQTZCQyxZQUEzQyxDLENBQ0E7OztBQUVBLElBQU1DLFFBQVEsR0FBRyxTQUFYQSxRQUFXLENBQUNDLEtBQUQsRUFBVztBQUMzQixPQUFLLElBQUlDLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdELEtBQUssQ0FBQ0UsT0FBTixDQUFjQyxNQUFsQyxFQUEwQ0YsQ0FBQyxFQUEzQyxFQUErQztBQUM5Q0csSUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVlMLEtBQUssQ0FBQ0UsT0FBTixDQUFjSSxHQUFkLENBQWtCTCxDQUFsQixDQUFaLEVBQWtDRCxLQUFLLENBQUNFLE9BQU4sQ0FBY0ssT0FBZCxDQUFzQlAsS0FBSyxDQUFDRSxPQUFOLENBQWNJLEdBQWQsQ0FBa0JMLENBQWxCLENBQXRCLENBQWxDO0FBQ0E7QUFDRCxDQUpEOztJQU1NTyxHOzs7Ozs7Ozs7Ozs7RUFBWVosTzs7QUFHbEIsSUFBTWEsRUFBRSxHQUFHLElBQUlELEdBQUosQ0FBUSxjQUFSLENBQVg7QUFFQSxJQUFNUixLQUFLLEdBQUcsSUFBSVUsY0FBSixDQUFZO0FBQ3pCUixFQUFBQSxPQUFPLEVBQUVPO0FBRGdCLENBQVosQ0FBZDtBQUdBVCxLQUFLLENBQUNXLFFBQU4sQ0FBZTtBQUNkQyxFQUFBQSxJQUFJLEVBQUUsTUFEUTtBQUVkQyxFQUFBQSxJQUFJLEVBQUUsTUFGUTtBQUdkQyxFQUFBQSxJQUFJLEVBQUUsTUFIUTtBQUlkQyxFQUFBQSxJQUFJLEVBQUUsTUFKUTtBQUtkQyxFQUFBQSxJQUFJLEVBQUUsTUFMUTtBQU1kQyxFQUFBQSxJQUFJLEVBQUU7QUFOUSxDQUFmLEUsQ0FRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0FDLFVBQVUsQ0FBQyxZQUFNO0FBQ2hCbkIsRUFBQUEsUUFBUSxDQUFDQyxLQUFELENBQVI7QUFDQSxDQUZTLEVBRVAsSUFGTyxDQUFWO0FBR0FELFFBQVEsQ0FBQ0MsS0FBRCxDQUFSIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcblx0TFNDYWNoZVxufSBmcm9tIFwiLi4vaW5kZXhcIjtcbnZhciBTdG9yYWdlID0gcmVxdWlyZShcIm5vZGUtbG9jYWxzdG9yYWdlXCIpLkxvY2FsU3RvcmFnZTtcbi8vIGxvY2FsU3RvcmFnZSA9IG5ldyBMb2NhbFN0b3JhZ2UoXCIuL3NjcmF0Y2hcIik7XG5cbmNvbnN0IHByaW50c3RlID0gKGNhY2hlKSA9PiB7XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgY2FjaGUuc3RvcmFnZS5sZW5ndGg7IGkrKykge1xuXHRcdGNvbnNvbGUubG9nKGNhY2hlLnN0b3JhZ2Uua2V5KGkpLCBjYWNoZS5zdG9yYWdlLmdldEl0ZW0oY2FjaGUuc3RvcmFnZS5rZXkoaSkpKTtcblx0fVxufTtcblxuY2xhc3MgU1NTIGV4dGVuZHMgU3RvcmFnZSB7XG5cbn1cbmNvbnN0IHNzID0gbmV3IFNTUyhcIi4vc2NyYXRjaC5qc1wiKTtcblxuY29uc3QgY2FjaGUgPSBuZXcgTFNDYWNoZSh7XG5cdHN0b3JhZ2U6IHNzXG59KTtcbmNhY2hlLnNldEJhdGNoKHtcblx0a2V5MTogXCJ2YWwxXCIsXG5cdGtleTI6IFwidmFsMVwiLFxuXHRrZXkzOiBcInZhbDFcIixcblx0a2V5NDogXCJ2YWwxXCIsXG5cdGtleTU6IFwidmFsMVwiLFxuXHRrZXk2OiBcInZhbDFcIlxufSk7XG4vLyBjYWNoZS5zZXQoXCJrZXkxXCIsIFwidmFsdWUxXCIpO1xuLy8gY2FjaGUuc2V0KFwia2V5MlwiLCBcInZhbHVlMVwiKTtcbi8vIGNhY2hlLnNldChcImtleTNcIiwgXCJ2YWx1ZTJcIik7XG4vLyBjYWNoZS5zZXQoXCJrZXk0XCIsIFwidmFsdWUzXCIpO1xuLy8gY2FjaGUuc2V0KFwia2V5NFwiLCB7XG4vLyBcdGE6IFwiYVwiLFxuLy8gXHRiOiAxLFxuLy8gXHRjOiAxLjIzLFxuLy8gXHRkOiB7XG4vLyBcdFx0YTogMVxuLy8gXHR9XG4vLyB9KTtcbi8vIGNhY2hlLnNldChcImtleTVcIiwgXCJ2YWx1ZTNcIik7XG4vLyBjYWNoZS5zZXQoXCJrZXk2XCIsIFwidmFsdWUzXCIpO1xuLy8gY2FjaGUuc2V0KFwia2V5N1wiLCBcInZhbHVlM1wiKTtcbnNldFRpbWVvdXQoKCkgPT4ge1xuXHRwcmludHN0ZShjYWNoZSk7XG59LCAzMDAwKTtcbnByaW50c3RlKGNhY2hlKTsiXX0=