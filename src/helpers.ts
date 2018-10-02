/**
 * Just a helper method to replace default values
 * @param defaultValue
 * @param value
 */
export const assignValue = (
	defaultValue: string,
	value: string | undefined | null
) => (value === undefined || value === null ? defaultValue : value);

/**
 * Test to check if storage is not supported.
 */
export const isStorageSupported = (): boolean => {
	// Prepare a test case
	var key = "__ls__cache__test__";
	var value = key;
	// some browsers will throw an error if you try to access local storage (e.g. brave browser)
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
export const isErrorBecauseStorageIsOfOutOfSpace = (e: any) => {
	return (
		e &&
        (e.name === "QUOTA_EXCEEDED_ERR" ||
            e.name === "NS_ERROR_DOM_QUOTA_REACHED" ||
            e.name === "QuotaExceededError")
	);
};

/**
 * Determines if native JSON (de-)serialization is supported in the browser.
 */
export const isJSONSupported = (): boolean =>
	typeof JSON === "object" && typeof JSON.parse === "function";

/**
 * Returns a string where all RegExp special characters are escaped with a \.
 */
export const escapeRegExpSpecialCharacters = (text: string) => {
	return text.replace(/[[\]{}()*+?.\\^$|]/g, "\\$&");
};
