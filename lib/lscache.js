"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.CACHE_SUFFIX = exports.CACHE_PREFIX = void 0;

var _helpers = require("./helpers");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// The default prefix we will use for our cache
var CACHE_PREFIX = "sr-"; // The defautl suffix we will use for our time of cache

exports.CACHE_PREFIX = CACHE_PREFIX;
var CACHE_SUFFIX = "-toc";
exports.CACHE_SUFFIX = CACHE_SUFFIX;
var sharedCache;

var LSCache =
/*#__PURE__*/
function () {
  // ----------------
  // ----------------
  function LSCache(_ref) {
    var prefix = _ref.prefix,
        suffix = _ref.suffix,
        _ref$forceByDefault = _ref.forceByDefault,
        forceByDefault = _ref$forceByDefault === void 0 ? false : _ref$forceByDefault,
        _ref$hash = _ref.hash,
        hash = _ref$hash === void 0 ? false : _ref$hash,
        storage = _ref.storage;

    _classCallCheck(this, LSCache);

    _defineProperty(this, "prefix", void 0);

    _defineProperty(this, "suffix", void 0);

    _defineProperty(this, "canUseJson", void 0);

    _defineProperty(this, "forceByDefault", void 0);

    _defineProperty(this, "shouldHash", void 0);

    _defineProperty(this, "storage", void 0);

    this.prefix = (0, _helpers.assignValue)(CACHE_PREFIX, prefix);
    this.suffix = (0, _helpers.assignValue)(CACHE_SUFFIX, suffix);
    this.canUseJson = (0, _helpers.isJSONSupported)();
    this.forceByDefault = forceByDefault;
    this.shouldHash = hash;

    if (storage === undefined) {
      if ((0, _helpers.isStorageSupported)() === true) {
        this.storage = localStorage;
      }
    } else {
      // TODO: add validation
      this.storage = storage;
    }

    return this;
  }
  /**
   * Set this cache as the default cache
   */


  _createClass(LSCache, [{
    key: "useAsDefaultCache",
    value: function useAsDefaultCache() {
      sharedCache = this;
    }
    /**
     * Returns the number of millis since the epoch.
     */

  }, {
    key: "generateTimeOfCacheKey",

    /**
     * Returns the full string of the key corresponsing to the cache time.
     */
    value: function generateTimeOfCacheKey(key) {
      return this.prefix + key + this.suffix;
    }
    /**
     * Returns the full string for the this.storage item.
     */

  }, {
    key: "generateItemKey",
    value: function generateItemKey(key) {
      return this.prefix + key;
    }
    /**
     * Save an object to local storage.
     * @param key unique key for this object
     * @param object the object to cache
     * @param force override 'forceByDefault'
     */

  }, {
    key: "set",
    value: function set(key, object, force) {
      // make sure we can store
      if (this.storage === undefined) {
        return false;
      } // make sure key is a string


      if (typeof key !== "string") {
        return false;
      }

      var _object = undefined; // do we need to serialize ?

      if (typeof object === "string") {
        _object = object;
      } else {
        // we need to serialize
        if (this.canUseJson === false) {
          return false;
        } // attempt to serialize


        try {
          _object = JSON.stringify(object);
        } catch (e) {
          // could not serialize object, dont bother storing it
          return false;
        }
      } // generate the storage the key


      var _key = this.generateItemKey(key);

      if (this.setRoutine(_key, _object, force) === false) {
        return false;
      }

      var _tOCKey = this.generateTimeOfCacheKey(key);

      var _time = LSCache.now().toString();

      if (this.setRoutine(_tOCKey, _time, force) === false) {
        // could not store time
        // abort the operation and delete the object
        this.storage.removeItem(_key);
        return false;
      }

      return true;
    }
    /**
     * Get an object with expiration date.
     * Will return null otherwise.
     * @param key the object key
     * @param maxAge max time age in millis
     */

  }, {
    key: "get",
    value: function get(key, maxAge) {
      if (this.storage === undefined) {
        return null;
      }

      var _key = this.generateItemKey(key);

      var _object = this.storage.getItem(_key);

      if (!_object) {
        return null;
      } // check time


      var tOCKey = this.generateTimeOfCacheKey(key);
      var timeOfCache = this.storage.getItem(tOCKey);

      if (timeOfCache === null) {
        // corrupt storage, abort
        return null;
      }

      var now = LSCache.now();

      if (now - parseInt(timeOfCache) > maxAge) {
        this.storage.removeItem(_key);
        this.storage.removeItem(tOCKey);
        return null;
      } // if we cant, return the object without parsing it


      if (this.canUseJson) {
        try {
          return JSON.parse(_object);
        } catch (e) {
          return _object;
        }
      } else {
        return _object;
      }
    }
    /**
     * Save group of objects to local storage.
     * Either they all fail, or all succeed.
     * @param objects the objects to cache
     * @param force override 'forceByDefault'
     */

  }, {
    key: "setBatch",
    value: function setBatch(objects, force) {
      var _this = this;

      if (this.storage === undefined) {
        return false;
      }

      return Object.keys(objects).every(function (key, index, array) {
        var result = _this.set(key, objects[key], force);

        if (result === false) {
          // rollback by removing inserted items
          for (var i = index; i > -1; i--) {
            var _key = array[i]; // @ts-ignore

            _this.storage.removeItem(_key);
          }

          return false;
        }

        return true;
      });
    }
    /**
     * Private - Set Routine
     */

  }, {
    key: "setRoutine",
    value: function setRoutine(finalKey, finalValue, force) {
      if (this.storage === undefined) {
        return false;
      }

      try {
        this.storage.setItem(finalKey, finalValue);
      } catch (error) {
        // could not store object
        if ((0, _helpers.isErrorBecauseStorageIsOfOutOfSpace)(error) === false) {
          return false;
        } // should we force it ?


        if (!(force === true || this.forceByDefault && force !== false)) {
          return false;
        } // since we can force, lets exaust all cases


        try {
          return this.setAndKeepTrying(finalKey, finalValue);
        } catch (error) {
          return false;
        }
      }

      return true;
    }
    /**
     * Private - Set and keep trying and we succeeed.
     * This will keep clearing old data up untill we are able to insert our object.
     */

  }, {
    key: "setAndKeepTrying",
    value: function setAndKeepTrying(finalKey, finalValue) {
      if (this.storage === undefined) {
        return false;
      }

      try {
        this.storage.setItem(finalKey, finalValue);
        return true;
      } catch (error) {
        // could not store object
        if ((0, _helpers.isErrorBecauseStorageIsOfOutOfSpace)(error) === false) {
          throw "";
        }

        if (this.cleanCache()) {
          // we were able to clear some cache
          // try again
          return this.setAndKeepTrying(finalKey, finalValue);
        } else {
          // we were not able to clear some cache
          throw "";
        }
      }
    }
    /**
     * Remove old items from cache
     */

  }, {
    key: "cleanCache",
    value: function cleanCache() {
      if (this.storage === undefined) {
        return false;
      }

      if (this.storage.length < 2) {
        return false;
      }

      var key1 = this.storage.key(0);
      var key2 = this.storage.key(1); // @ts-ignore

      this.storage.removeItem(key1); // @ts-ignore

      this.storage.removeItem(key2);
      return true;
    }
  }]);

  return LSCache;
}();

_defineProperty(LSCache, "sharedCache", function () {
  if (sharedCache === undefined) {
    sharedCache = new LSCache({});
  }

  return sharedCache;
});

_defineProperty(LSCache, "now", function () {
  return Math.floor(new Date().getTime());
});

var _default = LSCache;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9sc2NhY2hlLnRzIl0sIm5hbWVzIjpbIkNBQ0hFX1BSRUZJWCIsIkNBQ0hFX1NVRkZJWCIsInNoYXJlZENhY2hlIiwiTFNDYWNoZSIsInByZWZpeCIsInN1ZmZpeCIsImZvcmNlQnlEZWZhdWx0IiwiaGFzaCIsInN0b3JhZ2UiLCJjYW5Vc2VKc29uIiwic2hvdWxkSGFzaCIsInVuZGVmaW5lZCIsImxvY2FsU3RvcmFnZSIsImtleSIsIm9iamVjdCIsImZvcmNlIiwiX29iamVjdCIsIkpTT04iLCJzdHJpbmdpZnkiLCJlIiwiX2tleSIsImdlbmVyYXRlSXRlbUtleSIsInNldFJvdXRpbmUiLCJfdE9DS2V5IiwiZ2VuZXJhdGVUaW1lT2ZDYWNoZUtleSIsIl90aW1lIiwibm93IiwidG9TdHJpbmciLCJyZW1vdmVJdGVtIiwibWF4QWdlIiwiZ2V0SXRlbSIsInRPQ0tleSIsInRpbWVPZkNhY2hlIiwicGFyc2VJbnQiLCJwYXJzZSIsIm9iamVjdHMiLCJPYmplY3QiLCJrZXlzIiwiZXZlcnkiLCJpbmRleCIsImFycmF5IiwicmVzdWx0Iiwic2V0IiwiaSIsImZpbmFsS2V5IiwiZmluYWxWYWx1ZSIsInNldEl0ZW0iLCJlcnJvciIsInNldEFuZEtlZXBUcnlpbmciLCJjbGVhbkNhY2hlIiwibGVuZ3RoIiwia2V5MSIsImtleTIiLCJNYXRoIiwiZmxvb3IiLCJEYXRlIiwiZ2V0VGltZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOzs7Ozs7Ozs7O0FBT0E7QUFDTyxJQUFNQSxZQUFZLEdBQUcsS0FBckIsQyxDQUNQOzs7QUFDTyxJQUFNQyxZQUFZLEdBQUcsTUFBckI7O0FBRVAsSUFBSUMsV0FBSjs7SUFFTUMsTzs7O0FBT0Y7QUFPQTtBQUNBLHlCQWlCRztBQUFBLFFBaEJGQyxNQWdCRSxRQWhCRkEsTUFnQkU7QUFBQSxRQWZGQyxNQWVFLFFBZkZBLE1BZUU7QUFBQSxtQ0FkRkMsY0FjRTtBQUFBLFFBZEZBLGNBY0Usb0NBZGUsS0FjZjtBQUFBLHlC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SUQsV0FBVyxLQUFLUyxTQUFwQixFQUErQjtBQUM5QlQsSUFBQUEsV0FBVyxHQUFHLElBQUlDLE9BQUosQ0FBWSxFQUFaLENBQWQ7QUFDQTs7QUFDRCxTQUFPRCxXQUFQO0FBQ0EsQzs7Z0JBYkNDLE8sU0F5RFc7QUFBQSxTQUFja0QsSUFBSSxDQUFDQyxLQUFMLENBQVcsSUFBSUMsSUFBSixHQUFXQyxPQUFYLEVBQVgsQ0FBZDtBQUFBLEM7O2VBaU5GckQsTyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG5cdGFzc2lnblZhbHVlLFxuXHRpc1N0b3JhZ2VTdXBwb3J0ZWQsXG5cdGlzSlNPTlN1cHBvcnRlZCxcblx0aXNFcnJvckJlY2F1c2VTdG9yYWdlSXNPZk91dE9mU3BhY2UsXG59IGZyb20gXCIuL2hlbHBlcnNcIjtcblxuLy8gVGhlIGRlZmF1bHQgcHJlZml4IHdlIHdpbGwgdXNlIGZvciBvdXIgY2FjaGVcbmV4cG9ydCBjb25zdCBDQUNIRV9QUkVGSVggPSBcInNyLVwiO1xuLy8gVGhlIGRlZmF1dGwgc3VmZml4IHdlIHdpbGwgdXNlIGZvciBvdXIgdGltZSBvZiBjYWNoZVxuZXhwb3J0IGNvbnN0IENBQ0hFX1NVRkZJWCA9IFwiLXRvY1wiO1xuXG5sZXQgc2hhcmVkQ2FjaGU6IExTQ2FjaGUgfCB1bmRlZmluZWQ7XG5cbmNsYXNzIExTQ2FjaGUge1xuICAgIHByZWZpeDogc3RyaW5nXG4gICAgc3VmZml4OiBzdHJpbmdcbiAgICBjYW5Vc2VKc29uOiBib29sZWFuXG4gICAgZm9yY2VCeURlZmF1bHQ6IGJvb2xlYW5cbiAgICBzaG91bGRIYXNoOiBib29sZWFuXG4gICAgc3RvcmFnZTogU3RvcmFnZSB8IHVuZGVmaW5lZFxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS1cbiAgICBzdGF0aWMgc2hhcmVkQ2FjaGUgPSAoKTogTFNDYWNoZSA9PiB7XG4gICAgXHRpZiAoc2hhcmVkQ2FjaGUgPT09IHVuZGVmaW5lZCkge1xuICAgIFx0XHRzaGFyZWRDYWNoZSA9IG5ldyBMU0NhY2hlKHt9KTtcbiAgICBcdH1cbiAgICBcdHJldHVybiBzaGFyZWRDYWNoZTtcbiAgICB9XG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLVxuICAgIGNvbnN0cnVjdG9yKHtcbiAgICBcdHByZWZpeCxcbiAgICBcdHN1ZmZpeCxcbiAgICBcdGZvcmNlQnlEZWZhdWx0ID0gZmFsc2UsXG4gICAgXHRoYXNoID0gZmFsc2UsXG4gICAgXHRzdG9yYWdlLFxuICAgIH06IHtcbiAgICAvKiogT3ZlcnJpZGVzIENBQ0hFX1BSRUZJWCAqL1xuICAgIHByZWZpeD86IHN0cmluZ1xuICAgIC8qKiBPdmVycmlkZXMgQ0FDSEVfU1VGRklYICovXG4gICAgc3VmZml4Pzogc3RyaW5nXG4gICAgLyoqIFdpbGwgY2xlYXIgb2xkIHN0b3JlZCBvYmplY3RzIGluIGZhdm9yIG9mIG5ldyBvbmVzIHdoZW4gY2FjaGUgaXMgZnVsbCAqL1xuICAgIGZvcmNlQnlEZWZhdWx0PzogYm9vbGVhblxuICAgIC8qKiBXZXRoZXIgdG8gaGFzaCBvYmplY3RzIG9yIG5vdCAqL1xuICAgIGhhc2g/OiBib29sZWFuXG4gICAgLyoqIFN0b3JhZ2UgdG8gdXNlIC0gd2lsbCBkZWZhdWx0cyB0byB3aW5kb3cgc3RvcmFnZSAqL1xuICAgIHN0b3JhZ2U/OiBTdG9yYWdlXG4gICAgfSkge1xuICAgIFx0dGhpcy5wcmVmaXggPSBhc3NpZ25WYWx1ZShDQUNIRV9QUkVGSVgsIHByZWZpeCk7XG4gICAgXHR0aGlzLnN1ZmZpeCA9IGFzc2lnblZhbHVlKENBQ0hFX1NVRkZJWCwgc3VmZml4KTtcbiAgICBcdHRoaXMuY2FuVXNlSnNvbiA9IGlzSlNPTlN1cHBvcnRlZCgpO1xuICAgIFx0dGhpcy5mb3JjZUJ5RGVmYXVsdCA9IGZvcmNlQnlEZWZhdWx0O1xuICAgIFx0dGhpcy5zaG91bGRIYXNoID0gaGFzaDtcbiAgICBcdGlmIChzdG9yYWdlID09PSB1bmRlZmluZWQpIHtcbiAgICBcdFx0aWYgKGlzU3RvcmFnZVN1cHBvcnRlZCgpID09PSB0cnVlKSB7XG4gICAgXHRcdFx0dGhpcy5zdG9yYWdlID0gbG9jYWxTdG9yYWdlO1xuICAgIFx0XHR9XG4gICAgXHR9IGVsc2Uge1xuICAgIFx0XHQvLyBUT0RPOiBhZGQgdmFsaWRhdGlvblxuICAgIFx0XHR0aGlzLnN0b3JhZ2UgPSBzdG9yYWdlO1xuICAgIFx0fVxuICAgIFx0cmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFNldCB0aGlzIGNhY2hlIGFzIHRoZSBkZWZhdWx0IGNhY2hlXG4gICAgICovXG4gICAgdXNlQXNEZWZhdWx0Q2FjaGUoKSB7XG4gICAgXHRzaGFyZWRDYWNoZSA9IHRoaXM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIG51bWJlciBvZiBtaWxsaXMgc2luY2UgdGhlIGVwb2NoLlxuICAgICAqL1xuICAgIHN0YXRpYyBub3cgPSAoKTogbnVtYmVyID0+IE1hdGguZmxvb3IobmV3IERhdGUoKS5nZXRUaW1lKCkpXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgZnVsbCBzdHJpbmcgb2YgdGhlIGtleSBjb3JyZXNwb25zaW5nIHRvIHRoZSBjYWNoZSB0aW1lLlxuICAgICAqL1xuICAgIGdlbmVyYXRlVGltZU9mQ2FjaGVLZXkoa2V5OiBzdHJpbmcpIHtcbiAgICBcdHJldHVybiB0aGlzLnByZWZpeCArIGtleSArIHRoaXMuc3VmZml4O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBmdWxsIHN0cmluZyBmb3IgdGhlIHRoaXMuc3RvcmFnZSBpdGVtLlxuICAgICAqL1xuICAgIGdlbmVyYXRlSXRlbUtleShrZXk6IHN0cmluZykge1xuICAgIFx0cmV0dXJuIHRoaXMucHJlZml4ICsga2V5O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBTYXZlIGFuIG9iamVjdCB0byBsb2NhbCBzdG9yYWdlLlxuICAgICAqIEBwYXJhbSBrZXkgdW5pcXVlIGtleSBmb3IgdGhpcyBvYmplY3RcbiAgICAgKiBAcGFyYW0gb2JqZWN0IHRoZSBvYmplY3QgdG8gY2FjaGVcbiAgICAgKiBAcGFyYW0gZm9yY2Ugb3ZlcnJpZGUgJ2ZvcmNlQnlEZWZhdWx0J1xuICAgICAqL1xuICAgIHNldChcbiAgICBcdGtleTogc3RyaW5nLFxuICAgIFx0b2JqZWN0OiBzdHJpbmcgfCBvYmplY3QsXG4gICAgXHRmb3JjZTogdW5kZWZpbmVkIHwgYm9vbGVhblxuICAgICk6IGJvb2xlYW4ge1xuICAgIFx0Ly8gbWFrZSBzdXJlIHdlIGNhbiBzdG9yZVxuICAgIFx0aWYgKHRoaXMuc3RvcmFnZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgXHRcdHJldHVybiBmYWxzZTtcbiAgICBcdH1cbiAgICBcdC8vIG1ha2Ugc3VyZSBrZXkgaXMgYSBzdHJpbmdcbiAgICBcdGlmICh0eXBlb2Yga2V5ICE9PSBcInN0cmluZ1wiKSB7XG4gICAgXHRcdHJldHVybiBmYWxzZTtcbiAgICBcdH1cbiAgICBcdGxldCBfb2JqZWN0ID0gdW5kZWZpbmVkO1xuICAgIFx0Ly8gZG8gd2UgbmVlZCB0byBzZXJpYWxpemUgP1xuICAgIFx0aWYgKHR5cGVvZiBvYmplY3QgPT09IFwic3RyaW5nXCIpIHtcbiAgICBcdFx0X29iamVjdCA9IG9iamVjdDtcbiAgICBcdH0gZWxzZSB7XG4gICAgXHRcdC8vIHdlIG5lZWQgdG8gc2VyaWFsaXplXG4gICAgXHRcdGlmICh0aGlzLmNhblVzZUpzb24gPT09IGZhbHNlKSB7XG4gICAgXHRcdFx0cmV0dXJuIGZhbHNlO1xuICAgIFx0XHR9XG4gICAgXHRcdC8vIGF0dGVtcHQgdG8gc2VyaWFsaXplXG4gICAgXHRcdHRyeSB7XG4gICAgXHRcdFx0X29iamVjdCA9IEpTT04uc3RyaW5naWZ5KG9iamVjdCk7XG4gICAgXHRcdH0gY2F0Y2ggKGUpIHtcbiAgICBcdFx0XHQvLyBjb3VsZCBub3Qgc2VyaWFsaXplIG9iamVjdCwgZG9udCBib3RoZXIgc3RvcmluZyBpdFxuICAgIFx0XHRcdHJldHVybiBmYWxzZTtcbiAgICBcdFx0fVxuICAgIFx0fVxuICAgIFx0Ly8gZ2VuZXJhdGUgdGhlIHN0b3JhZ2UgdGhlIGtleVxuICAgIFx0Y29uc3QgX2tleSA9IHRoaXMuZ2VuZXJhdGVJdGVtS2V5KGtleSk7XG4gICAgXHRpZiAodGhpcy5zZXRSb3V0aW5lKF9rZXksIF9vYmplY3QsIGZvcmNlKSA9PT0gZmFsc2UpIHtcbiAgICBcdFx0cmV0dXJuIGZhbHNlO1xuICAgIFx0fVxuICAgIFx0Y29uc3QgX3RPQ0tleSA9IHRoaXMuZ2VuZXJhdGVUaW1lT2ZDYWNoZUtleShrZXkpO1xuICAgIFx0Y29uc3QgX3RpbWUgPSBMU0NhY2hlLm5vdygpLnRvU3RyaW5nKCk7XG4gICAgXHRpZiAodGhpcy5zZXRSb3V0aW5lKF90T0NLZXksIF90aW1lLCBmb3JjZSkgPT09IGZhbHNlKSB7XG4gICAgXHRcdC8vIGNvdWxkIG5vdCBzdG9yZSB0aW1lXG4gICAgXHRcdC8vIGFib3J0IHRoZSBvcGVyYXRpb24gYW5kIGRlbGV0ZSB0aGUgb2JqZWN0XG4gICAgXHRcdHRoaXMuc3RvcmFnZS5yZW1vdmVJdGVtKF9rZXkpO1xuICAgIFx0XHRyZXR1cm4gZmFsc2U7XG4gICAgXHR9XG4gICAgXHRyZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogR2V0IGFuIG9iamVjdCB3aXRoIGV4cGlyYXRpb24gZGF0ZS5cbiAgICAgKiBXaWxsIHJldHVybiBudWxsIG90aGVyd2lzZS5cbiAgICAgKiBAcGFyYW0ga2V5IHRoZSBvYmplY3Qga2V5XG4gICAgICogQHBhcmFtIG1heEFnZSBtYXggdGltZSBhZ2UgaW4gbWlsbGlzXG4gICAgICovXG4gICAgZ2V0KGtleTogc3RyaW5nLCBtYXhBZ2U6IG51bWJlcik6IGFueSB8IG51bGwge1xuICAgIFx0aWYgKHRoaXMuc3RvcmFnZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgXHRcdHJldHVybiBudWxsO1xuICAgIFx0fVxuICAgIFx0Y29uc3QgX2tleSA9IHRoaXMuZ2VuZXJhdGVJdGVtS2V5KGtleSk7XG4gICAgXHRjb25zdCBfb2JqZWN0ID0gdGhpcy5zdG9yYWdlLmdldEl0ZW0oX2tleSk7XG4gICAgXHRpZiAoIV9vYmplY3QpIHtcbiAgICBcdFx0cmV0dXJuIG51bGw7XG4gICAgXHR9XG4gICAgXHQvLyBjaGVjayB0aW1lXG4gICAgXHRjb25zdCB0T0NLZXkgPSB0aGlzLmdlbmVyYXRlVGltZU9mQ2FjaGVLZXkoa2V5KTtcbiAgICBcdGxldCB0aW1lT2ZDYWNoZTogc3RyaW5nIHwgbnVsbCA9IHRoaXMuc3RvcmFnZS5nZXRJdGVtKHRPQ0tleSk7XG4gICAgXHRpZiAodGltZU9mQ2FjaGUgPT09IG51bGwpIHtcbiAgICBcdFx0Ly8gY29ycnVwdCBzdG9yYWdlLCBhYm9ydFxuICAgIFx0XHRyZXR1cm4gbnVsbDtcbiAgICBcdH1cbiAgICBcdGNvbnN0IG5vdyA9IExTQ2FjaGUubm93KCk7XG4gICAgXHRpZiAobm93IC0gcGFyc2VJbnQodGltZU9mQ2FjaGUpID4gbWF4QWdlKSB7XG4gICAgXHRcdHRoaXMuc3RvcmFnZS5yZW1vdmVJdGVtKF9rZXkpO1xuICAgIFx0XHR0aGlzLnN0b3JhZ2UucmVtb3ZlSXRlbSh0T0NLZXkpO1xuICAgIFx0XHRyZXR1cm4gbnVsbDtcbiAgICBcdH1cbiAgICBcdC8vIGlmIHdlIGNhbnQsIHJldHVybiB0aGUgb2JqZWN0IHdpdGhvdXQgcGFyc2luZyBpdFxuICAgIFx0aWYgKHRoaXMuY2FuVXNlSnNvbikge1xuICAgIFx0XHR0cnkge1xuICAgIFx0XHRcdHJldHVybiBKU09OLnBhcnNlKF9vYmplY3QpO1xuICAgIFx0XHR9IGNhdGNoIChlKSB7XG4gICAgXHRcdFx0cmV0dXJuIF9vYmplY3Q7XG4gICAgXHRcdH1cbiAgICBcdH0gZWxzZSB7XG4gICAgXHRcdHJldHVybiBfb2JqZWN0O1xuICAgIFx0fVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBTYXZlIGdyb3VwIG9mIG9iamVjdHMgdG8gbG9jYWwgc3RvcmFnZS5cbiAgICAgKiBFaXRoZXIgdGhleSBhbGwgZmFpbCwgb3IgYWxsIHN1Y2NlZWQuXG4gICAgICogQHBhcmFtIG9iamVjdHMgdGhlIG9iamVjdHMgdG8gY2FjaGVcbiAgICAgKiBAcGFyYW0gZm9yY2Ugb3ZlcnJpZGUgJ2ZvcmNlQnlEZWZhdWx0J1xuICAgICAqL1xuICAgIHNldEJhdGNoKFxuICAgIFx0b2JqZWN0czogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfCBvYmplY3QgfSxcbiAgICBcdGZvcmNlOiBib29sZWFuIHwgdW5kZWZpbmVkXG4gICAgKTogYm9vbGVhbiB7XG4gICAgXHRpZiAodGhpcy5zdG9yYWdlID09PSB1bmRlZmluZWQpIHtcbiAgICBcdFx0cmV0dXJuIGZhbHNlO1xuICAgIFx0fVxuICAgIFx0cmV0dXJuIE9iamVjdC5rZXlzKG9iamVjdHMpLmV2ZXJ5KChrZXksIGluZGV4LCBhcnJheSkgPT4ge1xuICAgIFx0XHRjb25zdCByZXN1bHQgPSB0aGlzLnNldChrZXksIG9iamVjdHNba2V5XSwgZm9yY2UpO1xuICAgIFx0XHRpZiAocmVzdWx0ID09PSBmYWxzZSkge1xuICAgIFx0XHRcdC8vIHJvbGxiYWNrIGJ5IHJlbW92aW5nIGluc2VydGVkIGl0ZW1zXG4gICAgXHRcdFx0Zm9yIChsZXQgaSA9IGluZGV4OyBpID4gLTE7IGktLSkge1xuICAgIFx0XHRcdFx0Y29uc3QgX2tleSA9IGFycmF5W2ldO1xuICAgIFx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxuICAgIFx0XHRcdFx0dGhpcy5zdG9yYWdlLnJlbW92ZUl0ZW0oX2tleSk7XG4gICAgXHRcdFx0fVxuICAgIFx0XHRcdHJldHVybiBmYWxzZTtcbiAgICBcdFx0fVxuICAgIFx0XHRyZXR1cm4gdHJ1ZTtcbiAgICBcdH0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBQcml2YXRlIC0gU2V0IFJvdXRpbmVcbiAgICAgKi9cbiAgICBwcml2YXRlIHNldFJvdXRpbmUoXG4gICAgXHRmaW5hbEtleTogc3RyaW5nLFxuICAgIFx0ZmluYWxWYWx1ZTogc3RyaW5nLFxuICAgIFx0Zm9yY2U6IGJvb2xlYW4gfCB1bmRlZmluZWRcbiAgICApOiBib29sZWFuIHtcbiAgICBcdGlmICh0aGlzLnN0b3JhZ2UgPT09IHVuZGVmaW5lZCkge1xuICAgIFx0XHRyZXR1cm4gZmFsc2U7XG4gICAgXHR9XG4gICAgXHR0cnkge1xuICAgIFx0XHR0aGlzLnN0b3JhZ2Uuc2V0SXRlbShmaW5hbEtleSwgZmluYWxWYWx1ZSk7XG4gICAgXHR9IGNhdGNoIChlcnJvcikge1xuICAgIFx0XHQvLyBjb3VsZCBub3Qgc3RvcmUgb2JqZWN0XG4gICAgXHRcdGlmIChpc0Vycm9yQmVjYXVzZVN0b3JhZ2VJc09mT3V0T2ZTcGFjZShlcnJvcikgPT09IGZhbHNlKSB7XG4gICAgXHRcdFx0cmV0dXJuIGZhbHNlO1xuICAgIFx0XHR9XG5cbiAgICBcdFx0Ly8gc2hvdWxkIHdlIGZvcmNlIGl0ID9cbiAgICBcdFx0aWYgKCEoZm9yY2UgPT09IHRydWUgfHwgKHRoaXMuZm9yY2VCeURlZmF1bHQgJiYgZm9yY2UgIT09IGZhbHNlKSkpIHtcbiAgICBcdFx0XHRyZXR1cm4gZmFsc2U7XG4gICAgXHRcdH1cblxuICAgIFx0XHQvLyBzaW5jZSB3ZSBjYW4gZm9yY2UsIGxldHMgZXhhdXN0IGFsbCBjYXNlc1xuICAgIFx0XHR0cnkge1xuICAgIFx0XHRcdHJldHVybiB0aGlzLnNldEFuZEtlZXBUcnlpbmcoZmluYWxLZXksIGZpbmFsVmFsdWUpO1xuICAgIFx0XHR9IGNhdGNoIChlcnJvcikge1xuICAgIFx0XHRcdHJldHVybiBmYWxzZTtcbiAgICBcdFx0fVxuICAgIFx0fVxuICAgIFx0cmV0dXJuIHRydWU7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFByaXZhdGUgLSBTZXQgYW5kIGtlZXAgdHJ5aW5nIGFuZCB3ZSBzdWNjZWVlZC5cbiAgICAgKiBUaGlzIHdpbGwga2VlcCBjbGVhcmluZyBvbGQgZGF0YSB1cCB1bnRpbGwgd2UgYXJlIGFibGUgdG8gaW5zZXJ0IG91ciBvYmplY3QuXG4gICAgICovXG4gICAgcHJpdmF0ZSBzZXRBbmRLZWVwVHJ5aW5nKGZpbmFsS2V5OiBzdHJpbmcsIGZpbmFsVmFsdWU6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIFx0aWYgKHRoaXMuc3RvcmFnZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgXHRcdHJldHVybiBmYWxzZTtcbiAgICBcdH1cbiAgICBcdHRyeSB7XG4gICAgXHRcdHRoaXMuc3RvcmFnZS5zZXRJdGVtKGZpbmFsS2V5LCBmaW5hbFZhbHVlKTtcbiAgICBcdFx0cmV0dXJuIHRydWU7XG4gICAgXHR9IGNhdGNoIChlcnJvcikge1xuICAgIFx0XHQvLyBjb3VsZCBub3Qgc3RvcmUgb2JqZWN0XG4gICAgXHRcdGlmIChpc0Vycm9yQmVjYXVzZVN0b3JhZ2VJc09mT3V0T2ZTcGFjZShlcnJvcikgPT09IGZhbHNlKSB7XG4gICAgXHRcdFx0dGhyb3cgXCJcIjtcbiAgICBcdFx0fVxuICAgIFx0XHRpZiAodGhpcy5jbGVhbkNhY2hlKCkpIHtcbiAgICBcdFx0XHQvLyB3ZSB3ZXJlIGFibGUgdG8gY2xlYXIgc29tZSBjYWNoZVxuICAgIFx0XHRcdC8vIHRyeSBhZ2FpblxuICAgIFx0XHRcdHJldHVybiB0aGlzLnNldEFuZEtlZXBUcnlpbmcoZmluYWxLZXksIGZpbmFsVmFsdWUpO1xuICAgIFx0XHR9IGVsc2Uge1xuICAgIFx0XHRcdC8vIHdlIHdlcmUgbm90IGFibGUgdG8gY2xlYXIgc29tZSBjYWNoZVxuICAgIFx0XHRcdHRocm93IFwiXCI7XG4gICAgXHRcdH1cbiAgICBcdH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogUmVtb3ZlIG9sZCBpdGVtcyBmcm9tIGNhY2hlXG4gICAgICovXG4gICAgY2xlYW5DYWNoZSgpOiBib29sZWFuIHtcbiAgICBcdGlmICh0aGlzLnN0b3JhZ2UgPT09IHVuZGVmaW5lZCkge1xuICAgIFx0XHRyZXR1cm4gZmFsc2U7XG4gICAgXHR9XG4gICAgXHRpZiAodGhpcy5zdG9yYWdlLmxlbmd0aCA8IDIpIHtcbiAgICBcdFx0cmV0dXJuIGZhbHNlO1xuICAgIFx0fVxuICAgIFx0Y29uc3Qga2V5MSA9IHRoaXMuc3RvcmFnZS5rZXkoMCk7XG4gICAgXHRjb25zdCBrZXkyID0gdGhpcy5zdG9yYWdlLmtleSgxKTtcbiAgICBcdC8vIEB0cy1pZ25vcmVcbiAgICBcdHRoaXMuc3RvcmFnZS5yZW1vdmVJdGVtKGtleTEpO1xuICAgIFx0Ly8gQHRzLWlnbm9yZVxuICAgIFx0dGhpcy5zdG9yYWdlLnJlbW92ZUl0ZW0oa2V5Mik7XG4gICAgXHRyZXR1cm4gdHJ1ZTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IExTQ2FjaGU7XG4iXX0=