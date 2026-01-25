import { useContext } from 'react';
import { GameContextType, GameProviderContext } from './GameContext';

/**
 * Hook to access the Game Provider context.
 * Must be used within a GameProvider.
 * @returns {GameContextType} The Game context value containing all Game methods and state.
 * @throws {Error} If used outside of a GameProvider.
 */
export function useGame(): GameContextType {
    const context: GameContextType | null = useContext(GameProviderContext);
    if (!context) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
}

export default useGame;