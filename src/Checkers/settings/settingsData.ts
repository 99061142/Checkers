import initialSettingsRaw from './initialSettings.json';
const initialSettings = initialSettingsRaw as Settings;

const GAMEMODES = ['pvp', 'pve'] as const;
type Gamemode = typeof GAMEMODES[number];

const BOARD_SIZES = [8, 10, 12] as const;
type BoardSize = typeof BOARD_SIZES[number];

const INITIAL_PLAYERS = [1, 2] as const;
type InitialPlayer = typeof INITIAL_PLAYERS[number];

interface GameRules {
    mandatoryCapture: boolean;
    flyingKing: boolean;
    canMoveBackwards: boolean;
    promotionDuringCapture: boolean;
    turnEndsOnPromotion: boolean;
}

interface Settings {
    gameRules: GameRules;
    gamemode: Gamemode;
    boardSize: BoardSize;
    initialPlayer: InitialPlayer;
}

let cachedSettings: Settings | null = null;

type ValidationResult = {
    valid: boolean;
    error?: string;
};


// --- Validation Functions ---


const GAMEMODES_SET = new Set(GAMEMODES);
const GAMEMODES_OPTIONS_STR = GAMEMODES.map(mode => `"${mode}"`).join(', ');
/**
 * Validates if the given game mode is a valid representation of a game mode.
 * 
 * See the Gamemode type for valid options.
 * @param {unknown} gamemode - The game mode to validate.
 * @returns {ValidationResult} - An object indicating whether the game mode is valid or not, and an optional error message.
 */
function isValidGamemodes(gamemode: unknown): ValidationResult {
    // If the game mode is not a string
    if (typeof gamemode !== 'string') {
        return { valid: false, error: 'Game mode must be a string.' }
    }

    // if the game mode is not one of the valid modes
    if (!GAMEMODES_SET.has(gamemode as Gamemode)) {
        return { valid: false, error: `Game mode must be one of the following: ${GAMEMODES_OPTIONS_STR}.` };
    }

    // If the game mode is valid
    return { valid: true }
}

const BOARD_SIZES_SET = new Set(BOARD_SIZES);
const BOARD_SIZES_OPTIONS_STR = BOARD_SIZES.map(boardSize => `"${boardSize}"`).join(', ');
/**
 * Validates if the given board size is a valid representation of a board size.
 * 
 * See the BoardSize type for valid options.
 * @param {unknown} boardSize - The board size to validate.
 * @returns {ValidationResult} - An object indicating whether the board size is valid or not, and an optional error message.
 */
function isValidBoardSize(boardSize: unknown): ValidationResult {
    // If the board size is not a number
    if (typeof boardSize !== 'number') {
        return { valid: false, error: 'Board size must be a number.' }
    }

    // If the board size is not one of the valid sizes
    if (!BOARD_SIZES_SET.has(boardSize as BoardSize)) {
        return { valid: false, error: `Board size must be one of the following: ${BOARD_SIZES_OPTIONS_STR}.` }
    }

    // If the board size is valid
    return { valid: true }
}

const INITIAL_PLAYERS_SET = new Set(INITIAL_PLAYERS);
const INITIAL_PLAYER_OPTIONS_STR = INITIAL_PLAYERS.map(player => `"${player}"`).join(', ');
/**
 * Validates if the given initial player is a valid representation of an initial player.
 * 
 * See the InitialPlayer type for valid options.
 * @param {unknown} initialPlayer - The initial player to validate.
 * @returns {ValidationResult} - An object indicating whether the initial player is valid or not, and an optional error message.
 */
function isValidInitialPlayer(initialPlayer: unknown): ValidationResult {
    // If the initial player is not a number
    if (typeof initialPlayer !== 'number') {
        return { valid: false, error: 'Initial player must be a number.' }
    }

    // If the initial player is not one of the valid players
    if (!INITIAL_PLAYERS_SET.has(initialPlayer as InitialPlayer)) {
        return { valid: false, error: `Initial player must be one of the following: ${INITIAL_PLAYER_OPTIONS_STR}.` }
    }

    // If the initial player is valid
    return { valid: true }
}

const GAME_RULES_KEYS: (keyof GameRules)[] = [
    'mandatoryCapture',
    'flyingKing',
    'canMoveBackwards',
    'promotionDuringCapture',
    'turnEndsOnPromotion'
];
/**
 * Validates the game rules object.
 * 
 * See the GameRules interface for valid options.
 * @param {unknown} gameRules - The game rules object to validate.
 * @returns {ValidationResult} - An object indicating whether the game rules are valid or not, and an optional error message.
 */
function isValidGameRules(gameRules: unknown): ValidationResult {
    // If the game rules is not an object
    if (
        gameRules === null || 
        typeof gameRules !== 'object'
    ) {
        return { valid: false, error: 'Game rules must be an object.' }
    }

    // Check if all required keys are present and if their values are booleans
    for (const key of GAME_RULES_KEYS) {
        // If the key is not present in the game rules
        if (!(key in gameRules)) {
            return { valid: false, error: `Game rules must contain the key "${key}".` };
        }

        // If the value of the key is not a boolean
        const value = (gameRules as GameRules)[key];
        if (typeof value !== 'boolean') {
            return { valid: false, error: `The value of the game rule "${key}" must be a boolean.` };
        }
    }

    // If the game rules are valid
    return { valid: true }
}

const VALID_SETTINGS_KEYS: (keyof Settings)[] = [
    'gameRules',
    'gamemode',
    'boardSize',
    'initialPlayer'
];
const VALID_SETTINGS_KEYS_SET = new Set(VALID_SETTINGS_KEYS);
const VALID_SETTINGS_KEYS_STR = VALID_SETTINGS_KEYS.map(key => `"${key}"`).join(', ');
/**
 * Validates the settings object.
 * 
 * See the Settings interface for valid options.
 * @param {unknown} settings - The settings object to validate.
 * @returns {ValidationResult} - An object indicating whether the settings are valid or not, and an optional error message.
 */
function isValidSettings(settings: unknown): ValidationResult {
    // If the settings is not an object
    if (
        settings === null || 
        typeof settings !== 'object'
    ) {
        return { valid: false, error: 'Settings must be an object.' }
    }

    // If the game rules are not valid
    const typedSettings = settings as Settings;
    const gameRulesValidation = isValidGameRules(typedSettings.gameRules);
    if (!gameRulesValidation.valid) {
        return { valid: false, error: `Invalid game rules: ${gameRulesValidation.error}` };
    }

    // If the game mode is not valid
    const gamemodeValidation = isValidGamemodes(typedSettings.gamemode);
    if (!gamemodeValidation.valid) {
        return { valid: false, error: `Invalid game mode: ${gamemodeValidation.error}` };
    }

    // If the board size is not valid
    const boardSizeValidation = isValidBoardSize(typedSettings.boardSize);
    if (!boardSizeValidation.valid) {
        return { valid: false, error: `Invalid board size: ${boardSizeValidation.error}` };
    }

    // If the initial player is not valid
    const initialPlayerValidation = isValidInitialPlayer(typedSettings.initialPlayer);
    if (!initialPlayerValidation.valid) {
        return { valid: false, error: `Invalid initial player: ${initialPlayerValidation.error}` };
    }

    // If the settings object contains any additional keys that are not valid
    for (const key in typedSettings) {
        if (!VALID_SETTINGS_KEYS_SET.has(key as keyof Settings)) {
            return { valid: false, error: `Settings object contains an invalid key: "${key}". Valid keys are: ${VALID_SETTINGS_KEYS_STR}.` };
        }
    }

    // If all validations passed
    return { valid: true }
}


// --- Setter Functions ---


/**
 * Sets the game mode in local storage.
 * @param {Gamemode} gamemode - The game mode to be set in local storage.
 * @throws {Error} - If the game mode is not valid.
 * @returns {void}
 */
export function setGamemode(gamemode: Gamemode): void {
    // If the game mode is not valid
    const gamemodeValidationResult = isValidGamemodes(gamemode);
    if (!gamemodeValidationResult.valid) {
        throw new Error(`The game mode is not valid: ${gamemodeValidationResult.error}`);
    }

    // If the game mode is valid, set it in the settings
    const settings = getSettings();
    setSettings({
        ...settings,
        gamemode
    });
}

/**
 * Sets the board size in local storage.
 * @param {BoardSize} boardSize - The board size to be set in local storage.
 * @throws {Error} - If the board size is not valid.
 * @returns {void}
 */
export function setBoardSize(boardSize: BoardSize): void {
    // If the board size is not valid
    const boardSizeValidationResult = isValidBoardSize(boardSize);
    if (!boardSizeValidationResult.valid) {
        throw new Error(`The board size is not valid: ${boardSizeValidationResult.error}`);
    }

    // If the board size is valid, set it in the settings
    const settings = getSettings();
    setSettings({
        ...settings,
        boardSize
    });
}

/**
 * Sets the initial player in local storage.
 * @param {InitialPlayer} initialPlayer - The initial player to be set in local storage.
 * @throws {Error} - If the initial player is not valid.
 * @returns {void}
 */
export function setInitialPlayer(initialPlayer: InitialPlayer): void {
    // If the initial player is not valid
    const initialPlayerValidationResult = isValidInitialPlayer(initialPlayer);
    if (!initialPlayerValidationResult.valid) {
        throw new Error(`The initial player is not valid: ${initialPlayerValidationResult.error}`);
    }
    
    // If the initial player is valid, set it in the settings
    const settings = getSettings();
    setSettings({
        ...settings,
        initialPlayer
    });
}

/**
 * Sets the game rule in local storage.
 * @param {keyof GameRules} gameRule - The game rule to be set in local storage.
 * @param {boolean} value - The value of the game rule to be set.
 * @throws {Error} - If the game rule is not valid.
 * @returns {void}
 */
export function setGameRule(gameRule: keyof GameRules, value: boolean): void {
    // If the game rule is not a valid key of GameRules
    if (!GAME_RULES_KEYS.includes(gameRule)) {
        throw new Error(`The game rule "${gameRule}" is not valid. Valid game rules are: ${GAME_RULES_KEYS.map(key => `"${key}"`).join(', ')}.`);
    }

    // If the game rule is valid, set it in the settings
    const settings = getSettings();
    setSettings({
        ...settings,
        gameRules: {
            ...settings.gameRules,
            [gameRule]: value
        }
    });
}

/**
 * Sets the settings in local storage.
 * @param {Settings} settings - The settings to be set in local storage.
 * @throws {Error} - If the settings are not valid.
 * @returns {void}
 */
export function setSettings(settings: Settings, mustValidate: boolean = true): void {
    // Validate the settings if mustValidate is true
    if (mustValidate) {
        // If the settings are not valid
        const settingsValidationResult = isValidSettings(settings);
        if (!settingsValidationResult.valid) {
            throw new Error("The settings are not valid: " + settingsValidationResult.error);
        }
    }

    // Set the settings in local storage
    localStorage.setItem('settings', JSON.stringify(settings));

    // Cache the settings
    cachedSettings = settings;
}


// --- Getter Functions ---


/**
 * Returns whether the settings are present in local storage.
 * @returns {boolean} - Returns true if the settings are present in local storage, false otherwise.
 */
function settingsPresent(): boolean {
    // Check if the settings are present in local storage
    return localStorage.getItem('settings') !== null
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
    const settingsRaw = localStorage.getItem('settings');
    if (!settingsRaw) {
        throw new Error("Error: The settings are not set. Please call the initializeSettings() function inside the componentDidMount() method of the App.js file.");
    }

    // Cache the settings
    const settings = JSON.parse(settingsRaw) as Settings;
    cachedSettings = settings;

    return settings
}

// --- Synchronization Functions ---


/**
 * Initializes the settings in local storage.
 * - If settings are not present, sets them to the default values from initialSettings.json.
 * - If settings are already present, synchronizes them with the initial settings (adds missing keys and removes obsolete ones).
 * @returns {void}
 */
export function initializeSettings(): void {
    // If the settings are not present in local storage, we will set them to the initial settings.
    // This is done only once, when the application is first loaded.
    if (!settingsPresent()) {
        setSettings(initialSettings);
        return
    }

    // If the settings are present, we will synchronize them with the initial settings.
    // This will add missing keys and remove obsolete ones.
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
    const settings = getSettings();
    const synced = deepSync(settings, initialSettings);

    // Set the synchronized settings back to local storage
    setSettings(synced, false);
}

/**
 * Deeply synchronizes the settings object with the initial settings object.
 * - Adds missing keys from the initial settings to the current settings.
 * - Removes obsolete keys that are not present in the initial settings.
 * @param {Object} settings - The current settings object to update.
 * @param {Object} initialSettings - The initial settings object to synchronize with.
 * @returns {Settings} - The updated settings object after synchronization.
 */
function deepSync(settings: object, initialSettings: object): Settings {
    // Create a set of valid keys from source
    const initialSettingsKeys = new Set(Object.keys(initialSettings));
    
    // Remove the keys from settings that are not present in initialSettings
    for (const key of Object.keys(settings)) {
        if (!initialSettingsKeys.has(key)) {
            delete settings[key];
        }
    }

    for (const key of Object.keys(initialSettings)) {
        const settingsValue = settings[key];
        const initialValue = initialSettings[key];
        
        // If the key is not present in settings, add it with the initial value
        if (!(key in settings)) {
            settings[key] = initialValue;
        }

        // If the key exists in both objects and both values are non-null objects, we recursively sync them
        else if (
            typeof initialValue === 'object' &&
            initialValue !== null &&
            typeof settingsValue === 'object' &&
            settingsValue !== null
        ) {
            deepSync(settingsValue, initialValue);
        }
    }
    return settings as Settings;
}