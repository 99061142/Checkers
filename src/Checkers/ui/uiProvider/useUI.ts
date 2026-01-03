import { useContext } from 'react';
import { UIProviderContext, UIContextType } from './UIContext.tsx';

/**
 * Hook to access the UI Provider context.
 * Must be used within a UIProvider.
 * @returns {UIContextType} The UI context value containing all UI methods and state.
 * @throws {Error} If used outside of a UIProvider.
 */
export function useUI(): UIContextType {
    const context: UIContextType | null = useContext(UIProviderContext);
    if (!context) {
        throw new Error('useUI must be used within a UIProvider');
    }
    return context;
}

export default useUI;