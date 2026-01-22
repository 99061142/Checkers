import { FC, ReactNode, useCallback, useEffect, useState } from "react";
import { SettingsContextType, SettingsProviderContext } from "./SettingsContext.tsx";
import { getInitialSettings, getStoredSettings, isSettingsNodeALeafNode, isSettingsNodeAnObjectNode, KeysTree, logValidationErrors, saveSettingsToLocalStorage, Settings, SettingsTreeNode } from "./SettingsProviderUtils.ts";
import { validateSettings } from "./validateSettings.ts";

/**
 * Props for the useSettingsProvider hook.
 */
interface UseSettingsProviderProps {}

const useSettingsProvider = ({

}: UseSettingsProviderProps) => {
    const [settings, setSettings] = useState<Settings | null>(null);
    const [settingsInitializedWithErrors, setSettingsInitializedWithErrors] = useState<boolean>(false);

    const updateNestedSetting = useCallback((currentNode: SettingsTreeNode, keysTree: KeysTree, valueToSet: any, pathTaken: string[] = []): SettingsTreeNode => {
        // If this is a leaf node, we've reached the end of the tree.
        // In that case, we set the value
        if (isSettingsNodeALeafNode(currentNode)) {
            // If there are still keys left in the keys tree, it means the user is trying to traverse into a leaf node, which is invalid.
            // In that case, we log an error and return the original object
            if (keysTree.length) {
                console.error(`Attempted to traverse into a leaf node in settings update: ${pathTaken.join('.')}. Remaining keys: ${keysTree.join('.')}`);
                return currentNode;
            }
            
            // Return the updated leaf node with the new value
            return { 
                ...currentNode, 
                value: valueToSet 
            };
        }

        // If we've run out of keys but haven't reached a leaf node, it means the user is trying to set a non-leaf node to a value, which is invalid
        // In that case, we log an error and return the original object.
        if (!keysTree.length) {
            console.error(`Attempted to set a non-leaf node to a value at path: ${pathTaken.join('.')}`);
            return currentNode;
        }

        // Destructure the first key and the remaining keys
        const [currentKey, ...remainingKeys] = keysTree;

        // Set the current path as the path taken so far
        const currentPath = [...pathTaken, currentKey];
        
        // If the current key does not exist in the current node, log an error and return the original object
        if (!(currentKey in currentNode)) {
            console.error(`Invalid key in settings update: ${currentPath.join('.')}`);
            return currentNode;
        }
        
        // Get the next node in the tree
        const nextNode: SettingsTreeNode = currentNode[currentKey];
        
        // If the next node is not an object node, log an error and return the original object
        if (!isSettingsNodeAnObjectNode(nextNode)) {
            console.error(`Encountered null/undefined node at path: ${currentPath.join('.')}`);
            return currentNode;
        }

        // Recurse into the next node
        return {
            ...currentNode,
            [currentKey]: updateNestedSetting(nextNode, remainingKeys, valueToSet, currentPath)
        };
    }, []);

    /**
     * Update the setting at the specified key tree with the new value.
     * @param {KeysTree} keysTree - The tree of keys leading to the setting to update.
     * @param {any} valueToSet - The new value to set.
     * @returns {void}
     */
    const updateSetting = useCallback((keysTree: KeysTree, valueToSet: any): void => {
        setSettings(prevSettings => {
            if (!prevSettings) {
                return prevSettings;
            }
            const updatedSettings = updateNestedSetting(prevSettings, keysTree, valueToSet) as Settings;
            return updatedSettings;
        });
    }, [updateNestedSetting]);

    /**
     * Handles setting the settings state when the provider is initialized.
     */
    useEffect(() => {
        // Load the stored settings when initializing the provider
        const storedSettings = getStoredSettings();

        // If we don't have any stored settings, use the initial settings
        if (!storedSettings) {
            const initialSettings = getInitialSettings();
            setSettings(initialSettings);
            return;
        }

        // If any settings are stored, validate them
        const { settings, validationErrors, shouldDeleteSavedGameData } = validateSettings(storedSettings);
        
        // Set the validated settings state.
        //! If any validation errors occurred, some settings may have been reverted to defaults.
        //! We also add any additional properties that were missing from the stored settings (could be newly added settings, or which we never save to storage to avoid clutter)
        setSettings(settings);
        
        // If there were any validation errors, log them.
        if (validationErrors.length) {
            setSettingsInitializedWithErrors(true);
            logValidationErrors(validationErrors);
        }

        // Remove the saved game data if necessary
        if (shouldDeleteSavedGameData) {
            //! TODO: Implement saved game data deletion
        }
    }, [settingsInitializedWithErrors]);

    /**
     * Save the settings to the local storage whenever they change.
     * 
     * ! Temporary functionality until we implement to only save it when the user leaves the settings page.
     */
    useEffect(() => {
        // If the settings are not yet initialized, do nothing
        if (!settings) {
            return;
        }

        saveSettingsToLocalStorage(settings);
    }, [settings]);

    return {
        settings,
        updateSetting
    }
};

/**
 * Props for the UI Provider.
 * - `children`: All components that are wrapped by the provider.
 */
interface SettingsProviderProps {
    children: ReactNode;
}

/**
 * @param {SettingsProviderProps} props - The props for the Settings Provider.
 * @returns {ReactNode} The Settings Provider component.
 */
export const SettingsProvider: FC<SettingsProviderProps> = ({ 
    children,
    ...rest
}) => {
    const value: SettingsContextType = useSettingsProvider(rest);
    return (
        <SettingsProviderContext.Provider 
            value={value}
        >
            {children}
        </SettingsProviderContext.Provider>
    );
};