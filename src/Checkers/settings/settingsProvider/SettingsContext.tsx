import { createContext, Context } from 'react';

/**
 * Type for the settings context value
 */
export interface SettingsContextType {
}

/**
 * Context for the Settings Provider.
 */
export const SettingsProviderContext: Context<SettingsContextType | null> = createContext<SettingsContextType | null>(null);