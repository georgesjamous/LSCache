export declare const CACHE_PREFIX = "sr-";
export declare const CACHE_SUFFIX = "-toc";
declare class LSCache {
    prefix: string;
    suffix: string;
    canUseJson: boolean;
    forceByDefault: boolean;
    shouldHash: boolean;
    storage: Storage | undefined;
    static sharedCache: () => LSCache;
    constructor({ prefix, suffix, forceByDefault, hash, storage, }: {
        /** Overrides CACHE_PREFIX */
        prefix?: string;
        /** Overrides CACHE_SUFFIX */
        suffix?: string;
        /** Will clear old stored objects in favor of new ones when cache is full */
        forceByDefault?: boolean;
        /** Wether to hash objects or not */
        hash?: boolean;
        /** Storage to use - will defaults to window storage */
        storage?: Storage;
    });
    /**
     * Set this cache as the default cache
     */
    useAsDefaultCache(): void;
    /**
     * Returns the number of millis since the epoch.
     */
    static now: () => number;
    /**
     * Returns the full string of the key corresponsing to the cache time.
     */
    generateTimeOfCacheKey(key: string): string;
    /**
     * Returns the full string for the this.storage item.
     */
    generateItemKey(key: string): string;
    /**
     * Save an object to local storage.
     * @param key unique key for this object
     * @param object the object to cache
     * @param force override 'forceByDefault'
     */
    set(key: string, object: string | object, force: undefined | boolean): boolean;
    /**
     * Get an object with expiration date.
     * Will return null otherwise.
     * @param key the object key
     * @param maxAge max time age in millis
     */
    get(key: string, maxAge: number): any | null;
    /**
     * Save group of objects to local storage.
     * Either they all fail, or all succeed.
     * @param objects the objects to cache
     * @param force override 'forceByDefault'
     */
    setBatch(objects: {
        [key: string]: string | object;
    }, force: boolean | undefined): boolean;
    /**
     * Private - Set Routine
     */
    private setRoutine;
    /**
     * Private - Set and keep trying and we succeeed.
     * This will keep clearing old data up untill we are able to insert our object.
     */
    private setAndKeepTrying;
    /**
     * Remove old items from cache
     */
    cleanCache(): boolean;
}
export default LSCache;
