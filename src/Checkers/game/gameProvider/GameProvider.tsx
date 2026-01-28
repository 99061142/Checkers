import { FC, ReactNode, useCallback, useMemo, useState } from "react";
import { GameContextType, GameProviderContext } from "./GameContext.tsx";

/**
 * Props for the useGameProvider hook.
 * - `isGamePaused`: Initial state indicating if the game is paused.
 */
interface UseGameProviderProps {
    initialIsGamePaused?: boolean;
}

/**
 * Custom hook to manage the Game state and methods which would need to be accessable globally across the Game components.
 */
const useGameProvider = ({
    initialIsGamePaused = false
}: UseGameProviderProps) => {
    const [isGamePaused, setIsGamePaused] = useState<boolean>(initialIsGamePaused);

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
        deleteSavedGame,
        isGamePaused,
        setIsGamePaused
    };
}


/**
 * Props for the Game Provider.
 * - `children`: All components that are wrapped by the provider.
 * - `initialIsGamePaused`: Initial state indicating if the game is paused. Makes it possible to start the game in a paused state for testing purposes.
 */
interface GameProviderProps {
    children: ReactNode;
    initialIsGamePaused?: boolean;
}

/**
 * Game Provider component to manage and provide Game state and methods.
 * @param {GameProviderProps} props - The props for the Game Provider.
 * @returns {ReactNode} The Game Provider component.
 */
export const GameProvider: FC<GameProviderProps> = ({ 
    children,
    ...rest
}) => {
    const value: GameContextType = useGameProvider(rest);
    return (
        <GameProviderContext.Provider 
            value={value}
        >
            {children}
        </GameProviderContext.Provider>
    );
};