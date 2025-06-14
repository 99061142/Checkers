import initialSettings from './initialSettings';

/* 
    * This function is called in the App.js file, inside the componentDidMount() method.
    * It will run every time the application is opened, to check if the settings are already set in local storage.
    * if the settings are not stored in the local storage, it will set them to the initial settings which is found inside of the initialSettings.json file.
*/
export function initializeSettings() {
    // If the settings are not yet set in local storage, set them to the initial settings which is found in the initialSettings.json file.
    // This will only happen when the application is opened for the first time
    if (localStorage.getItem('settings') === null) {
        setSettings(initialSettings); 
        return
    }

    // If the settings are already set in local storage, we run the 'updateSettingsBasedOnInitialSettings' function to check if any settings are missing, and update the local storage settings based on the default settings.
    updateSettingsBasedOnInitialSettings();
}

/*
    * Retrieves the game rules from the settings.
    * If the game rules are not set, it throws an error inside of the getSettings() function
*/
/**
 * @returns {Object} - The game rules object retrieved from the settings.
 */
export function getGameRules() {
    const settings = getSettings();
    const gameRules = settings.gameRules;
    return gameRules
}

/*
    * Retrieves the settings from local storage.
    * If the settings are not set, it throws an error
*/
/**
 * @returns {Object} - The settings object retrieved from local storage.
 */
export function getSettings() {
    // If the settings are not set in the local storage, throw an error
    const settings = JSON.parse(localStorage.getItem('settings'));
    if (settings === null) {
        throw new Error("Error: The settings are not set. Please call the initializeSettings() function inside the componentDidMount() method of the App.js file.");
    }

    // If the settings are set, return the settings
    return settings
}

/*
    * Sets the settings which is passed as an argument to the local storage
*/
/**
 * @param {Object} settings - The settings object to be saved in local storage.
 */
export function setSettings(settings) {
    // Set the settings in the local storage
    localStorage.setItem('settings', JSON.stringify(settings));
}

/*
    * Synchronizes the settings in localStorage with the structure found in the initialSettings.json file.
    * - Adds any missing keys from initialSettings.
    * - Removes any keys not present in initialSettings.
    * This keeps the user's settings up-to-date with the latest structure
*/
function updateSettingsBasedOnInitialSettings() {
    /**
     * @param {Object} obj - The object to check.
     * @returns {boolean} - Returns true if the object is a plain object, false otherwise.
     */
    function isPlainObject(obj) {
        // Check if the object is not null, is of type 'object', and is not an array
        // This ensures that we only consider plain objects, excluding arrays and null values.

        return obj !== null && typeof obj === 'object' && !Array.isArray(obj);
    }
    
    /**
     * @param {Object} obj1 - The object to be updated (localStorage settings).
     * @param {Object} obj2 - The object containing the default settings (initialSettings).
     */
    function depthSearch(obj1, obj2) {
        // Add missing keys from obj2 (initialSettings) to obj1 (localStorage settings)
        for (const key in obj2) {
            if (obj1[key] === undefined) {
                obj1[key] = obj2[key];
                continue;
            }

            // If both are plain objects, recurse
            if (isPlainObject(obj1[key]) && isPlainObject(obj2[key])) {
                depthSearch(obj1[key], obj2[key]);
                continue
            }
            
            // If types differ, replace with default
            if (typeof obj1[key] !== typeof obj2[key]) {
                obj1[key] = obj2[key];
            }
        }

        // Remove keys from obj1 that are not present in obj2
        for (const key in obj1) {
            if (obj2[key] === undefined)
                delete obj1[key];
        }
    }

    // Synchronize the current settings in localStorage with the initialSettings structure.
    // This ensures that the settings in localStorage match the structure of initialSettings
    const currentLocalStoragedSettings = JSON.parse(localStorage.getItem('settings'));
    depthSearch(currentLocalStoragedSettings, initialSettings);

    // Save the synchronized settings back to localStorage.
    // This ensures that the settings in localStorage match the structure of initialSettings:
    // - Any unnecessary settings are removed, preventing potential issues in the future.
    // - Any new default settings added to initialSettings are also added to localStorage.
    setSettings(currentLocalStoragedSettings);
}