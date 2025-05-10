import defaultSettings from './defaultSettings.json';

// This function is called in the App.js file, inside the componentDidMount() method
// It will run every time the app is opened
export function initializeSettings() {
    // If the settings are not yet set in local storage, set them to the default settings
    // This will happen only the first time the app is opened
    if (localStorage.getItem('settings') === null)
        setDefaultSettings();
    else
        // If the settings are already set in local storage, update them for any missing settings
        // This will happen every time the app is opened, to check if any settings are missing, even if none of the settings are missing
        updateSettingsBasedOnDefaultSettings();
}

export function getGameRules() {
    const settings = getSettings();
    const gameRules = settings.gameRules;
    return gameRules
}

export function getSettings() {
    // If the local storaged settings are not set, throw an error
    const settings = JSON.parse(localStorage.getItem('settings'));
    if (settings === null) {
        throw new Error("Error: The settings are not set. Please call the initializeSettings() function inside the componentDidMount() method of the App.js file.");
    }

    // If the local storaged settings are set, return them
    return settings
}

export function setSettings(settings) {
    // Set the localstorage to the given settings
    localStorage.setItem('settings', JSON.stringify(settings));
}

function setDefaultSettings() {
    // Function to set the localstorage settings to the default settings
    setSettings(defaultSettings); 
}

// Function to add any missing settings to the localstorage settings, based on the default settings,
// It could also remove any settings that are not in the default settings, if a user has added any settings to the localstorage settings that are not in the default settings
function updateSettingsBasedOnDefaultSettings() {
    // An example of this is if the local storage 'settings' value = {a: {b: 1}} and the json file added a 'c' value inside the 'a' key value object = {a: {b: 1, c: 2}}, the local storage 'setting' value will be updated to {a: {b: 1, c: 2}}.
    // Another example of this code is if the local storage 'settings' value = {a: {b: 1, c: 2}} and the defaultSettings JSOn file = {a: {b: 1}}, 
    // This would mean that the 'c' key is not in the defaultSettings JSON file, so it will be deleted from the local storage settings, and the local storage settings will be updated to {a: {b: 1}}
    const updatedLocalStoragedSettings = JSON.parse(localStorage.getItem('settings'));
    function depthSearch(obj1, obj2) {
        for (const key in obj2) {
            // If the key is missing in the local storaged settings, add the key and its value to the local storaged settings
            if (obj1[key] === undefined) {
                obj1[key] = obj2[key];
                continue
            }
            
            // If the key is an object, Recursively check deeper levels of the object
            if (typeof obj2[key] === 'object')
                depthSearch(obj1[key], obj2[key]);
        }

        // If the key is not in the default settings, delete it from the local storaged settings
        for (const key in obj1) {
            if (obj2[key] === undefined)
                delete obj1[key];
        }
    }
    // Add or remove any changes to the local storaged settings based on the default settings
    // This will add any missing settings to the local storage settings, and remove any settings that are not in the default settings
    depthSearch(updatedLocalStoragedSettings, defaultSettings);

    // Set the local storage settings to the updated settings which includes the missing settings, and removed the settings that are not in the default settings
    // This function will also be called if no settings are missing, or added
    setSettings(updatedLocalStoragedSettings);
}