import { FC, ReactNode } from "react";
import { GameContextType, GameProviderContext } from "./GameContext";

/**
 * Props for the Game provider hook.
 */
interface UseGameProviderProps {
}

/**
 * Custom hook to manage the Game state and methods which would need to be accessable globally across the Game components.
 */
const useGameProvider = ({

}: UseGameProviderProps) => {
    return {
        
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