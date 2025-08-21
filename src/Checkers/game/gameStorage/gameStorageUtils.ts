import { isPositionIsOutOfBounds, Position } from '../calculateMoves.ts';
import { BoardRow, getStoredGameSettingValues, Player, POSSIBLE_PLAYER_VALUES_SET } from '../../settings/settingsStorage/settingsStorageUtils.ts';

// The local storage key which is used to store the game data.
const _GAME_DATA_LOCAL_STORAGE_KEY = 'gameData';

/**
 * Interface for the game data validation result.
 * - `isValid`: Indicates whether the game data is valid or not.
 * - `errors`: An array of error messages if the game data is invalid.
 */
interface GameDataValidationResult {
    isValid: boolean;
    errors: string[];
}

/**
 * Interface for the stone object.
 * - `isKing`: Indicates whether the stone is a king or not.
 * - `player`: The player to which the stone belongs.
 * - `position`: The position of the stone on the board.
 * - `id`: The unique identifier of the stone. This is used for the `key` prop for the Stone component.
 */
interface Stone {
    isKing: boolean;
    player: Player;
    position: Position;
    id: number;
}

/**
 * Interface for the board grid. 
 * It represent a 2D array where each cell can either be a `Stone` object or `null`.
 */
export type BoardGrid = (Stone | null)[][];

/**
 * Interface for the game data.
 * - `boardGrid`: The grid representing the board state, where each cell can be a `Stone` object or `null`.
 * - `currentPlayer`: The player whose turn it is to make a move.
 * - `isGameOver`: A boolean indicating whether the game is over.
 * - `winner`: The player who won the game, or `null` if there is no winner yet.
 */
export interface GameData {
    boardGrid: BoardGrid;
    currentPlayer: Player;
    isGameOver: boolean;
    winner: Player | null;
}

/**
 * Interface for the initial board grid cache.
 * It will hold the initial board grid for each possible board row size.
 */
type InitialBoardGridCache = {
    [key in BoardRow]: BoardGrid;
}

// The cache for the initial board grid. It will hold the initial board grid for each possible board row size.
const _INITIAL_BOARD_GRID_CACHE = {} as InitialBoardGridCache;


/* 
 * <========================================>
 *  Validation Functions  
 * <========================================>
 */


/**
 * Validates the game data.
 * @param {unknown} gameDataToValidate - The game data to validate. 
 * @returns {GameDataValidationResult} - The validation result containing whether the game data is valid and any error messages.
 */
export function validateGameData(gameDataToValidate: unknown): GameDataValidationResult {
    if (
        typeof gameDataToValidate !== 'object' || 
        gameDataToValidate === null ||
        Array.isArray(gameDataToValidate)
    ) {
        return {
            isValid: false,
            errors: [`Invalid type for the game data we need to validate'. Got '${typeof gameDataToValidate}', expected 'object'.`]
        };
    }

    const validationErrors: string[] = [];

    if (!('boardGrid' in gameDataToValidate)) {
        validationErrors.push(`Missing property 'boardGrid' in game data.`);
    } else {
        const gameDataBoardGridValidationResult = validateGameDataBoardGrid(gameDataToValidate.boardGrid);
        validationErrors.push(...gameDataBoardGridValidationResult.errors.map(error => `the 'boardGrid' property within the game data is invalid: ${error}`));
    }

    if (!('currentPlayer' in gameDataToValidate)) {
        validationErrors.push(`Missing property 'currentPlayer' in game data.`);
    } else {
        const gameDataCurrentPlayerValidationResult = validateGameDataCurrentPlayer(gameDataToValidate.currentPlayer);
        validationErrors.push(...gameDataCurrentPlayerValidationResult.errors.map(error => `the 'currentPlayer' property within the game data is invalid: ${error}`));
    }

    if (!('isGameOver' in gameDataToValidate)) {
        validationErrors.push(`Missing property 'isGameOver' in game data.`);
    } else {
        const gameDataIsGameOverValidationResult = validateGameDataIsGameOver(gameDataToValidate.isGameOver);
        validationErrors.push(...gameDataIsGameOverValidationResult.errors.map(error => `the 'isGameOver' property within the game data is invalid: ${error}`));
    }

    if (!('winner' in gameDataToValidate)) {
        validationErrors.push(`Missing property 'winner' in game data.`);
    } else {
        const gameDataWinnerValidationResult = validateGameDataWinner(gameDataToValidate.winner);
        validationErrors.push(...gameDataWinnerValidationResult.errors.map(error => `the 'winner' property within the game data is invalid: ${error}`));
    }

    return {
        isValid: !validationErrors.length,
        errors: validationErrors
    }
}

/**
 * Validates the `isGameOver` property within the game data.
 * @param {unknown} isGameOverToValidate - The value to validate. 
 * @returns {GameDataValidationResult} - The validation result containing whether the `isGameOver` value is valid and any error messages.
 */
function validateGameDataIsGameOver(isGameOverToValidate: unknown): GameDataValidationResult {
    if (typeof isGameOverToValidate !== 'boolean') {
        return {
            errors: [`Invalid type for isGameOver. Got '${typeof isGameOverToValidate}', expected 'boolean'.`],
            isValid: false
        };
    }

    return { 
        isValid: true,
        errors: []
    };
}

/**
 * Validates the `winner` property within the game data.
 * @param {unknown} winnerToValidate - The winner to validate.
 * @returns {GameDataValidationResult} - The validation result containing whether the winner is valid and any error messages.
 */
function validateGameDataWinner(winnerToValidate: unknown): GameDataValidationResult {
    if (winnerToValidate === null) {
        return {
            isValid: true,
            errors: []
        };
    }

    const validationResult = validateGameDataCurrentPlayer(winnerToValidate);
    const { isValid, errors } = validationResult;

    if (!isValid) {
        return {
            isValid: false,
            errors: [`Invalid winner value within the game data. error: ${errors.join(', ')}`]
        };
    }

    return { 
        isValid: true, 
        errors: [] 
    };
}

/**
 * Validates the `currentPlayer` property within the game data.
 * @param {unknown} currentPlayerToValidate - The current player to validate.
 * @returns {GameDataValidationResult} - The validation result containing whether the current player is valid and any error messages.
 */
function validateGameDataCurrentPlayer(currentPlayerToValidate: unknown): GameDataValidationResult {
    if (typeof currentPlayerToValidate !== 'number') {
        return {
            isValid: false,
            errors: [`Invalid type for current player. Got '${typeof currentPlayerToValidate}', expected 'number'.`]
        };
    }

    if (!POSSIBLE_PLAYER_VALUES_SET.has(currentPlayerToValidate as Player)) {
        return {
            isValid: false,
            errors: [`Invalid current player value. Got '${currentPlayerToValidate}', expected a player from one of the following possible values: ${Array.from(POSSIBLE_PLAYER_VALUES_SET).join(', ')}.`]
        };
    }

    return {
        isValid: true,
        errors: []
    }
}

/**
 * Validates the stone within the game data `boardGrid` property.
 * @param {unknown} stoneToValidate - The stone to validate.
 * @returns {GameDataValidationResult} - The validation result containing whether the stone is valid and any error messages.
 */
function validateStoneWithinGameDataBoardGrid(stoneToValidate: unknown): GameDataValidationResult {
    if (
        typeof stoneToValidate !== 'object' || 
        stoneToValidate === null ||
        Array.isArray(stoneToValidate)
    ) {
        return {
            isValid: false,
            errors: [`Invalid type for the stone. Got '${typeof stoneToValidate}', expected 'object'.`]
        };
    }

    const validationErrors: string[] = [];
    // Check if the required properties are present and of the correct type.

    if (!('isKing' in stoneToValidate)) {
        validationErrors.push(`Missing property 'isKing' in stone object.`);
    } else {
        if (typeof stoneToValidate.isKing !== 'boolean') {
            validationErrors.push(`Invalid type for isKing in stone object. Got '${typeof stoneToValidate.isKing}', expected 'boolean'.`);
        }
    }

    if (!('player' in stoneToValidate)) {
        validationErrors.push(`Missing property 'player' in stone object.`);
    } else {
        const playerValidationResult = validateGameDataCurrentPlayer(stoneToValidate.player);
        if (!playerValidationResult.isValid) {
            validationErrors.push(`Invalid player value in stone object. ${playerValidationResult.errors.join(', ')}`);
        }
    }

    if (!('position' in stoneToValidate)) {
        validationErrors.push(`Missing property 'position' in stone object.`);
    } else {
        const positionValidationResult = validateStonePosition(stoneToValidate.position);
        if (!positionValidationResult.isValid) {
            validationErrors.push(`Invalid position in stone object. ${positionValidationResult.errors.join(', ')}`);
        }
    }

    if (!('id' in stoneToValidate)) {
        validationErrors.push(`Missing property 'id' in stone object.`);
    } else if (typeof stoneToValidate.id !== 'number') {
        validationErrors.push(`Invalid type for id in stone object. Got '${typeof stoneToValidate.id}', expected 'number'.`);
    }

    return {
        isValid: !validationErrors.length,
        errors: validationErrors
    }
}

/**
 * Validates the position of a stone within the game data `boardGrid` property.
 * @param {unknown} stonePositionToValidate - The position to validate.
 * @returns {GameDataValidationResult} - The validation result containing whether the position is valid and any error messages.
 */
function validateStonePosition(stonePositionToValidate: unknown): GameDataValidationResult {
    if (!Array.isArray(stonePositionToValidate)) {
        return {
            isValid: false,
            errors: [`Invalid type for position. Got '${typeof stonePositionToValidate}', expected 'array'.`]
        };
    }

    if (stonePositionToValidate.length !== 2) {
        return {
            isValid: false,
            errors: [`Invalid position length. Expected an array of length 2, but got ${stonePositionToValidate.length}.`]
        };
    }
    
    const [ row, col ] = stonePositionToValidate as any[];
    
    const rowType = typeof row;
    if (rowType !== 'number' || typeof col !== 'number') {
        return {
            isValid: false,
            errors: [`Expected the first and second elements of the position array to be numbers. But the ${rowType !== 'number' ? `first` : `second`} element is of type '${rowType}'.`]
        };
    }

    if (isPositionIsOutOfBounds((stonePositionToValidate as Position))) {
        return {
            isValid: false,
            errors: [`Position [${row}, ${col}] is out of bounds.`]
        };
    }

    return {
        isValid: true,
        errors: []
    };
}

/**
 * Validates the game data board grid.
 * @param {unknown} boardGridToValidate - The board grid to validate.
 * @returns {GameDataValidationResult} - The validation result containing whether the board grid is valid and any error messages.
 */
function validateGameDataBoardGrid(boardGridToValidate: unknown): GameDataValidationResult {
    if (!Array.isArray(boardGridToValidate)) {
        return {
            isValid: false,
            errors: [`Invalid type for board grid. Got '${typeof boardGridToValidate}', expected 'array'.`]
        };
    }


    const validationErrors: string[] = [];

    for (const [rowIndex, row] of boardGridToValidate.entries()) {
        if (!Array.isArray(row)) {
            validationErrors.push(`Invalid type for row at index ${rowIndex} in board grid. Got '${typeof row}', expected 'array'.`);
            continue;
        }

        for (const [cellIndex, cell] of row.entries()) {
            if (cell === null) {
                continue;
            }

            const stoneValidationResult = validateStoneWithinGameDataBoardGrid(cell);
            if (!stoneValidationResult.isValid) {
                validationErrors.push(`Invalid stone at row ${rowIndex}, column ${cellIndex} in board grid: ${stoneValidationResult.errors.join(', ')}`);
            }
        }
    }

    return {
        isValid: !validationErrors.length,
        errors: validationErrors
    }
}


/* 
 * <========================================>
 *  Save Functions  
 * <========================================>
 */


/**
 * Stores the game data within the local storage.
 * @param {GameData} gameData - The game data to store.
 * @returns {void}
 */
export function storeGameDataWithinLocalStorage(gameData: GameData): void {
    console.debug('Storing the game data within the local storage.');
    localStorage.setItem(_GAME_DATA_LOCAL_STORAGE_KEY, JSON.stringify(gameData));
}


/* 
 * <========================================>
 *  Getter Functions  
 * <========================================>
 */


/**
 * Gets the initial board grid based on the `boardRow` parameter, which defaults to the stored game setting value for the amount of rows on the board.
 * If the initial board grid for the given `boardRow` is already cached, it will return it.
 * @param {BoardRow} boardRow - The size of the board in terms of rows. Defaults to the stored game setting value for the amount of rows on the board.
 * @returns {BoardGrid} - The initial board grid with the size of `boardRow` x `boardRow`.
 */
export function getInitialBoardGrid(boardRow: BoardRow = getStoredGameSettingValues().board.rows): BoardGrid {
    // If the initial board grid for the given board size is already cached, return it.
    const cachedInitialBoardGrid = _INITIAL_BOARD_GRID_CACHE[boardRow];
    if (cachedInitialBoardGrid) {
        return cachedInitialBoardGrid;
    }
    
    const centerRow = Math.floor(boardRow / 2);
    const boardGrid: Array<BoardGrid[number]> = [];
    let stoneID = 0;
    for (let row = 0; row < boardRow; row++) {
        // Skip the center rows where no stones are placed.
        if (
            row === centerRow ||
            row === centerRow - 1
        ) {
            boardGrid.push(Array(boardRow).fill(null));
            continue
        }

        // Add the stones information to the array based on the row and column.
        const boardGridRow: (Stone | null)[] = [];
        for (let col = 0; col < boardRow; col++) {
            if ((row + col) % 2 !== 0) {
                boardGridRow.push(null);
                continue
            }

            const player = row < centerRow ? 1 : 2;
            const position: Position = [row, col];
            boardGridRow.push({
                player,
                isKing: false,
                position,
                id: stoneID++
            });
        }
        boardGrid.push(boardGridRow);
    }

    // Cache the initial board grid for the given board size.
    _INITIAL_BOARD_GRID_CACHE[boardRow] = boardGrid;

    return boardGrid
}

/**
 * Gets the initial player based on the game settings.
 * @returns {Player} - The initial player to start the game.
 */
export function getInitialPlayer(): Player {
    const initialPlayer = getStoredGameSettingValues().player.initialPlayer;
    return initialPlayer;
}

/**
 * Gets the game data from the local storage.
 * @returns {GameData | null} - The game data from the local storage, or null if no game data is found.
 */
export function getLocalStoredGameData(): GameData | null {
    const storedGameData = localStorage.getItem(_GAME_DATA_LOCAL_STORAGE_KEY);
    if (!storedGameData) {
        return null;
    }

    console.debug('Retrieving the stored game data from the local storage.');
    const parsedGameData: GameData = JSON.parse(storedGameData);
    return parsedGameData;
}


/* 
 * <========================================>
 *  Clearance Functions  
 * <========================================>
 */


/**
 * Clears the game data from the local storage.
 * @returns {void}
 */
export function clearLocalStoredGameData(): void {
    console.debug('Clearing the stored game data from the local storage.');
    localStorage.removeItem(_GAME_DATA_LOCAL_STORAGE_KEY);
}