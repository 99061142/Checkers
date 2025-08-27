import { createContext, FC, ReactNode, useContext, useState } from 'react';
import { MoveTrees, Position } from './movesUtils.ts';
import { useGameStorageContext } from '../gameStorage/gameStorage.tsx';
import { calculateCurrentPlayerMoveTrees } from './movesUtils.ts';

export const useMovesStorage = () => {
    const {
        currentPlayer,
        boardGrid
    } = useGameStorageContext();

    const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
    const [currentPlayerMoveTrees, setCurrentPlayerMoveTrees] = useState<MoveTrees>(calculateCurrentPlayerMoveTrees(boardGrid, currentPlayer));
    
    return {
        selectedPosition,
        setSelectedPosition,
        currentPlayerMoveTrees,
        setCurrentPlayerMoveTrees
    };
}


const MovesStorageContext = createContext<ReturnType<typeof useMovesStorage> | null>(null);

export const MovesStorageProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const value = useMovesStorage();
    return (
        <MovesStorageContext.Provider 
            value={value}
        >
            {children}
        </MovesStorageContext.Provider>
    );
};

export function useMovesStorageProvider() {
    const context = useContext(MovesStorageContext);
    if (!context) {
        throw new Error('usMovesStorageContext must be used within a MovesStorageProvider');
    }
    return context;
}