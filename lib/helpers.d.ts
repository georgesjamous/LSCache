/**
 * Just a helper method to replace default values
 * @param defaultValue
 * @param value
 */
export declare const assignValue: (defaultValue: string, value: string | null | undefined) => string;
/**
 * Test to check if storage is not supported.
 */
export declare const isStorageSupported: () => boolean;
/**
 * Check to set if the error is because we are out of space
 */
export declare const isErrorBecauseStorageIsOfOutOfSpace: (e: any) => boolean;
/**
 * Determines if native JSON (de-)serialization is supported in the browser.
 */
export declare const isJSONSupported: () => boolean;
/**
 * Returns a string where all RegExp special characters are escaped with a \.
 */
export declare const escapeRegExpSpecialCharacters: (text: string) => string;
