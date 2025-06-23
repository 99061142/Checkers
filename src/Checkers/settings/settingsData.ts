// This json file contains the default settings for the game.
// The file won't be updated, since if any settings are changed, we set it within the local storage.
// This means the json file will always contain the default settings.
import initialSettingsRaw from './initialSettings.json'
const initialSettings = initialSettingsRaw as Settings;

// The game modes that are available in the game.
export const GAMEMODES = ['pvp', 'pve'] as const;
export type Gamemode = typeof GAMEMODES[number];

// The board sizes that are available in the game.
export const BOARD_SIZES = [8, 10, 12] as const;
export type BoardSize = typeof BOARD_SIZES[number];

// The initial players that are available in the game.
// These will always be 1 or 2, since the game is played between two players.
const INITIAL_PLAYERS = [1, 2] as const;
export type InitialPlayer = typeof INITIAL_PLAYERS[number];

/**
 * Represents the game rules for the checkers game.
 * - mandatoryCapture: Whether a player must capture the most amount of stones possible during their turn.
 * - flyingKing: Whether a king can move any number of tiles in a straight line.
 * - canMoveBackwards: Whether a player can move their stones backwards (this doesn't include captures or kings, since they can always move backwards).
 * - promotionDuringCapture: Whether a player can promote their stone to a king during a capture.
 * - turnEndsOnPromotion: Whether a player's turn ends when they promote a stone to a king (which means they cannot capture any more stones if they land on a promotion tile within that turn)
 */
export interface GameRules {
    mandatoryCapture: boolean;
    flyingKing: boolean;
    canMoveBackwards: boolean;
    promotionDuringCapture: boolean;
    turnEndsOnPromotion: boolean;
}

/**
 * Represents the settings for the checkers game.
 * - gameRules: The game rules for the game.
 * - gamemode: The game mode for the game.
 * - boardSize: The size of the board for the game.
 * - initialPlayer: The player that will start the game.
 */
interface Settings {
    gameRules: GameRules;
    gamemode: Gamemode;
    boardSize: BoardSize;
    initialPlayer: InitialPlayer;
}

/**
 * Represents the result of a validation.
 * - valid: A boolean indicating whether the validation was successful or not.
 * - error: An optional string containing an error message if the validation failed.
 */
type ValidationResult = {
    valid: boolean;
    error?: string;
};

let cachedSettings = null as Settings | null;

const LOCAL_STORAGE_KEY = 'settings';


// --- Validation Functions ---


const GAMEMODES_SET = new Set(GAMEMODES);
const GAMEMODES_OPTIONS_STR = GAMEMODES.map(mode => `"${mode}"`).join(', ');
/**
 * Validates if the given game mode is a valid representation of a game mode.
 * @param {unknown} gamemode - The game mode to validate.
 * @returns {ValidationResult} - An object indicating whether the game mode is valid or not, and an optional error message.
 */
function isValidGamemodes(gamemode: unknown): ValidationResult {
    // If the game mode is not a string, return the validation result
    if (typeof gamemode !== 'string') {
        const validationResult = {
            valid: false,
            error: 'Game mode must be a string.'
        } as ValidationResult;
        return validationResult
    }

    // if the game mode is not one of the valid modes, return the validation result
    if (!GAMEMODES_SET.has(gamemode as Gamemode)) {
        const validationResult = {
            valid: false,
            error: `The game mode '${gamemode}' is not valid. Valid game modes are: ${GAMEMODES_OPTIONS_STR}.`
        } as ValidationResult;
        return validationResult
    }

    // If the game mode is valid, return the validation result
    const validationResult = {
        valid: true
    } as ValidationResult;
    return validationResult
}

const BOARD_SIZES_SET = new Set(BOARD_SIZES);
const BOARD_SIZES_OPTIONS_STR = BOARD_SIZES.map(boardSize => `"${boardSize}"`).join(', ');
/**
 * Validates if the given board size is a valid representation of a board size.
 * @param {unknown} boardSize - The board size to validate.
 * @returns {ValidationResult} - An object indicating whether the board size is valid or not, and an optional error message.
 */
function isValidBoardSize(boardSize: unknown): ValidationResult {
    // If the board size is not a number, return the validation result
    if (typeof boardSize !== 'number') {
        const validationResult = {
            valid: false,
            error: 'Board size must be a number.'
        } as ValidationResult;
        return validationResult
    }

    // If the board size is not one of the valid sizes, return the validation result
    if (!BOARD_SIZES_SET.has(boardSize as BoardSize)) {
        const validationResult = {
            valid: false,
            error: `The board size '${boardSize}' is not valid. Valid board sizes are: ${BOARD_SIZES_OPTIONS_STR}.`
        } as ValidationResult;
        return validationResult
    }

    // If the board size is valid, return the validation result
    const validationResult = {
        valid: true
    } as ValidationResult;
    return validationResult
}

const INITIAL_PLAYERS_SET = new Set(INITIAL_PLAYERS);
const INITIAL_PLAYER_OPTIONS_STR = INITIAL_PLAYERS.map(player => `"${player}"`).join(', ');
/**
 * Validates if the given initial player is a valid representation of an initial player.
 * @param {unknown} initialPlayer - The initial player to validate.
 * @returns {ValidationResult} - An object indicating whether the initial player is valid or not, and an optional error message.
 */
function isValidInitialPlayer(initialPlayer: unknown): ValidationResult {
    // If the initial player is not a number, return the validation result
    if (typeof initialPlayer !== 'number') {
        const validationResult = {
            valid: false,
            error: 'Initial player must be a number.'
        } as ValidationResult;
        return validationResult
    }

    // If the initial player is not one of the valid players, return the validation result
    if (!INITIAL_PLAYERS_SET.has(initialPlayer as InitialPlayer)) {
        const validationResult = {
            valid: false,
            error: `The initial player '${initialPlayer}' is not valid. Valid initial players are: ${INITIAL_PLAYER_OPTIONS_STR}.`
        } as ValidationResult;
        return validationResult
    }

    // If the initial player is valid, return the validation result
    const validationResult = {
        valid: true
    } as ValidationResult;
    return validationResult
}

const GAME_RULES_KEYS = Object.keys(initialSettingsRaw.gameRules) as (keyof GameRules)[];
const GAME_RULES_KEYS_SET = new Set(GAME_RULES_KEYS);
const GAME_RULES_KEYS_STR = GAME_RULES_KEYS.map(key => `"${key}"`).join(', ');
/**
 * Validates if the given game rule is a valid representation of a game rule.
 * @param gameRule - The game rule to validate.
 * @returns {ValidationResult} - An object indicating whether the game rule is valid or not, and an optional error message.
 */
function isValidGameRule(gameRule: unknown): ValidationResult {
    // If the game rule is not a string, return the validation result
    if (typeof gameRule !== 'string') {
        const validationResult = {
            valid: false,
            error: 'Game rule must be a string.'
        } as ValidationResult;
        return validationResult
    }

    // If the game rule is not one of the valid keys, return the validation result
    if (!GAME_RULES_KEYS_SET.has(gameRule as keyof GameRules)) {
        const validationResult = {
            valid: false,
            error: `The game rule '${gameRule}' is not valid. Valid game rules are: ${GAME_RULES_KEYS_STR}.`
        } as ValidationResult;
        return validationResult
    }

    // If the game rule is valid, return the validation result
    const validationResult = {
        valid: true
    } as ValidationResult;
    return validationResult
}


// --- Setter Functions ---


/**
 * Sets the game mode in local storage.
 * @param {Gamemode} gamemode - The game mode to be set in local storage.
 * @throws {Error} - If the game mode is not valid.
 * @returns {void}
 */
export function setGamemode(gamemode: Gamemode): void {
    // Check if the game mode is valid.
    // If the game mode is not valid, throw an error.
    const gamemodeValidationResult = isValidGamemodes(gamemode);
    if (!gamemodeValidationResult.valid) {
        throw new Error(`The game mode is not valid: ${gamemodeValidationResult.error}`);
    }

    // Set the game mode if it is valid
    const settings = getSettings();
    settings.gamemode = gamemode;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings));

    // Update the cached settings
    cachedSettings = settings;
}

/**
 * Sets the board size in local storage.
 * @param {BoardSize} boardSize - The board size to be set in local storage.
 * @throws {Error} - If the board size is not valid.
 * @returns {void}
 */
export function setBoardSize(boardSize: BoardSize): void {
    // Check if the board size is valid.
    // If the board size is not valid, throw an error.
    const boardSizeValidationResult = isValidBoardSize(boardSize);
    if (!boardSizeValidationResult.valid) {
        throw new Error(`The board size is not valid: ${boardSizeValidationResult.error}`);
    }

    // Set the board size if it is valid
    const settings = getSettings();
    settings.boardSize = boardSize;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings));

    // Update the cached settings
    cachedSettings = settings;
}

/**
 * Sets the initial player in local storage.
 * @param {InitialPlayer} initialPlayer - The initial player to be set in local storage.
 * @throws {Error} - If the initial player is not valid.
 * @returns {void}
 */
export function setInitialPlayer(initialPlayer: InitialPlayer): void {
    // Check if the initial player is valid.
    // If the initial player is not valid, throw an error.
    const initialPlayerValidationResult = isValidInitialPlayer(initialPlayer);
    if (!initialPlayerValidationResult.valid) {
        throw new Error(`The initial player is not valid: ${initialPlayerValidationResult.error}`);
    }
    
    // Set the initial player if it is valid
    const settings = getSettings();
    settings.initialPlayer = initialPlayer;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings));

    // Update the cached settings
    cachedSettings = settings;
}

/**
 * Sets the game rule in local storage.
 * @param {keyof GameRules} gameRule - The game rule to be set in local storage.
 * @param {boolean} value - The value of the game rule to be set.
 * @throws {Error} - If the game rule is not valid.
 * @returns {void}
 */
export function setGameRule(gameRule: keyof GameRules, value: boolean): void {
    // Check if the game rule is valid.
    // If the game rule is not valid, throw an error.
    const gameRuleValidationResult = isValidGameRule(gameRule);
    if (!gameRuleValidationResult.valid) {
        throw new Error(`The game rule '${gameRule}' is not valid: ${gameRuleValidationResult.error}`);
    }

    // If the value is not a boolean, throw an error
    if (typeof value !== 'boolean') {
        throw new Error(`The value for the game rule '${gameRule}' must be a boolean.`);
    }

    // Set the game rule if it is valid
    const settings = getSettings();
    settings.gameRules[gameRule] = value;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings));

    // Update the cached settings
    cachedSettings = settings;
}


// --- Getter Functions ---


/**
 * Returns whether the settings are present in the local storage or are cached.
 * @returns {boolean} - Returns true if the settings are present in local storage, false otherwise.
 */
function settingsPresent(): boolean {
    // If the settings are cached, return true
    if (cachedSettings) {
        return true
    }

    // Return true if the settings are present in local storage, false otherwise
    const settingsPresent = localStorage.getItem(LOCAL_STORAGE_KEY) !== null;
    return settingsPresent
}

/**
 * Returns the settings from local storage or the cached settings if available.
 * @returns {Settings} - The settings object retrieved from local storage or cached settings.
 */
export function getSettings(): Settings {
    // If the settings are cached, return the cached settings
    if (cachedSettings) {
        return cachedSettings
    }

    // If the settings are not set in local storage, throw an error
    const settingsRaw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!settingsRaw) {
        throw new Error("Error: The settings are not set. Please call the initializeSettings() function inside the componentDidMount() method of the App.js file.");
    }

    // Cache the parsed settings
    const settings = JSON.parse(settingsRaw) as Settings;
    cachedSettings = settings;

    // Return the settings retrieved from local storage
    return settings
}

/**
 * Returns the initial player from the settings.
 * @returns {InitialPlayer} - The initial player from the settings.
 */
export function getInitialPlayer(): InitialPlayer {
    const settings = getSettings();
    const initialPlayer = settings.initialPlayer;
    return initialPlayer
}

/**
 * Returns the board size from the settings.
 * @returns {BoardSize} - The board size from the settings.
 */
export function getBoardSize(): BoardSize {
    const settings = getSettings();
    const boardSize = settings.boardSize;
    return boardSize
}

/**
 * Returns the game mode from the settings.
 * @returns {Gamemode} - The game mode from the settings.
 */
export function getGamemode(): Gamemode {
    const settings = getSettings();
    const gamemode = settings.gamemode;
    return gamemode
}

/**
 * Returns the game rules from the settings.
 * @returns {GameRules} - The game rules from the settings.
 */
export function getGameRules(): GameRules {
    const settings = getSettings();
    const gameRules = settings.gameRules;
    return gameRules
}


// --- Synchronization Functions ---


/**
 * Initializes the settings in local storage.
 * - If settings are not present, sets them to the initial settings (found in initialSettings.json).
 * - If settings are already present, synchronizes them with the initial settings (add missing keys and removes obsolete ones).
 * @returns {void}
 */
export function initializeSettings(): void {
    // If the settings are not present in local storage, we will set them to the initial settings, and cache them.
    // This is done only once, when the application is first loaded.
    if (!settingsPresent()) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialSettings));
        cachedSettings = initialSettings;
        return
    }

    // If the settings are present, we will synchronize them with the initial settings.
    // This could add missing keys from the initial settings to the current settings, and remove obsolete keys that are not present in the initial settings.
    // This is done every time the application is loaded, to ensure that the settings are always up-to-date.
    synchronizeSettings();
}

/**
 * Synchronizes the settings in local storage with the initial settings.
 * - Adds missing keys from the initial settings to the current settings.
 * - Removes obsolete keys that are not present in the initial settings.
 * @returns {void}
 */
function synchronizeSettings(): void {
    // Synchronize the settings with the initial settings
    const settings = getSettings() as Settings;
    const syncedSettings = deepSync(settings, initialSettings) as Settings;

    // Set the synchronized settings back to local storage
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(syncedSettings));

    // Update the cached settings with the synchronized settings
    cachedSettings = syncedSettings;
}

/**
 * Deeply synchronizes the settings object with the initial settings object.
 * - Adds missing keys from the initial settings to the current settings.
 * - Removes obsolete keys that are not present in the initial settings.
 * @param {Object} settings - The current settings object to update.
 * @param {Object} initialSettings - The initial settings object to synchronize with.
 * @returns {Settings} - The updated settings object after synchronization.
 */
function deepSync(settings: { [key: string]: any }, initialSettings: { [key: string]: any }): Settings {
    // Create a set of valid keys from source
    const initialSettingsKeysSet = new Set(Object.keys(initialSettings));

    // Remove the keys from settings that are not present in initialSettings
    for (const key of Object.keys(settings)) {
        if (!initialSettingsKeysSet.has(key)) {
            delete settings[key];
        }
    }

    // Iterate over the keys in initialSettings and add them to settings if they are not present
    for (const key of Object.keys(initialSettings)) {
        const settingsValue = settings[key];
        const initialValue = initialSettings[key];
        
        // If the key is not present in settings, add it with the initial value
        if (!(key in settings)) {
            settings[key] = initialValue;
            continue
        }

        // If the key exists in both objects and both values are non-null objects, we recursively sync them
        if (
            typeof initialValue === 'object' &&
            initialValue !== null &&
            typeof settingsValue === 'object' &&
            settingsValue !== null
        ) {
            deepSync(settingsValue, initialValue);
        }
    }
    return settings as Settings
}