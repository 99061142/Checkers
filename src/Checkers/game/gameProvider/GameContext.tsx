import { createContext, Context } from 'react';

/**
 * Type for the Game Provider context value.
 */
export interface GameContextType {
}

/**
 * Context for the Game Provider.
 */
export const GameProviderContext: Context<GameContextType | null> = createContext<GameContextType | null>(null);