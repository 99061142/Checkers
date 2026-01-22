import { getInitialSettings, isSettingsNodeAnObjectNode, SAVABLE_LEAF_NODE_PROPERTIES, Settings, SettingsValidationErrors, SettingsLeafNode, SettingsTreeNode } from "./SettingsProviderUtils.ts";

/**
 * Type representing the result of the settings validation.
 * - settings: The validated settings object. If no changes were needed, this will be the same as the input settings.
 * - validationErrors: Array of validation errors encountered.
 * - shouldDeleteSavedGameData: Flag indicating if saved game data should be deleted due to validation issues.
 */
interface SettingsValidationResult {
    settings: Settings;
    validationErrors: SettingsValidationErrors;
    shouldDeleteSavedGameData: boolean;
}

/**
 * Validates the provided settings object.
 * 
 * Returns a validated settings where:
 * - Missing settings are added with default values.
 * - Invalid ('garbage') properties are deleted.
 * - Properties with invalid values (types or non-allowed values) are reset to default values.
 * 
 * Any errors found during validation are returned in the validationErrors array.
 * 
 * If any game settings were removed or reset due to validation errors that could affect saved game data, the 'shouldDeleteSavedGameData' flag is set to true.
 * This indicates that any saved game data should be deleted to prevent inconsistencies.
 * 
 * @param {Settings} settings - The settings object to validate.
 * @param {Settings} referenceSettings - The reference settings object to use for defaults and structure.
 * @returns {SettingsValidationResult} The validation result containing the (updated) validated settings and additional info.
 */
export function validateSettings(settings: Settings, referenceSettings: Settings = getInitialSettings()): SettingsValidationResult {
    const validationErrors: SettingsValidationErrors = [];
    let shouldDeleteSavedGameData: boolean = false;
    
    /**
     * Recursively validates the settings object.
     * @param {unknown} currentSettings - The current settings value to validate.
     * @param {SettingsTreeNode} referenceSettings - The reference settings (sub-)object to use for defaults and structure.
     * @param {string[]} path - The current path in the settings (sub-)object (used to report errors). Defaults to an empty array.
     * @returns {SettingsTreeNode} The validated settings (sub-)object.
     */
    function validateRecursive(currentSettings: unknown, referenceSettings: SettingsTreeNode, path: string[] = []): SettingsTreeNode {
        // If the currentSettings (sub-)object is not an object, reset the (sub-)object to the referenceSettings (sub-)object.
        if (!isSettingsNodeAnObjectNode(currentSettings)) {
            validationErrors.push({
                message: `Missing or invalid settings (sub-)object at path: ${path.join('.')}. Resetting to initial settings (sub-)object.`,
                logType: "error"
            });
            return referenceSettings;
        }

        // Create a new validated settings object to populate
        const validatedSettings: SettingsTreeNode = {};
        const currentSettingsObject = currentSettings as SettingsTreeNode;

        // Check for garbage properties (properties that exist in currentSettings but not in referenceSettings)
        for (const key in currentSettingsObject) {
            // If the key does not exist in the referenceSettings, it's garbage.
            // This means we will not copy it to the validated settings object
            if (!(key in referenceSettings)) {
                validationErrors.push({
                    message: `Unknown setting property '${key}' at path: ${path.join('.')}. Removing garbage property.`,
                    logType: "warning"
                });
            }
        }

        // Validate each property in the referenceSettings (sub-)object
        for (const key in referenceSettings) {
            const currentValue = currentSettingsObject[key];
            const currentPath = [...path, key];
            const referenceValue = referenceSettings[key];

            // If the reference value is an object node, recurse into it
            if (isSettingsNodeAnObjectNode(referenceValue)) {
                // If the current value is also an object node, recurse into it.
                // Otherwise, we will reset it to the reference value in the recursive call
                validatedSettings[key] = validateRecursive(isSettingsNodeAnObjectNode(currentValue) ? currentValue : {}, referenceValue, currentPath);
                continue;
            }

            // For properties we don't want to save in the local storage (e.g., 'options'), always use the reference value.
            // These are metadata properties that don't get saved/loaded from localStorage, but will be added back during validation / initialization
            if (!SAVABLE_LEAF_NODE_PROPERTIES.includes(key)) {
                validatedSettings[key] = referenceValue;
                continue;
            }

            // If the property is missing in the currentSettings, add it with the default value from the reference settings
            if (currentValue === undefined) {
                validatedSettings[key] = referenceValue;
                validationErrors.push({
                    message: `Missing setting at path: ${currentPath.join('.')}. Adding default value.`,
                    logType: "warning"
                });
                continue;
            }

            // If this setting property has defined options (which means it isn't a boolean), validate that the current value is one of the allowed options
            const siblingOptionsArray = (referenceSettings as SettingsLeafNode).options;
            if (siblingOptionsArray !== undefined) {
                // If the options property is not an array, log an error and reset to default
                if (!Array.isArray(siblingOptionsArray)) {
                    validationErrors.push({
                        message: `Invalid 'options' property for setting at path: ${currentPath.join('.')}. Expected an array of options.`,
                        logType: "error"
                    });

                    // Reset to default value
                    validatedSettings[key] = referenceValue;

                    continue;
                }

                // If the current value is not in the allowed options, reset to default
                if (!siblingOptionsArray.includes(currentValue)) {
                    validationErrors.push({
                        message: `Invalid value for setting at path: ${currentPath.join('.')}. Value '${currentValue}' is not in allowed options [${siblingOptionsArray.join(', ')}]. Resetting to default value.`,
                        logType: "error"
                    });

                    // If this is a game-related setting, mark that we need to delete saved game data
                    if (currentPath[0] === "game") {
                        shouldDeleteSavedGameData = true;
                    }

                    // Reset to default value
                    validatedSettings[key] = referenceValue;

                    continue;
                }
            }

            // If the current value's type does not match the reference value's type, reset to default
            if (typeof currentValue !== typeof referenceValue) {
                validationErrors.push({
                    message: `Invalid type for setting at path: ${currentPath.join('.')}. Expected type '${typeof referenceValue}', but got type '${typeof currentValue}'. Resetting to default value.`,
                    logType: "error"
                });

                // If this is a game-related setting, mark that we need to delete saved game data
                if (currentPath[0] === "game") {
                    shouldDeleteSavedGameData = true;
                }

                // Reset to default value
                validatedSettings[key] = referenceValue;

                continue;
            }

            // If we have reached this point, the current value is valid.
            // Therefore, we copy it to the validated settings object
            validatedSettings[key] = currentValue;
        }

        return validatedSettings;
    }

    // Start validation from the root of the settings object
    const validatedSettings = validateRecursive(settings, referenceSettings) as Settings;
    
    return {
        settings: validatedSettings,
        validationErrors,
        shouldDeleteSavedGameData
    }
}