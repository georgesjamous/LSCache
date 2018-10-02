import {
	assignValue,
	isStorageSupported,
	isJSONSupported,
	isErrorBecauseStorageIsOfOutOfSpace,
} from "./helpers";

// The default prefix we will use for our cache
export const CACHE_PREFIX = "sr-";
// The defautl suffix we will use for our time of cache
export const CACHE_SUFFIX = "-toc";

let sharedCache: LSCache | undefined;

class LSCache {
    prefix: string
    suffix: string
    canUseJson: boolean
    forceByDefault: boolean
    shouldHash: boolean
    storage: Storage | undefined
    // ----------------
    static sharedCache = (): LSCache => {
    	if (sharedCache === undefined) {
    		sharedCache = new LSCache({});
    	}
    	return sharedCache;
    }
    // ----------------
    constructor({
    	prefix,
    	suffix,
    	forceByDefault = false,
    	hash = false,
    	storage,
    }: {
    /** Overrides CACHE_PREFIX */
    prefix?: string
    /** Overrides CACHE_SUFFIX */
    suffix?: string
    /** Will clear old stored objects in favor of new ones when cache is full */
    forceByDefault?: boolean
    /** Wether to hash objects or not */
    hash?: boolean
    /** Storage to use - will defaults to window storage */
    storage?: Storage
    }) {
    	this.prefix = assignValue(CACHE_PREFIX, prefix);
    	this.suffix = assignValue(CACHE_SUFFIX, suffix);
    	this.canUseJson = isJSONSupported();
    	this.forceByDefault = forceByDefault;
    	this.shouldHash = hash;
    	if (storage === undefined) {
    		if (isStorageSupported() === true) {
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
    useAsDefaultCache() {
    	sharedCache = this;
    }
    /**
     * Returns the number of millis since the epoch.
     */
    static now = (): number => Math.floor(new Date().getTime())
    /**
     * Returns the full string of the key corresponsing to the cache time.
     */
    generateTimeOfCacheKey(key: string) {
    	return this.prefix + key + this.suffix;
    }
    /**
     * Returns the full string for the this.storage item.
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
    	if (this.storage === undefined) {
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
    		if (this.canUseJson === false) {
    			return false;
    		}
    		// attempt to serialize
    		try {
    			_object = JSON.stringify(object);
    		} catch (e) {
    			// could not serialize object, dont bother storing it
    			return false;
    		}
    	}
    	// generate the storage the key
    	const _key = this.generateItemKey(key);
    	if (this.setRoutine(_key, _object, force) === false) {
    		return false;
    	}
    	const _tOCKey = this.generateTimeOfCacheKey(key);
    	const _time = LSCache.now().toString();
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
    get(key: string, maxAge: number): any | null {
    	if (this.storage === undefined) {
    		return null;
    	}
    	const _key = this.generateItemKey(key);
    	const _object = this.storage.getItem(_key);
    	if (!_object) {
    		return null;
    	}
    	// check time
    	const tOCKey = this.generateTimeOfCacheKey(key);
    	let timeOfCache: string | null = this.storage.getItem(tOCKey);
    	if (timeOfCache === null) {
    		// corrupt storage, abort
    		return null;
    	}
    	const now = LSCache.now();
    	if (now - parseInt(timeOfCache) > maxAge) {
    		this.storage.removeItem(_key);
    		this.storage.removeItem(tOCKey);
    		return null;
    	}
    	// if we cant, return the object without parsing it
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
    setBatch(
    	objects: { [key: string]: string | object },
    	force: boolean | undefined
    ): boolean {
    	if (this.storage === undefined) {
    		return false;
    	}
    	return Object.keys(objects).every((key, index, array) => {
    		const result = this.set(key, objects[key], force);
    		if (result === false) {
    			// rollback by removing inserted items
    			for (let i = index; i > -1; i--) {
    				const _key = array[i];
    				// @ts-ignore
    				this.storage.removeItem(_key);
    			}
    			return false;
    		}
    		return true;
    	});
    }
    /**
     * Private - Set Routine
     */
    private setRoutine(
    	finalKey: string,
    	finalValue: string,
    	force: boolean | undefined
    ): boolean {
    	if (this.storage === undefined) {
    		return false;
    	}
    	try {
    		this.storage.setItem(finalKey, finalValue);
    	} catch (error) {
    		// could not store object
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
    	return true;
    }
    /**
     * Private - Set and keep trying and we succeeed.
     * This will keep clearing old data up untill we are able to insert our object.
     */
    private setAndKeepTrying(finalKey: string, finalValue: string): boolean {
    	if (this.storage === undefined) {
    		return false;
    	}
    	try {
    		this.storage.setItem(finalKey, finalValue);
    		return true;
    	} catch (error) {
    		// could not store object
    		if (isErrorBecauseStorageIsOfOutOfSpace(error) === false) {
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
    cleanCache(): boolean {
    	if (this.storage === undefined) {
    		return false;
    	}
    	if (this.storage.length < 2) {
    		return false;
    	}
    	const key1 = this.storage.key(0);
    	const key2 = this.storage.key(1);
    	// @ts-ignore
    	this.storage.removeItem(key1);
    	// @ts-ignore
    	this.storage.removeItem(key2);
    	return true;
    }
}

export default LSCache;
