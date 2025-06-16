// Represents the last player who made a move (1 or 2)
type LastPlayer = 1 | 2;


/**
 * Represents a stone in the game.
 * - isKing: Boolean indicating if the stone is a king.
 * - player: The player who the stone belongs to (1 or 2).
 */
interface Stone {
    isKing: boolean;
    player: LastPlayer;
}

// 2D array of stones (Stone interface), or null for empty positions
type Board = (Stone | null)[][]; 

/**
 * The result of a validation check.
 * - valid: Boolean indicating if the validation passed.
 * - error: optional error message if validation failed.
 */
type ValidationResult = {
    valid: boolean;
    error?: string;
};

/**
 * The game data, which may contain the board and/or last player.
 * - board: The board represented as a 2D array of stones (Stone interface) or null for empty positions.
 * - lastPlayer: The last player who made a move, represented as a number (1 or 2).
 * 
 * These will be set when the game is saved, and retrieved when the game is loaded.
 * 
 * This means it won't be the current state of the game,
 * but rather the last saved state of the game.
 */
type GameData = {
    board?: Board;
    lastPlayer?: LastPlayer
}

// In-memory cache for the game data to avoid unnecessary local storage access.
let cachedGameData = {} as GameData;
let hasCachedGameData = false;

// Flags to indicate if game data has been changed.
let boardChanged = false;
let lastPlayerChanged = false;

// Key for storing game data in local storage.
const LOCAL_STORAGE_KEY = "gameData";


// --- Validation Functions ---


const VALID_STONE_KEYS = ['isKing', 'player'] as const;
const VALID_STONE_KEYS_SET = new Set<string>(VALID_STONE_KEYS);
const VALID_STONE_KEYS_SET_STR = Array.from(VALID_STONE_KEYS_SET).map(key => `'${key}'`).join(', ');
/**
 * Validates whether the given parameter is a valid stone.
 * @param {unknown} stone - The stone to validate.
 * @return {ValidationResult} An object containing a boolean indicating if the stone is valid and an optional error message.
 */
function isValidStone(stone: unknown): ValidationResult {
    // If the stone is not an object, return the validation result
    if (!stone || typeof stone !== 'object') {
        const validationResult = {
            valid: false,
            error: "Stone must be an object."
        } as ValidationResult;
        return validationResult
    }

    // If the 'isKing' property is not present in the stone object, return the validation result
    if (!('isKing' in stone)) {
        const validationResult = {
            valid: false,
            error: "The stone must have an 'isKing' property."
        } as ValidationResult;
        return validationResult
    }

    // If the 'isKing' property is not a boolean, return the validation result
    if (typeof stone.isKing !== 'boolean') {
        const validationResult = {
            valid: false,
            error: "The 'isKing' property of the stone must be a boolean."
        } as ValidationResult;
        return validationResult
    }

    // If the 'player' property is not present in the stone object, return the validation result
    if (!('player' in stone)) {
        const validationResult = {
            valid: false,
            error: "The stone must have a 'player' property."
        } as ValidationResult;
        return validationResult
    }

    // If the 'player' property is not a number which is either 1 or 2, return the validation result
    const playerValidationResult = isValidLastPlayer(stone.player);
    if (!playerValidationResult.valid) {
        const validationResult = {
            valid: false,
            error: `The 'player' property of the stone must be either 1 or 2. ${playerValidationResult.error}`
        } as ValidationResult;
        return validationResult
    }

    // If the stone has unexpected properties, return the validation result.
    // This ensures that the stone object only contains valid properties
    for (const key of Object.keys(stone)) {
        if (!VALID_STONE_KEYS_SET.has(key)) {
            const validationResult = {
                valid: false,
                error: `The stone object has an unexpected property: '${key}'. Valid properties are: ${VALID_STONE_KEYS_SET_STR}.`
            } as ValidationResult;
            return validationResult
        }
    }

    // If all checks passed, return a valid result
    const validationResult = {
        valid: true
    } as ValidationResult;
    return validationResult
}

/**
 * Validates whether the given parameter is a valid board.
 * @param {unknown} board - The board to validate.
 * @return {ValidationResult} An object containing a boolean indicating if the board data is valid and an optional error message.
 */
function isValidBoard(board: unknown): ValidationResult {
    // If the board is not an array, return the validation result
    if (!Array.isArray(board)) {
        const validationResult = {
            valid: false,
            error: "Board data must be an array."
        } as ValidationResult;
        return validationResult
    }

    for (const row of board) {
        // If the row is not an array, return the validation result
        if (!Array.isArray(row)) {
            const validationResult = {
                valid: false,
                error: "Each row in the board data must be an array."
            } as ValidationResult;
            return validationResult
        }

        for (const cell of row) {
            // If the cell is null, continue to the next cell
            // This allows for empty positions in the board, which is valid
            if (cell === null) {
                continue
            }

            // If the cell is not a valid stone object, return the validation result
            const stoneValidationResult = isValidStone(cell);
            if (!stoneValidationResult.valid) {
                const validationResult = {
                    valid: false,
                    error: `Each cell in the board must be either null or a valid stone object. ${stoneValidationResult.error}`
                } as ValidationResult;
                return validationResult
            }
        }
    }

    // If all checks passed, return a valid result
    const validationResult = {
        valid: true
    } as ValidationResult;
    return validationResult
}

/**
 * Validates if the last player is a valid representation of the last player.
 * @param {unknown} lastPlayer - The last player to validate.
 * @return {ValidationResult} An object containing a boolean indicating if the player is valid and an optional error message.
 */
function isValidLastPlayer(lastPlayer: unknown): ValidationResult {
    // If the last player is not a number, return the validation result
    if (typeof lastPlayer !== 'number') {
        const validationResult = {
            valid: false,
            error: "The player must be a number."
        } as ValidationResult;
        return validationResult
    }

    // If the player is not 1 or 2, return the validation result
    if (lastPlayer !== 1 && lastPlayer !== 2) {
        const validationResult = {
            valid: false,
            error: "The player must be either 1 or 2."
        } as ValidationResult;
        return validationResult
    }

    // If all checks passed, return a valid result
    const validationResult = {
        valid: true
    } as ValidationResult;
    return validationResult
}


// --- Setter Functions ---


/**
 * Set the last player in local storage and cache.
 * @param {LastPlayer} lastPlayer - The last player to set.
 * @throws {Error} If the last player is invalid.
 * @returns {void}
 */
export function setLastPlayer(lastPlayer: unknown): void {
    // If the last player is not valid, throw an error
    const lastPlayerValidationResult = isValidLastPlayer(lastPlayer);
    if (!lastPlayerValidationResult.valid) {
        throw new Error(`Invalid last player: ${lastPlayerValidationResult.error}`);
    }

    // If the last player hasn't been changed, we log an error and return early to avoid unnecessary updates
    if (!lastPlayerChanged) {
        console.debug("Attempted to set the last player, but it hasn't been changed. No update will be made.");
        return
    }

    // Set the new last player in the game data
    const gameData = getGameData();
    gameData.lastPlayer = lastPlayer as LastPlayer;

    // Update the local storage with the new last player added to the game data
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(gameData));

    // Unmark the lastPlayerChanged flag after setting the last player
    lastPlayerChanged = false;
}

/**
 * Set the board in local storage and cache.
 * @param {unknown} board - The board to set.
 * @throws {Error} If the board is invalid.
 * @returns {void}
 */
export function setBoard(board: unknown): void {
    // If the board is not valid, throw an error
    const boardValidationResult = isValidBoard(board);
    if (!boardValidationResult.valid) {
        throw new Error(`Invalid board: ${boardValidationResult.error}`);
    }

    // If the board hasn't been changed, we log an error and return early to avoid unnecessary updates
    if (!boardChanged) {
        console.debug("Attempted to set the board, but it hasn't been changed. No update will be made.");
        return
    }

    // Set the new board in the game data
    const gameData = getGameData();
    gameData.board = board as Board;

    // Update the local storage with the new board added to the game data
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(gameData));

    // Unmark the boardChanged flag after setting the board
    boardChanged = false;
}

/**
 * Marks whether the board has been changed since it was last set.
 * Used to indicate if local storage and cache need to be updated when the game is closed
 * @param {boolean} flag - True if the board has been changed, false otherwise.
 * @returns {void}
 */
export function markBoardChanged(flag: boolean): void {
    boardChanged = flag;
}

/**
 * Mark whether the last player has been changed since it was last set.
 * Used to indicate if local storage and cache need to be updated when the game is closed
 * @param {boolean} flag - True if the last player has been changed, false otherwise.
 * @returns {void}
 */
export function markLastPlayerChanged(flag: boolean): void {
    lastPlayerChanged = flag;
}


// --- Getter Functions ---


/**
 * Returns the game data from cache or local storage.
 * @returns {GameData} The game data object, which may contain the board and/or last player.
 */
function getGameData(): GameData {
    // If the cached game data is already available, return it
    if (hasCachedGameData) {
        return cachedGameData
    }

    // If the cached game data is not available, retrieve it from local storage
    const gameData = localStorage.getItem(LOCAL_STORAGE_KEY);
    
    // If the game data is found in local storage, parse it and cache it
    if (gameData) {
        cachedGameData = JSON.parse(gameData);
        hasCachedGameData = true;
        return cachedGameData;
    }

    // If no game data is found in local storage, return an empty game data object
    return cachedGameData
}

/**
 * Returns the last player from the cached game data or local storage.
 * @returns {LastPlayer | null } The last player or null if no last player is found.
 */
export function getLastPlayer(): LastPlayer | null {
    const gameData = getGameData();
    const lastPlayer = gameData.lastPlayer ?? null;
    return lastPlayer 
}

/**
 * Returns the board from the cached game data or local storage.
 * @returns {Board | null} The board or null if no board is found.
 */
export function getBoard(): Board | null {
    const gameData = getGameData();
    const board = gameData.board ?? null;
    return board
}

/** 
 * Returns true if the board and last player are present in the cached game data or local storage.
 * @returns {boolean} True if one or more game data properties are present, false otherwise.
 */
export function gameDataPresent(): boolean {
    // Check if the cached game data is not empty
    if (hasCachedGameData) {
        // Return true if both board and last player are present in the cached game data
        return Boolean(cachedGameData.board && cachedGameData.lastPlayer);
    }

    // Return true if game data is present in local storage.
    // If the game data exists in local storage, it will always contain both board and last player,
    // so we do not need to check for their presence individually.
    const gameData = localStorage.getItem(LOCAL_STORAGE_KEY);
    return !!gameData
}


// --- Deleter Functions ---


/**
 * Delete the cached and local storage game data.
 * @returns {void}
 */
export function clearGameData(): void {
    cachedGameData = {};
    hasCachedGameData = false;
    localStorage.removeItem(LOCAL_STORAGE_KEY);
}