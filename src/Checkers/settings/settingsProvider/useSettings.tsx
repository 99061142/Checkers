import { useContext } from 'react';
import { SettingsProviderContext, SettingsContextType } from './SettingsContext.tsx';

/**
 * Hook to access the Settings Provider context.
 * Must be used within a SettingsProvider.
 * @returns {SettingsContextType} The Settings context value containing all Settings methods and state.
 * @throws {Error} If used outside of a SettingsProvider.
 */
export function useSettings(): SettingsContextType {
    const context: SettingsContextType | null = useContext(SettingsProviderContext);
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
}

export default useSettings;