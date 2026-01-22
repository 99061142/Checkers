import { createContext, Context } from 'react';
import { KeysTree, Settings } from './SettingsProviderUtils';

/**
 * Type for the settings context value
 * - settings: The current settings object or null if not initialized.
 * - updateSetting: Function to update a specific setting given a key tree and value.
 */
export interface SettingsContextType {
    settings: Settings | null;
    updateSetting: (keysTree: KeysTree, value: any) => void;
}

/**
 * Context for the Settings Provider.
 */
export const SettingsProviderContext: Context<SettingsContextType | null> = createContext<SettingsContextType | null>(null);