import { createContext, useContext, useEffect, useState, FC, ReactNode, useRef, useCallback, useMemo } from 'react';
import { Player } from '../../settings/settingsStorage/settingsStorageUtils.ts';
import { BoardGrid, clearLocalStoredGameData, GameData, getInitialBoardGrid, getInitialPlayer, getLocalStoredGameData, storeGameDataWithinLocalStorage, validateGameData } from './gameStorageUtils.ts';

export function useGameStorage() {
    const _INITIAL_STORED_GAME_DATA = useMemo(() => getLocalStoredGameData(), []);
    const [isGameDataPresent, setIsGameDataPresent] = useState<boolean>(_INITIAL_STORED_GAME_DATA !== null);
    const [, setIsGamePaused] = useState<boolean>(false);
    const [isGameRunning, setIsGameRunning] = useState<boolean>(false);
    const [gameData, setGameData] = useState<GameData>({
        boardGrid: _INITIAL_STORED_GAME_DATA?.boardGrid || getInitialBoardGrid(),
        currentPlayer: _INITIAL_STORED_GAME_DATA?.currentPlayer || getInitialPlayer(),
        isGameOver: _INITIAL_STORED_GAME_DATA?.isGameOver ?? false,
        winner: _INITIAL_STORED_GAME_DATA?.winner || null
    });
    const [tileSize, setTileSize] = useState<number>(0);
    const [boardSize, setBoardSize] = useState<number>(0);

    /**
     * Sets the board grid of the game.
     * @param {BoardGrid} boardGrid - The new board grid to set.
     * @returns {void}
     */
    const setBoardGrid = (boardGrid: BoardGrid): void => {
        setGameData(prev => ({ 
            ...prev,
            boardGrid
        }));
    };

    /**
     * Switches the current player between player 1 and player 2.
     * @returns {void}
     */
    const switchCurrentPlayer = (): void => {
        setGameData(prev => ({ 
            ...prev,
            currentPlayer: prev.currentPlayer === 1 ? 2 : 1
        }));
    };

    /**
     * Sets whether the game is over or not.
     * @param {boolean} isGameOver - Flag indicating if the game is over.
     * @returns {void}
     */
    const setIsGameOver = (isGameOver: boolean): void => {
        setGameData(prev => ({ 
            ...prev,
            isGameOver
        }));
    };

    /**
     * Sets the winner of the game.
     * @param {Player | null} winner - The player who won the game, or null if there is no winner.
     * @returns {void}
     */
    const setWinner = (winner: Player | null): void => {
        setGameData(prev => ({ 
            ...prev,
            winner
        }));
    };

    /**
     * Sets whether the game is paused or not.
     * @param {boolean} isPaused - Flag indicating if the game is paused.
     * @returns {void}
     */
    const deleteGameData = useCallback((isNewGameStarting: boolean = false): void => {
        // Set the initial game data
        setGameData({
            boardGrid: getInitialBoardGrid(),
            currentPlayer: getInitialPlayer(),
            isGameOver: false,
            winner: null
        });

        // Clear the local stored game data
        clearLocalStoredGameData();

        // If this function is called with the `isNewGameStarting` flag set to true,
        // it means that a new game is starting, so we set the game running state to true.
        setIsGameDataPresent(isNewGameStarting);
    }, []);

    /**
     * Starts a new game. 
     * If there is any game data present within the local storage, it will be deleted.
     * @returns {void}
     */
    const startNewGame = (): void => {
        if (!isGameDataPresent) {
            return;
        }

        const isNewGameStarting = true;
        deleteGameData(isNewGameStarting);
    };

    /**
     * Validates the game data and persists it to local storage if the `mustStoreGameDataWhenValid` flag isn't set to false.
     * @param {GameData} gameDataToValidate - The game data to validate.
     * @param {boolean} mustStoreGameDataWhenValid - Flag indicating whether to store the game data when it is valid. The default value is set to true.
     * @returns {void}
     */
    const validateAndPersistGameData = useCallback((gameDataToValidate: GameData, mustStoreGameDataWhenValid = true): void => {
        const gameDataValidationResult = validateGameData(gameDataToValidate);
        const { isValid, errors } = gameDataValidationResult;

        // If the game data isn't valid, it will log the errors to the console and delete the current game data state and local stored game data
        if (!isValid) {
            console.error(`Game data validation errors: \n\n- ${errors.join('\n- ')}\n\nBecause of this, the game data has been deleted.`);
            deleteGameData();
            return;
        }

        // If we don't need to store the game data when it is valid, we return early.
        // This will be done when we validate the game data when the application is loaded. 
        // Since if it isn't valid, we set the initial game data with the `deleteGameData` function.
        if (!mustStoreGameDataWhenValid) {
            return;
        }
        
        if (isGameRunning) {
            storeGameDataWithinLocalStorage(gameDataToValidate as GameData);
        }
    }, [deleteGameData, isGameRunning]);

    /**
     * Validates and persists the game data when the user closes the game.
     */
    const prevIsGameRunning = useRef(isGameRunning);
    useEffect(() => {
        if (
            prevIsGameRunning.current && 
            !isGameRunning && 
            !gameData.isGameOver
        ) {
            validateAndPersistGameData(gameData);
            
            if (!isGameDataPresent) {
                setIsGameDataPresent(true);
            }
        }

        prevIsGameRunning.current = isGameRunning;
    }, [isGameRunning, gameData, validateAndPersistGameData, isGameDataPresent]);

    /**
     * Handles the beforeunload event to persist game data when the user tries to leave the page.
     */
    useEffect(() => {
        const handleBeforeUnload = () => {
            // Validate and persist the game data if the game is running and not over
            if (
                isGameRunning && 
                !gameData.isGameOver
            ) {
                validateAndPersistGameData(gameData);
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [isGameRunning, gameData, validateAndPersistGameData]);


    /**
     * Validates the initial game data when the application is initialized.
     * If it isn't valid, it will delete the game data, and initialize the game data with the initial values.
     */
    const isInitialGameDataValidatedRef = useRef(false);
    useEffect(() => {
        // Funcionality to only validate the initial game data once
        if (isInitialGameDataValidatedRef.current) {
            return;
        }
        isInitialGameDataValidatedRef.current = true;
        
        const mustStoreGameDataWhenValid = false;
        validateAndPersistGameData(gameData, mustStoreGameDataWhenValid);
    }, [validateAndPersistGameData, gameData]);

    return {
        ...gameData,
        setBoardGrid,
        switchCurrentPlayer,
        setIsGameOver,
        setWinner,
        setIsGamePaused,
        setGameData,
        isGameDataPresent,
        startNewGame,
        deleteGameData,
        setIsGameRunning,
        tileSize,
        setTileSize,
        boardSize,
        setBoardSize
    };
}

const GameStorageContext = createContext<ReturnType<typeof useGameStorage> | null>(null);

export const GameStorageProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const value = useGameStorage();
    return (
        <GameStorageContext.Provider 
            value={value}
        >
            {children}
        </GameStorageContext.Provider>
    );
};

export function useGameStorageContext() {
    const context = useContext(GameStorageContext);
    if (!context) {
        throw new Error('useGameStorageContext must be used within a GameStorageProvider');
    }
    return context;
}