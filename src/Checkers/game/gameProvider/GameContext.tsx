import { createContext, Context } from 'react';

/**
 * Type for the Game Provider context value.
 * - `isGameDataSaved`: Boolean indicating if there is saved game data that can be loaded.
 * - `deleteSavedGame`: Function to delete any saved game data.
 * - `isGamePaused`: Boolean indicating if the game is currently paused.
 * - `setIsGamePaused`: Function to set the paused state of the game.
 */
export interface GameContextType {
    isGameDataSaved: boolean;
    deleteSavedGame: () => void;
    isGamePaused: boolean;
    setIsGamePaused: (paused: boolean) => void;
}

/**
 * Context for the Game Provider.
 */
export const GameProviderContext: Context<GameContextType | null> = createContext<GameContextType | null>(null);