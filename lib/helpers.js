"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.escapeRegExpSpecialCharacters = exports.isJSONSupported = exports.isErrorBecauseStorageIsOfOutOfSpace = exports.isStorageSupported = exports.assignValue = void 0;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/**
 * Just a helper method to replace default values
 * @param defaultValue
 * @param value
 */
var assignValue = function assignValue(defaultValue, value) {
  return value === undefined || value === null ? defaultValue : value;
};
/**
 * Test to check if storage is not supported.
 */


exports.assignValue = assignValue;

var isStorageSupported = function isStorageSupported() {
  // Prepare a test case
  var key = "__ls__cache__test__";
  var value = key; // some browsers will throw an error if you try to access local storage (e.g. brave browser)
  // hence check is inside a try/catch

  try {
    if (!localStorage) {
      return false;
    }
  } catch (e) {
    return false;
  }

  try {
    // lets try it
    localStorage.setItem(key, value);
    localStorage.removeItem(key);
  } catch (e) {
    // Make sure its not full, that the error resulted because we have no support
    if (!(isErrorBecauseStorageIsOfOutOfSpace(e) && localStorage.length)) {
      return false;
    }
  }

  return true;
};
/**
 * Check to set if the error is because we are out of space
 */


exports.isStorageSupported = isStorageSupported;

var isErrorBecauseStorageIsOfOutOfSpace = function isErrorBecauseStorageIsOfOutOfSpace(e) {
  return e && (e.name === "QUOTA_EXCEEDED_ERR" || e.name === "NS_ERROR_DOM_QUOTA_REACHED" || e.name === "QuotaExceededError");
};
/**
 * Determines if native JSON (de-)serialization is supported in the browser.
 */


exports.isErrorBecauseStorageIsOfOutOfSpace = isErrorBecauseStorageIsOfOutOfSpace;

var isJSONSupported = function isJSONSupported() {
  return (typeof JSON === "undefined" ? "undefined" : _typeof(JSON)) === "object" && typeof JSON.parse === "function";
};
/**
 * Returns a string where all RegExp special characters are escaped with a \.
 */


exports.isJSONSupported = isJSONSupported;

var escapeRegExpSpecialCharacters = function escapeRegExpSpecialCharacters(text) {
  return text.replace(/[[\]{}()*+?.\\^$|]/g, "\\$&");
};

exports.escapeRegExpSpecialCharacters = escapeRegExpSpecialCharacters;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9oZWxwZXJzLnRzIl0sIm5hbWVzIjpbImFzc2lnblZhbHVlIiwiZGVmYXVsdFZhbHVlIiwidmFsdWUiLCJ1bmRlZmluZWQiLCJpc1N0b3JhZ2VTdXBwb3J0ZWQiLCJrZXkiLCJsb2NhbFN0b3JhZ2UiLCJlIiwic2V0SXRlbSIsInJlbW92ZUl0ZW0iLCJpc0Vycm9yQmVjYXVzZVN0b3JhZ2VJc09mT3V0T2ZTcGFjZSIsImxlbmd0aCIsIm5hbWUiLCJpc0pTT05TdXBwb3J0ZWQiLCJKU09OIiwicGFyc2UiLCJlc2NhcGVSZWdFeHBTcGVjaWFsQ2hhcmFjdGVycyIsInRleHQiLCJyZXBsYWNlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTs7Ozs7QUFLTyxJQUFNQSxXQUFXLEdBQUcsU0FBZEEsV0FBYyxDQUMxQkMsWUFEMEIsRUFFMUJDLEtBRjBCO0FBQUEsU0FHckJBLEtBQUssS0FBS0MsU0FBVixJQUF1QkQsS0FBSyxLQUFLLElBQWpDLEdBQXdDRCxZQUF4QyxHQUF1REMsS0FIbEM7QUFBQSxDQUFwQjtBQUtQOzs7Ozs7O0FBR08sSUFBTUUsa0JBQWtCLEdBQUcsU0FBckJBLGtCQUFxQixHQUFlO0FBQ2hEO0FBQ0EsTUFBSUMsR0FBRyxHQUFHLHFCQUFWO0FBQ0EsTUFBSUgsS0FBSyxHQUFHRyxHQUFaLENBSGdELENBSWhEO0FBQ0E7O0FBQ0EsTUFBSTtBQUNILFFBQUksQ0FBQ0MsWUFBTCxFQUFtQjtBQUNsQixhQUFPLEtBQVA7QUFDQTtBQUNELEdBSkQsQ0FJRSxPQUFPQyxDQUFQLEVBQVU7QUFDWCxXQUFPLEtBQVA7QUFDQTs7QUFDRCxNQUFJO0FBQ0g7QUFDQUQsSUFBQUEsWUFBWSxDQUFDRSxPQUFiLENBQXFCSCxHQUFyQixFQUEwQkgsS0FBMUI7QUFDQUksSUFBQUEsWUFBWSxDQUFDRyxVQUFiLENBQXdCSixHQUF4QjtBQUNBLEdBSkQsQ0FJRSxPQUFPRSxDQUFQLEVBQVU7QUFDWDtBQUNBLFFBQUksRUFBRUcsbUNBQW1DLENBQUNILENBQUQsQ0FBbkMsSUFBMENELFlBQVksQ0FBQ0ssTUFBekQsQ0FBSixFQUFzRTtBQUNyRSxhQUFPLEtBQVA7QUFDQTtBQUNEOztBQUNELFNBQU8sSUFBUDtBQUNBLENBeEJNO0FBMEJQOzs7Ozs7O0FBR08sSUFBTUQsbUNBQW1DLEdBQUcsU0FBdENBLG1DQUFzQyxDQUFDSCxDQUFELEVBQVk7QUFDOUQsU0FDQ0EsQ0FBQyxLQUNNQSxDQUFDLENBQUNLLElBQUYsS0FBVyxvQkFBWCxJQUNHTCxDQUFDLENBQUNLLElBQUYsS0FBVyw0QkFEZCxJQUVHTCxDQUFDLENBQUNLLElBQUYsS0FBVyxvQkFIcEIsQ0FERjtBQU1BLENBUE07QUFTUDs7Ozs7OztBQUdPLElBQU1DLGVBQWUsR0FBRyxTQUFsQkEsZUFBa0I7QUFBQSxTQUM5QixRQUFPQyxJQUFQLHlDQUFPQSxJQUFQLE9BQWdCLFFBQWhCLElBQTRCLE9BQU9BLElBQUksQ0FBQ0MsS0FBWixLQUFzQixVQURwQjtBQUFBLENBQXhCO0FBR1A7Ozs7Ozs7QUFHTyxJQUFNQyw2QkFBNkIsR0FBRyxTQUFoQ0EsNkJBQWdDLENBQUNDLElBQUQsRUFBa0I7QUFDOUQsU0FBT0EsSUFBSSxDQUFDQyxPQUFMLENBQWEscUJBQWIsRUFBb0MsTUFBcEMsQ0FBUDtBQUNBLENBRk0iLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEp1c3QgYSBoZWxwZXIgbWV0aG9kIHRvIHJlcGxhY2UgZGVmYXVsdCB2YWx1ZXNcbiAqIEBwYXJhbSBkZWZhdWx0VmFsdWVcbiAqIEBwYXJhbSB2YWx1ZVxuICovXG5leHBvcnQgY29uc3QgYXNzaWduVmFsdWUgPSAoXG5cdGRlZmF1bHRWYWx1ZTogc3RyaW5nLFxuXHR2YWx1ZTogc3RyaW5nIHwgdW5kZWZpbmVkIHwgbnVsbFxuKSA9PiAodmFsdWUgPT09IHVuZGVmaW5lZCB8fCB2YWx1ZSA9PT0gbnVsbCA/IGRlZmF1bHRWYWx1ZSA6IHZhbHVlKTtcblxuLyoqXG4gKiBUZXN0IHRvIGNoZWNrIGlmIHN0b3JhZ2UgaXMgbm90IHN1cHBvcnRlZC5cbiAqL1xuZXhwb3J0IGNvbnN0IGlzU3RvcmFnZVN1cHBvcnRlZCA9ICgpOiBib29sZWFuID0+IHtcblx0Ly8gUHJlcGFyZSBhIHRlc3QgY2FzZVxuXHR2YXIga2V5ID0gXCJfX2xzX19jYWNoZV9fdGVzdF9fXCI7XG5cdHZhciB2YWx1ZSA9IGtleTtcblx0Ly8gc29tZSBicm93c2VycyB3aWxsIHRocm93IGFuIGVycm9yIGlmIHlvdSB0cnkgdG8gYWNjZXNzIGxvY2FsIHN0b3JhZ2UgKGUuZy4gYnJhdmUgYnJvd3Nlcilcblx0Ly8gaGVuY2UgY2hlY2sgaXMgaW5zaWRlIGEgdHJ5L2NhdGNoXG5cdHRyeSB7XG5cdFx0aWYgKCFsb2NhbFN0b3JhZ2UpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdH0gY2F0Y2ggKGUpIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblx0dHJ5IHtcblx0XHQvLyBsZXRzIHRyeSBpdFxuXHRcdGxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgdmFsdWUpO1xuXHRcdGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKGtleSk7XG5cdH0gY2F0Y2ggKGUpIHtcblx0XHQvLyBNYWtlIHN1cmUgaXRzIG5vdCBmdWxsLCB0aGF0IHRoZSBlcnJvciByZXN1bHRlZCBiZWNhdXNlIHdlIGhhdmUgbm8gc3VwcG9ydFxuXHRcdGlmICghKGlzRXJyb3JCZWNhdXNlU3RvcmFnZUlzT2ZPdXRPZlNwYWNlKGUpICYmIGxvY2FsU3RvcmFnZS5sZW5ndGgpKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHR9XG5cdHJldHVybiB0cnVlO1xufTtcblxuLyoqXG4gKiBDaGVjayB0byBzZXQgaWYgdGhlIGVycm9yIGlzIGJlY2F1c2Ugd2UgYXJlIG91dCBvZiBzcGFjZVxuICovXG5leHBvcnQgY29uc3QgaXNFcnJvckJlY2F1c2VTdG9yYWdlSXNPZk91dE9mU3BhY2UgPSAoZTogYW55KSA9PiB7XG5cdHJldHVybiAoXG5cdFx0ZSAmJlxuICAgICAgICAoZS5uYW1lID09PSBcIlFVT1RBX0VYQ0VFREVEX0VSUlwiIHx8XG4gICAgICAgICAgICBlLm5hbWUgPT09IFwiTlNfRVJST1JfRE9NX1FVT1RBX1JFQUNIRURcIiB8fFxuICAgICAgICAgICAgZS5uYW1lID09PSBcIlF1b3RhRXhjZWVkZWRFcnJvclwiKVxuXHQpO1xufTtcblxuLyoqXG4gKiBEZXRlcm1pbmVzIGlmIG5hdGl2ZSBKU09OIChkZS0pc2VyaWFsaXphdGlvbiBpcyBzdXBwb3J0ZWQgaW4gdGhlIGJyb3dzZXIuXG4gKi9cbmV4cG9ydCBjb25zdCBpc0pTT05TdXBwb3J0ZWQgPSAoKTogYm9vbGVhbiA9PlxuXHR0eXBlb2YgSlNPTiA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgSlNPTi5wYXJzZSA9PT0gXCJmdW5jdGlvblwiO1xuXG4vKipcbiAqIFJldHVybnMgYSBzdHJpbmcgd2hlcmUgYWxsIFJlZ0V4cCBzcGVjaWFsIGNoYXJhY3RlcnMgYXJlIGVzY2FwZWQgd2l0aCBhIFxcLlxuICovXG5leHBvcnQgY29uc3QgZXNjYXBlUmVnRXhwU3BlY2lhbENoYXJhY3RlcnMgPSAodGV4dDogc3RyaW5nKSA9PiB7XG5cdHJldHVybiB0ZXh0LnJlcGxhY2UoL1tbXFxde30oKSorPy5cXFxcXiR8XS9nLCBcIlxcXFwkJlwiKTtcbn07XG4iXX0=