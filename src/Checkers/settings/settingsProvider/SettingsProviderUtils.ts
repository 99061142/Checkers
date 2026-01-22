import initialSettings from "./initialSettings.json";
import pkg from "../../../../package.json";

/**
 * The key used to store settings in localStorage.
 */
const _STORAGE_KEY = "settings";

/**
 * Interface representing what is expected to be stored in localStorage if not null.
 * - version: The version of the settings object.
 * - settings: The actual settings object.
 */
interface StoredSettingsData {
    version: SettingsVersion;
    settings: Settings;
}

/**
 * Type representing a node in the settings tree.
 */
export type SettingsTreeNode = Record<string, any>;

/**
 * Type representing a leaf node in the settings tree.
 * - value: The value of the setting.
 * - options: Optional array of possible options for the setting. If the value is a boolean, this will be undefined.
 */
export type SettingsLeafNode = {
    value: any;
    options?: any[];
};

/**
 * Interface representing a settings validation error.
 * - message: The error message.
 * - logType: The type of log (e.g., warning, error, debug).
 */
interface SettingsValidationError {
    message: string;
    logType: "warning" | "error" | "debug" | "info";
}

/**
 * Type representing a tree of keys leading to a specific setting.
 */
export type KeysTree = string[];

/**
 * Type representing an array of settings validation errors.
 */
export type SettingsValidationErrors = SettingsValidationError[]

/**
 * Type representing the settings object structure.
 */
export type Settings = typeof initialSettings;

/**
 * Type representing the settings version.
 */
type SettingsVersion = string;

/**
 * Returns the initial settings for the application.
 * @returns {typeof initialSettings} The initial settings object.
 */
export function getInitialSettings(): Settings {
    return initialSettings;
}

/**
 * Returns the stored settings data from localStorage.
 * @returns {StoredSettingsData | null} The stored settings data or null if not found.
 */
export function getStoredSettingsData(): StoredSettingsData | null {
    const storedData: string | null = localStorage.getItem(_STORAGE_KEY);
    
    if (!storedData) {
        return null;
    }

    const parsedData: StoredSettingsData = JSON.parse(storedData);
    return parsedData;
}

/**
 * Returns the stored settings from localStorage.
 * @returns {Settings | null} The stored settings or null if not found.
 */
export function getStoredSettings(): Settings | null {
    const storedSettingsData = getStoredSettingsData();
    
    if (!storedSettingsData) {
        return null;
    }

    const storedSettings: Settings = storedSettingsData.settings;
    
    return storedSettings;
}

/**
 * Returns the stored settings version from localStorage.
 * @returns {SettingsVersion | null} The stored settings version or null if not found.
 */
export function getStoredSettingsVersion(): SettingsVersion | null {
    const storedSettingsData = getStoredSettingsData();
    
    if (!storedSettingsData) {
        return null;
    }

    const storedSettingsVersion: SettingsVersion = storedSettingsData.version;
    return storedSettingsVersion;
}

/**
 * Logs the provided settings validation errors.
 * 
 * ! Temporary implementation
 * @param {SettingsValidationErrors} errors - The validation errors to log.
 * @return {void}
 */
export function logValidationErrors(errors: SettingsValidationErrors): void {
    errors.forEach((error) => {
        switch (error.logType) {
            case "warning":
                console.warn(`Settings Validation Warning: ${error.message}`);
                break;
            case "error":
                console.error(`Settings Validation Error: ${error.message}`);
                break;
            case "debug":
                console.debug(`Settings Validation Debug: ${error.message}`);
                break;
            default:
                console.log(`Settings Validation Info: ${error.message}`);
                break;
        }
    });
}

/**
 * Properties that should be saved to localStorage.
 * All other leaf node properties (like 'options') are metadata and won't be saved.
 */
export const SAVABLE_LEAF_NODE_PROPERTIES = ['value'];

/**
 * Strips non-savable properties from the settings object for storage.
 * This removes metadata like 'options' that don't need to be persisted.
 * 
 * @param {object} settings - The settings object to strip.
 * @returns {object} The stripped settings object containing only savable properties.
 */
function stripSettingsForStorage(settings: object): object {
    const strippedSettings: any = {};

    for (const key in settings) {
        const value = (settings as any)[key];

        // If the value is a nested object, recurse into it
        if (
            typeof value === 'object' &&
            value !== null &&
            !Array.isArray(value)
        ) {
            strippedSettings[key] = stripSettingsForStorage(value);
            continue;
        }

        // Only include savable leaf node properties
        if (SAVABLE_LEAF_NODE_PROPERTIES.includes(key)) {
            strippedSettings[key] = value;
        }
    }

    return strippedSettings;
}

/**
 * Saves the provided settings to localStorage.
 * Only savable properties (like 'value') are stored; metadata (like 'options') is stripped.
 * 
 * @param {Settings} settings - The settings object to save.
 * @return {void}
 */
export const saveSettingsToLocalStorage = (settings: Settings): void => {
    const strippedSettings = stripSettingsForStorage(settings);
    
    localStorage.setItem(_STORAGE_KEY, JSON.stringify({
        version: pkg.version,
        settings: strippedSettings
    }));
}

/**
 * Determines if the provided settings node is a leaf node.
 * We do this by checking if it has a 'value' property.
 * 
 * ! We don't know if we would give non-leaf nodes a 'value' property in the future, so this function may need to be updated later.
 * @param {any} settingsNode - The settings node to check.
 * @returns {boolean} True if the node is a leaf node, false otherwise.
 */
export const isSettingsNodeALeafNode = (settingsNode: any): boolean => {
    // If the node is not an object or is null/array, it's not a leaf node.
    // In that case, return false
    if (
        typeof settingsNode !== 'object' ||
        settingsNode === null || 
        Array.isArray(settingsNode)
    ) {
        return false;
    }
    
    // If the node does not have a 'value' property, it's not a leaf node.
    // In that case, return false
    if (!('value' in settingsNode)) {
        return false;
    }

    return true;
}

/**
 * Determines if the provided settings node is an object node and not null or an arrray.
 * @param {any} settingsNode - The settings node to check.
 * @returns {boolean} True if the node is an object node, false otherwise.
 */
export const isSettingsNodeAnObjectNode = (settingsNode: any): boolean => {
    // If the node is not an object or is null/array, it's not an object node.
    // In that case, return false
    if (
        typeof settingsNode !== 'object' ||
        settingsNode === null || 
        Array.isArray(settingsNode)
    ) {
        return false;
    }
    
    return true;
}