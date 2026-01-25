import { createContext, Context } from 'react';

/**
 * Type for the Game Provider context value.
 * - `isGameDataSaved`: Boolean indicating if there is saved game data that can be loaded.
 * - `deleteSavedGame`: Function to delete any saved game data.
 */
export interface GameContextType {
    isGameDataSaved: boolean;
    deleteSavedGame: () => void;
}

/**
 * Context for the Game Provider.
 */
export const GameProviderContext: Context<GameContextType | null> = createContext<GameContextType | null>(null);