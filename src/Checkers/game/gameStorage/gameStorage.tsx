import { createContext, useContext, useEffect, useState, FC, ReactNode, useRef, useCallback, useReducer } from 'react';
import { Player, getInitialPlayer } from '../../settings/settingsStorage/settingsStorageUtils.ts';
import { BoardGrid, clearLocalStoredGameData, GameData, getInitialBoardGrid, getLocalStoredGameData, storeGameDataWithinLocalStorage, validateGameData } from './gameStorageUtils.ts';

/**
 * Actions for the game reducer to update the game data state.
 */
type GameAction =
    {
        type: 'SET_BOARD_GRID';
        boardGrid: BoardGrid;
    }
    | { 
        type: 'SWITCH_CURRENT_PLAYER';
    }
    | { 
        type: 'SET_GAME_OVER'; 
        isGameOver: boolean;
    }
    | { 
        type: 'SET_WINNER';
        winner: Player | null;
    }
    | { 
        type: 'UPDATE_MULTIPLE';
        updates: Partial<GameData>;
    };

/**
 * Reducer function to manage the game data state.
 * @param {GameData} state - The current state of the game data.
 * @param {GameAction} action - The action to perform on the game data state. 
 * @returns {GameData} - The updated game data state.
 */
function gameDataReducer(state: GameData, action: GameAction): GameData {
    switch (action.type) {
        case 'SET_BOARD_GRID':
            return { 
                ...state,
                boardGrid: action.boardGrid
            };
        case 'SWITCH_CURRENT_PLAYER':
            return { 
                ...state,
                currentPlayer: state.currentPlayer === 1 ? 2 : 1
            };
        case 'SET_GAME_OVER':
            return { 
                ...state,
                isGameOver: action.isGameOver
            };
        case 'SET_WINNER':
            return { 
                ...state,
                winner: action.winner
            };
        case 'UPDATE_MULTIPLE':
            return { 
                ...state,
                ...action.updates
            };
        default:
            return state;
        }
}

/**
 * Constant which holds the initial game data stored within the local storage when the application is loaded.
 * We set this outside the `useGameStorage` hook to ensure that it is only retrieved once when the module is loaded.
 * It is used to initialize the game data state, 
 */
const _INITIAL_STORED_GAME_DATA_ON_APP_LOAD: GameData | null = getLocalStoredGameData();

export function useGameStorage() {
    /**
     * Returns the initial game data for a new game.
     * This can be used to reset the game data state when starting a new game, or when the stored game data is deleted.
     * @returns {GameData} - The initial game data object.
     */
    const getInitialGameData = (): GameData => {
        const initialGameData: GameData = {
            boardGrid: getInitialBoardGrid(),
            currentPlayer: getInitialPlayer(),
            isGameOver: false,
            winner: null
        }
        return initialGameData;
    };

    const [, setIsGamePaused] = useState<boolean>(false);
    const [isGameRunning, setIsGameRunning] = useState<boolean>(false);
    const [gameData, dispatchGameData] = useReducer(
        gameDataReducer,
        _INITIAL_STORED_GAME_DATA_ON_APP_LOAD || getInitialGameData()
    );
    const [tileSize, setTileSize] = useState<number>(0);
    const [boardSize, setBoardSize] = useState<number>(0);
    const [stoneDiameter, setStoneDiameter] = useState<number>(0);
    const [canGameBeLoaded, setCanGameBeLoaded] = useState<boolean>(_INITIAL_STORED_GAME_DATA_ON_APP_LOAD !== null);
    const [isPreviousGameDataDeletedByUser, setIsPreviousGameDataDeletedByUser] = useState<boolean>(false);

    /**
     * Sets the board grid of the game.
     * @param {BoardGrid} boardGrid - The new board grid to set.
     * @returns {void}
     */
    const setBoardGrid = (boardGrid: BoardGrid): void => {
        dispatchGameData({ 
            type: 'SET_BOARD_GRID',
            boardGrid
        });
    };

    /**
     * Switches the current player.
     * @returns {void}
     */
    const switchCurrentPlayer = (): void => {
        dispatchGameData({ 
            type: 'SWITCH_CURRENT_PLAYER'
        });
    };

    /**
     * Sets whether the game is over or not.
     * @param {boolean} isGameOver - Flag indicating if the game is over.
     * @returns {void}
     */
    const setIsGameOver = (isGameOver: boolean): void => {
        dispatchGameData({ 
            type: 'SET_GAME_OVER',
            isGameOver
        });
    };

    /**
     * Sets the winner of the game.
     * @param {Player | null} winner - The player who won the game, or null if there is no winner.
     * @returns {void}
     */
    const setWinner = (winner: Player | null): void => {
        dispatchGameData({ 
            type: 'SET_WINNER',
            winner
        });
    };

    /**
     * Updates multiple gameData properties in a single call
     * @param {Partial<GameData>} updates - The game data properties to update.
     * @returns {void}
     */
    const updateGameData = (updates: Partial<GameData>): void => {
        dispatchGameData({ 
            type: 'UPDATE_MULTIPLE',
            updates
        });
    };

    /**
     * Deletes the game data from the local storage, and set the necessary flags to indicate that there is no game data to be loaded.
     * * Do note that this does not reset the game data state within the application.
     * @returns {void}
     */
    const deleteGameData = (): void => {
        clearLocalStoredGameData();
        setIsPreviousGameDataDeletedByUser(true);
        setCanGameBeLoaded(false);
    };

    /**
     * Starts a new game. 
     * If there is any game data present within the local storage, it will be deleted.
     * @returns {void}
     */
    const startNewGame = (): void => {
        if (
            canGameBeLoaded ||
            isPreviousGameDataDeletedByUser
        ) {
            const initialGameData = getInitialGameData();
            updateGameData(initialGameData);
        }

        clearLocalStoredGameData();

        // Reset the `isPreviousGameDataDeletedByUser` flag
        setIsPreviousGameDataDeletedByUser(false);

        setCanGameBeLoaded(true);
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

        // If the game data isn't valid, it will log the errors to the console and delete the current game data state.
        //! Do note that this don't delete the game data state within the application, since that is handled by the `startNewGame` function.
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
        
        storeGameDataWithinLocalStorage(gameDataToValidate as GameData);
        return;
    }, []);

    // Validates and persists the game data when the user closes the game.
    const prevIsGameRunning = useRef(isGameRunning);
    useEffect(() => {
        if (
            prevIsGameRunning.current && 
            !isGameRunning && 
            !gameData.isGameOver
        ) {
            validateAndPersistGameData(gameData)
        }
        prevIsGameRunning.current = isGameRunning;
    }, [isGameRunning, gameData, validateAndPersistGameData, canGameBeLoaded]);

    // Handles the beforeunload event to validate and persist the game data when the user tries to close the application.
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


    // Validates the initial game data when the application is initialized.
    const isInitialGameDataValidatedRef = useRef(false);
    useEffect(() => {
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
        updateGameData,
        canGameBeLoaded,
        startNewGame,
        deleteGameData,
        setIsGameRunning,
        tileSize,
        setTileSize,
        boardSize,
        setBoardSize,
        stoneDiameter,
        setStoneDiameter
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