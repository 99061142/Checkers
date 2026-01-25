import { FC, ReactNode, useCallback, useMemo } from "react";
import { GameContextType, GameProviderContext } from "./GameContext.tsx";

/**
 * Custom hook to manage the Game state and methods which would need to be accessable globally across the Game components.
 */
const useGameProvider = () => {
    /**
     * Check if there is saved game data that can be loaded.
     * @returns {boolean} True if a saved game can be loaded, false otherwise.
     */
    const isGameDataSaved = useMemo((): boolean => {
        //! TODO: Implement can game be loaded logic
        return false;
    }, []);

    /**
     * Delete any saved game data.
     */
    const deleteSavedGame = useCallback((): void => {
        //! TODO: Implement delete saved game logic
    }, []);
    
    return {
        isGameDataSaved,
        deleteSavedGame
    };

}


/**
 * Props for the Game Provider.
 * - `children`: All components that are wrapped by the provider.
 */
interface GameProviderProps {
    children: ReactNode;
}

/**
 * Game Provider component to manage and provide Game state and methods.
 * @param {GameProviderProps} props - The props for the Game Provider.
 * @returns {ReactNode} The Game Provider component.
 */
export const GameProvider: FC<GameProviderProps> = ({ 
    children
}) => {
    const value: GameContextType = useGameProvider();
    return (
        <GameProviderContext.Provider 
            value={value}
        >
            {children}
        </GameProviderContext.Provider>
    );
};