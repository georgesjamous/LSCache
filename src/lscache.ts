import {
  assignValue,
  isStorageSupported,
  isJSONSupported,
  isErrorBecauseStorageIsOfOutOfSpace
} from "./helpers";

// The default prefix we will use for our cache
export const CACHE_PREFIX = "sr-";
// The defautl suffix we will use for our time of cache
export const CACHE_SUFFIX = "-toc";

class LSCache {
  prefix: string;
  suffix: string;
  isStorageSupported: boolean | undefined;
  isJSONSupported: boolean | undefined;
  forceByDefault: boolean;
  shouldHash: boolean;
  constructor({
    prefix,
    suffix,
    forceByDefault = false,
    hash = false
  }: {
    prefix: string;
    suffix: string;
    forceByDefault: boolean;
    hash: boolean;
  }) {
    this.prefix = assignValue(CACHE_PREFIX, prefix);
    this.suffix = assignValue(CACHE_SUFFIX, suffix);
    this.isStorageSupported = undefined;
    this.isJSONSupported = undefined;
    this.forceByDefault = forceByDefault;
    this.shouldHash = hash;
  }
  /**
   * Returns the number of millis since the epoch.
   */
  static now = (): number => Math.floor(new Date().getTime());
  /**
   * Determines if localStorage is supported in the browser.
   */
  get canStoreObject(): boolean {
    if (this.isStorageSupported !== undefined) {
      return this.isStorageSupported;
    }
    this.isStorageSupported = isStorageSupported();
    return this.isStorageSupported;
  }
  /**
   * Determines native JSON (de-)serialization is supported in the browser.
   */
  get canUseJson(): boolean {
    if (this.isJSONSupported !== undefined) {
      return this.isJSONSupported;
    }
    this.isJSONSupported = isJSONSupported();
    return this.isJSONSupported;
  }
  /**
   * Returns the full string of the key corresponsing to the cache time.
   */
  generateTimeOfCacheKey(key: string) {
    return this.prefix + key + this.suffix;
  }
  /**
   * Returns the full string for the localStorage item.
   */
  generateItemKey(key: string) {
    return this.prefix + key;
  }
  /**
   * Save an object to local storage.
   * @param key unique key for this object
   * @param object the object to cache
   * @param force override 'forceByDefault'
   */
  set(
    key: string,
    object: string | object,
    force: undefined | boolean
  ): boolean {
    // make sure we can store
    if (this.canStoreObject === false) {
      return false;
    }
    // make sure key is a string
    if (typeof key !== "string") {
      return false;
    }
    let _object = undefined;
    // do we need to serialize ?
    if (typeof object === "string") {
      _object = object;
    } else {
      // we need to serialize
      if (this.isJSONSupported === false) {
        return false;
      }
      // attemp to serialize
      try {
        _object = JSON.stringify(object);
      } catch (e) {
        // could not serialize object, dont bother storing them
        return false;
      }
    }
    // generate storage the key
    const _key = this.generateItemKey(key);
    if (this.setRoutine(_key, _object, force === true) === false) {
      return false;
    }
    const _tOCKey = this.generateTimeOfCacheKey(key);
    const _time = LSCache.now().toString();
    if (this.setRoutine(_tOCKey, _time, force === true) === false) {
      // could not store time
      // abort the operation
      localStorage.removeItem(_key);
      return false;
    }
    return true;
  }
  /**
   * If an object was stored with an expiration date.
   * maxAge will be ignored.
   * @param key the object key
   * @param maxAge max time age in millis
   */
  get(key: string, maxAge: number): any {
    if (this.canStoreObject === false) {
      return undefined;
    }
    const _key = this.generateItemKey(key);
    const _object = localStorage.get(_key);
    if (!_object) {
      return undefined;
    }
    // check time
    const tocKey = this.generateTimeOfCacheKey(key);
    let timeOfCache: string | null = localStorage.getItem(tocKey);
    if (timeOfCache === null) {
      return undefined;
    }
    const now = LSCache.now();
    if (parseInt(timeOfCache) - now > maxAge) {
      return undefined;
    }
    if (this.isJSONSupported) {
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
   * Either thei all fail, or all succeed.
   * @param objects the objects to cache
   * @param force override 'forceByDefault'
   */
  setBatch(
    objects: { [key: string]: string | object },
    force: boolean | undefined
  ): boolean {
    if (this.canStoreObject === false) {
      return false;
    }
    return Object.keys(objects).every((key, index, array) => {
      const result = this.set(key, objects[key], force);
      if (result === false) {
        // rollback by removing success
        for (let i = index; index > -1; i--) {
          const _key = array[i];
          localStorage.removeItem(_key);
        }
        return false;
      }
    });
  }
  /**
   * Private - Set Routine
   */
  private setRoutine(
    finalKey: string,
    finalValue: string,
    force: boolean
  ): boolean {
    try {
      localStorage.setItem(finalKey, finalValue);
    } catch (error) {
      // could not store object
      if (isErrorBecauseStorageIsOfOutOfSpace(error) === false) {
        return false;
      }
      // clean to clean cache, maybe we have some expired items
      this.cleanCache(false);
      // try again
      try {
        localStorage.setItem(finalKey, finalValue);
      } catch (error) {
        // could not sore object even after gracefully clearing cache
        if (isErrorBecauseStorageIsOfOutOfSpace(error) === false) {
          return false;
        }
        // should we force it ?
        if (!(force === true || (this.forceByDefault && force !== false))) {
          return false;
        }
        // since we can force, lets exaust all cases
        try {
          return this.setAndKeepTrying(finalKey, finalValue);
        } catch (error) {
          return false;
        }
      }
    }
    return true;
  }
  /**
   * Private - Set and keep trying and we succeeed.
   * This will keep clearing old data up untill we are able to insert our object.
   */
  private setAndKeepTrying(finalKey: string, finalValue: string): boolean {
    try {
      localStorage.setItem(finalKey, finalValue);
      return true;
    } catch (error) {
      // could not store object
      if (isErrorBecauseStorageIsOfOutOfSpace(error) === false) {
        throw "";
      }
      if (this.cleanCache(true)) {
        // we were able to clear some cache
        // try again
        return this.setAndKeepTrying(finalKey, finalValue);
      } else {
        // we were not able to clear some cache
        throw "";
      }
    }
  }

  cleanCache(forced: boolean) {}
}

export default LSCache;
