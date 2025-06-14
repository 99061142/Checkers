type LastPlayer = 1 | 2;

interface Stone {
    isKing: boolean;
    player: LastPlayer;
};

type Board = (Stone | null)[][];

interface GameData {
    board: Board;
    lastPlayer: LastPlayer;
};

type ValidationResult = {
    valid: boolean;
    error?: string;
};

let cachedGameData: GameData | null = null;

/**
 * Validates if the given stone object is a valid representation of a stone.
 * - A valid stone must be an object with:
 *   - An 'isKing' property of type boolean.
 *   - A 'player' property that is either 1 or 2.
 * @param {unknown} stone - The object to validate.
 * @return {ValidationResult} An object containing a boolean indicating if the stone is valid and an optional error message.
 */
function isValidStone(stone: unknown): ValidationResult {
    // If the stone is not an object
    if (!stone || typeof stone !== 'object') {
        return { valid: false, error: "Stone must be an object." }
    }

    // If the 'isKing' property is not present in the stone object
    if (!('isKing' in stone)) {
        return { valid: false, error: "The stone must have an 'isKing' property." }
    }

    // If the 'isKing' property is not a boolean
    if (typeof stone.isKing !== 'boolean') {
        return { valid: false, error: "The 'isKing' property of the stone must be a boolean." }
    }

    // If the 'player' property is not present in the stone object
    if (!('player' in stone)) {
        return { valid: false, error: "The stone must have a 'player' property." } 
    }

    // If the 'player' property is not a valid player (1 or 2)
    const playerValidationResult = isValidLastPlayer(stone.player);
    if (!playerValidationResult.valid) {
        return { valid: false, error: `The 'player' property of the stone must be either 1 or 2. ${playerValidationResult.error}` }
    }

    // If all checks passed, the stone is valid
    return { valid: true }
}

/**
 * Validates if the given board data is a valid representation of a board.
 * - A valid board must be a 2D array where:
 *   - Each row is an array.
 *   - Each cell in the row is either null (indicating an empty position) or a valid stone object. (see isValidStone function and/or Stone interface for more details)
 * @param {unknown} board - The board data to validate.
 * @return {ValidationResult} An object containing a boolean indicating if the board data is valid and an optional error message.
 */
function isValidBoard(board: unknown): ValidationResult {
    // If the board is not an array
    if (!Array.isArray(board)) {
        return { valid: false, error: "Board data must be an array." };
    }

    for (const row of board) {
        // If the row is not an array
        if (!Array.isArray(row)) {
            return { valid: false, error: "Each row in the board data must be an array." };
        }

        for (const cell of row) {
            if (cell !== null) {
                // If the cell is not null, and not a valid stone object
                const stoneValidationResult = isValidStone(cell);
                if (!stoneValidationResult.valid) {
                    return { valid: false, error: `Error: Each cell in the board must be either null or a valid stone object. ${stoneValidationResult.error}` };
                }
            }
        }
    }

    // If all checks passed, the board is valid
    return { valid: true };
}

/**
 * Returns a 2D array representing the game board from local storage.
 * 
 * See the Board type for more details.
 * @return {Board} The game board as a 2D array.
 */
export function getBoard(): Board {
    const board = getGameData().board;
    return board
}

/**
 * Sets the game board in local storage.
 * @param {Board} board - The board to be set in local storage.
 * @throws {Error} If the board is not valid (check isValidBoard and/or Board interface for more details).
 * @return {void}
*/
export function setBoard(board: Board): void {
    // If the board is not valid
    const validationResult = isValidBoard(board);
    if (!validationResult.valid) {
        throw new Error(`Error: The board data is not valid. ${validationResult.error}`);
    }

    // If the board is valid, set the board in the game data
    const gameData = getGameData();
    setGameData({ ...gameData, board });
}

/**
 * Validates if the given player is a valid representation of a game player.
 * - A valid player must be a number that is either 1 or 2.
 * @param {unknown} player - The player to validate.
 * @return {ValidationResult} An object containing a boolean indicating if the player is valid and an optional error message.
 */
function isValidLastPlayer(player: unknown): ValidationResult {
    // If the player is not a number
    if (typeof player !== 'number') {
        return { valid: false, error: "The player must be a number." };
    }

    // If the player is not 1 or 2
    if (player !== 1 && player !== 2) {
        return { valid: false, error: "The player must be either 1 or 2." };
    }

    // If all the checks passed, the player is valid
    return { valid: true };
}

/**
 * Returns the last player who played before the game closed.
 * @return {LastPlayer} The last player who played before the game closed.
 */
export function getLastPlayer(): LastPlayer {
    const lastPlayer = getGameData().lastPlayer;
    return lastPlayer
}

/**
 * Sets the last player in local storage.
 * @param {LastPlayer} player - The last player to be set in local storage.
 * @throws {Error} If the player is not valid. (Check isValidLastPlayer and/or LastPlayer type for more details).
 * @return {void}
 */
export function setLastPlayer(player: LastPlayer): void {
    // if the player is not valid
    const validationResult = isValidLastPlayer(player);
    if (!validationResult.valid) {
        throw new Error(`Error: The last player is not valid. ${validationResult.error}`);
    }

    // if the player is valid, set the last player in the game data
    const gameData = getGameData();
    setGameData({ ...gameData, lastPlayer: player });
}

/**
 * Validates if the given game data is a valid representation of a game state.
 * - A valid game data must be an object with:
 *   - A 'board' property that is a valid board (check isValidBoard function and/or Board type for more details).
 *   - A 'lastPlayer' property that is a valid player (check isValidLastPlayer function and/or LastPlayer type for more details).
 * @param {unknown} gameData - The game data to validate.
 * @return {ValidationResult} An object containing a boolean indicating if the game data is valid and an optional error message.
 */
function isValidGameData(gameData: unknown): ValidationResult {
    // If the game data is not an object
    if (!gameData || typeof gameData !== 'object') {
        return { valid: false, error: "Game data must be an object." };
    }

    // If the 'board' property is not present in the game data
    if (!('board' in gameData)) {
        return { valid: false, error: "Game data must have a 'board' property." };
    }

    // If the 'lastPlayer' property is not present in the game data
    if (!('lastPlayer' in gameData)) {
        return { valid: false, error: "Game data must have a 'lastPlayer' property." };
    }

    // If the 'lastPlayer' property is not valid
    const lastPlayerValidationResult = isValidLastPlayer(gameData.lastPlayer);
    if (!lastPlayerValidationResult.valid) {
        return { valid: false, error: `Error: The 'lastPlayer' property of the game data is not valid. ${lastPlayerValidationResult.error}` }
    }

    // If the 'board' property is not valid
    const boardValidationResult = isValidBoard(gameData.board);
    if (!boardValidationResult.valid) {
        return { valid: false, error: `Error: The 'board' property of the game data is not valid. ${boardValidationResult.error}` }
    }

    // If all checks passed, the game data is valid
    return { valid: true };
}

/**
 * Returns the game data from local storage.
 * @throws {Error} If the game data is not set in the local storage.
 * @return {GameData} The game data as an object containing the board and last player.
 */
function getGameData(): GameData {
    // If the game data is cached, return the cached game data
    if (cachedGameData) {
        return cachedGameData;
    }

    // If the game data is not set in the local storage
    const rawGameData = localStorage.getItem('gameData');
    if (!rawGameData) {
        throw new Error("Error: No game data found in local storage. This usually happens when there is no game in progress.");
    }

    // Cache the game data
    const gameData = JSON.parse(rawGameData);
    cachedGameData = gameData;

    return gameData as GameData;
}

/**
 * Sets the game data in local storage, while also caching it.
 * @param {GameData} gameData - The game data to be set in local storage.
 * @throws {Error} If the game data is not valid. (Check isValidGameData function and/or GameData type for more details)
 * @return {void}
 */
function setGameData(gameData: GameData): void {
    // If the game data is not valid
    const validationResult = isValidGameData(gameData);
    if (!validationResult.valid) {
        throw new Error(`Error: The game data is not valid. ${validationResult.error}`);
    }

    // If the game data is valid, set the game data in the local storage
    localStorage.setItem('gameData', JSON.stringify(gameData));

    // Cache the game data
    cachedGameData = gameData;
}

/** 
 * Returns whether the game data is present in the local storage.
 * @return {boolean} True if the game data is present, false otherwise.
*/
export function gameDataPresent(): boolean {
    return localStorage.getItem('gameData') !== null;
}

/**
 * Deletes the game data from local storage and clears the cached game data.
 * @return {void}
 */
export function deleteGameData(): void {
    // Remove the game data from local storage
    localStorage.removeItem('gameData');

    // Clear the cached game data
    cachedGameData = null;
}