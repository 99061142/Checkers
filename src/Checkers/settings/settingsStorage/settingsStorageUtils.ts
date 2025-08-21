import rawInitialSettings from '../initialSettings.json';

// The local storage key which is used to store the settings data.
const _SETTINGS_LOCAL_STORAGE_KEY = 'settingsData';

/**
 * The keys of the initial settings partition cache.
 * This is used to partition the settings into separate objects, potentially containing the values, options, and explanations.
 */
const settingPartitionKeys: (keyof InitialSettingsPartitionCache)[] = ['values', 'options', 'explanations'];

/**
 * The initial settings partition cache.
 * This is used to cache the partitioned settings, so we don't have to partition the settings every time we need them.
 */
const _INITIAL_SETTINGS_PARTITION_CACHE: InitialSettingsPartitionCache = Object.fromEntries(settingPartitionKeys.map(key => [key, {}]));

/**
 * The possible game rules that can be set within the game settings.
 * This is used to define the game rules interface, to validate the game rules, and to create the game rules form itself.
 */
export const GAME_RULES  = [
    'mandatoryCapture',
    'flyingKing',
    'canMoveBackwards',
    'turnEndsOnPromotion'
] as const;

export type BoardRow = 8 | 10 | 12;

const _POSSIBLE_PLAYER_VALUES = [1, 2] as const;
export const POSSIBLE_PLAYER_VALUES_SET = new Set(_POSSIBLE_PLAYER_VALUES);
export type Player = (typeof _POSSIBLE_PLAYER_VALUES)[number];
export type GameMode = 'pvp' | 'pve';
export type GameRule = (typeof GAME_RULES)[number];
type Explanation = {
    [language: string]: string;
};

// Base setting type that works for any value type.
export interface BaseSetting<T> {
    value: T;
    options?: T[];
    explanation?: Explanation;
}

/**
 * Generic settings node for nested structure.
 * If `T` is an object, it recursively defines the structure.
 * Else it wraps the value in a `BaseSetting`.
 */
export type SettingNode<T> = {
    [K in keyof T]: T[K] extends Record<string, any> 
        ? SettingNode<T[K]> 
        : BaseSetting<T[K]>;
};

/**
 * Type for extracting values from settings.
 * If the stting is a `BaseSetting`, it extracts the value type (V).
 * If so, it recursively extracts values from nested objects.
 * If not, it returns `never`.
 */
export type ExtractValues<T> = {
    [K in keyof T]: T[K] extends BaseSetting<infer V> 
        ? V 
        : T[K] extends object 
            ? ExtractValues<T[K]> 
            : never;
};

/** 
 * Type for extracting options from settings.
 * If the setting is a `BaseSetting`, it extracts the options type (V[]).
 * If so, it recursively extracts options from nested objects.
 * If not, it returns `never`.
 */
export type ExtractOptions<T> = {
    [K in keyof T]: T[K] extends BaseSetting<infer V> 
        ? V[] 
        : T[K] extends object 
            ? ExtractOptions<T[K]> 
            : never;
};

/**
 * Type for extracting explanations from settings.
 * If the setting is a `BaseSetting`, it extracts the explanation type.
 * If so, it recursively extracts explanations from nested objects.
 * If not, it checks if the setting is an object and recursively extracts explanations from it.
 * If it isn't an object, it returns `never`.
 */
export type ExtractExplanations<T> = {
    [K in keyof T]?: T[K] extends BaseSetting<any> 
        ? Explanation
        : T[K] extends object 
            ? ExtractExplanations<T[K]> 
            : never;
};

/**
 * Structure for the game rules within the game settings.
 */
export type GameRules = {
    [K in GameRule]: boolean;
};

/**
 * Structure for the settings.
 */
export interface SettingsStructure {
    gameSettings: {
        board: {
            rows: BoardRow;
        };
        player: {
            initialPlayer: Player;
        };
        mode: {
            gamemode: GameMode;
        };
        rules: GameRules;
    };
}

/**
 * Object containing the setting structure, including every setting value, option, and explanation.
 */
type Settings = SettingNode<SettingsStructure>;

/**
 * Object containing the game settings structure, including every game setting value, option, and explanation.
 */
type GameSettings = Settings['gameSettings'];

/**
 * Object containing the setting values. This only contains the values of the settings, without the possible other properties (e.g. options, explanations).
 */
export type SettingValues = ExtractValues<Settings>;

/**
 * Object containing the game setting values. This only contains the values of the game settings, without the possible other properties (e.g. options, explanations).
 */
export type GameSettingValues = SettingValues['gameSettings'];

/**
 * Object containing the setting options. This only contains the options of the settings, without the possible other properties (e.g. values, explanations).
 */
type SettingOptions = ExtractOptions<Settings>;

/**
 * Object containing the game setting options. This only contains the options of the game settings, without the possible other properties (e.g. values, explanations).
 */
type GameSettingOptions = SettingOptions['gameSettings'];

/**
 * Object containing the setting explanations. This only contains the explanations of the settings, without the possible other properties (e.g. values, options).
 */
type SettingExplanations = ExtractExplanations<Settings>;

/**
 * Setting key within the first depth of the initial settings object.
 */
type SettingKey = keyof Settings;

/**
 * Interface for the initial settings partition cache.
 * This is used to cache the partitioned settings, so we don't have to partition the settings every time we need them.
 * - `values`: Contains the values of the initial settings.
 * - `options`: Contains the options of the initial settings.
 * - `explanations`: Contains the explanations of the initial settings.
 */
type InitialSettingsPartitionCache = {
    values?: Partial<SettingValues>;
    options?: Partial<SettingOptions>;
    explanations?: Partial<SettingExplanations>;
}

/**
 * Interface for validation errors.
 * - `incorrectValueErrors`: Array of error messages for incorrect values.
 * - `missingPropertyErrors`: Array of error messages for missing properties.
 * - `unexpectedPropertyErrors`: Array of error messages for unexpected properties.
 */
export interface ValidationErrors {
    incorrectValueErrors: string[];
    missingPropertyErrors: string[];
    unexpectedPropertyErrors: string[];
}

/**
 * Interface for the result of validating setting values.
 * - `isValid`: Indicates if the setting values are valid.
 * - `errors`: Contains an object which contains the validaiton errors.
 * - `mustResetGameData`: Indicates if the game data must be reset due to validation issues.
 * - `validatedSettingValues`: The validated setting values. This will be the mutated version if the validation process found any issues, or the same as the input if no issues were found. 
 */
interface SettingValuesValidationResult {
    isValid: boolean;
    errors: ValidationErrors;
    mustResetGameData: boolean;
    validatedSettingValues: SettingValues;
}


/**
 * Partitions the settings object into separate objects. Potentially containing the values, options, and explanations.
 * This is done to allow us to cache the partitioned settings, so we don't have to partition the settings every time we need them.
 * @param {object} settingsToPartition - The settings object to partition. 
 * @returns {object} - The partitioned settings object, containing the separated objects.
 */
function partitionSettings(settingsToPartition: object): object {
    // Create an empty cache object to store the partitioned settings.
    const settingsToPartitionCache = Object
        .fromEntries(settingPartitionKeys.map(key => [key, {}])
    ) as InitialSettingsPartitionCache;

    /**
     * Recursively partitions the settings object into separate objects potentially containing the values, options, and explanations.
     * @param {object} currentObject - The current object to partition.
     * @param {object} valuesTarget - The target object to store the values.
     * @param {object} optionsTarget - The target object to store the options.
     * @param {object} explanationsTarget - The target object to store the explanations.
     * @returns {void
     */
    function recurse(currentObject: object, valuesTarget: object, optionsTarget: object, explanationsTarget: object): void {
        for (const key in currentObject) {
            const value = currentObject[key];
            
            // If there is a `value` property, it means it is a leaf node. 
            // This is because we never set a value elsewhere, except for the leaf nodes.
            // Because of this, we add the properties within the value object to the respective targets, and continue to the next iteration.
            if ('value' in value) {
                valuesTarget[key] = value.value;

                if ('options' in value) {
                    optionsTarget[key] = value.options;
                }
                
                if ('explanation' in value) {
                    explanationsTarget[key] = value.explanation;
                }

                continue;
            } 

            // If we are at this line, it means that it is a nested object, so we need to recurse into it.
            // Because of this, we create new objects for the necessary targets, and recurse into the value.
            valuesTarget[key] = {};
            optionsTarget[key] = {};
            explanationsTarget[key] = {};
            recurse(value, valuesTarget[key], optionsTarget[key], explanationsTarget[key]);
            
            // After we have done the recursion, we check if the nested objects are empty, and if they are, we delete them from the targets.
            // This will allow us to remove empty partitions from the final result.
            if (!Object.keys(valuesTarget[key]).length) {
                delete valuesTarget[key];
            }
            if (!Object.keys(optionsTarget[key]).length) {
                delete optionsTarget[key];
            }
            if (!Object.keys(explanationsTarget[key]).length) {
                delete explanationsTarget[key];
            }
        }
    }

    // Start the recursion with the initial settings object, and the empty cache objects.
    recurse(settingsToPartition, settingsToPartitionCache.values!, settingsToPartitionCache.options!, settingsToPartitionCache.explanations!);

    // Delete the empty partitions.
    for (const partitionKey in settingsToPartitionCache) {
        if (!Object.keys(settingsToPartitionCache[partitionKey]).length) {
            delete settingsToPartitionCache[partitionKey];
        }
    }

    return settingsToPartitionCache;
}


/* 
 * <========================================>
 *  Validation Functions  
 * <========================================>
 */


/**
 * Validates the game setting values.
 * @param {object} gameSettingValuesToValidate - The game setting values to validate.
 * @returns {boolean} - Whether the game setting values are valid or not.
 */
function validateGameSettingValues(gameSettingValuesToValidate: object, validationErrors: ValidationErrors): boolean {
    /**
     * Recursively validates the game setting values.
     * * Do note that this function mutates the `gameSettingValuesToValidate` object.
     * @param {object} objectValuesToValidate - The object containing the game setting values to validate.
     * @param {object} objectInitialValues - The object containing the initial game setting values.
     * @param {object} objectInitialOptions - The object containing the initial game setting options.
     * @returns {void}
     */
    function recurse(objectValuesToValidate: object, objectInitialValues: object, objectInitialOptions: object): void {
        // Loop through all keys within the object we need to validate to ensure that we don't have any unexpected properties.
        for (const validateKey in objectValuesToValidate) {
            // If the key is not present in the initial values, it means that it is an unexpected property.
            // Because of this, we add an error message, and delete the property from the object we are validating.
            if (!(validateKey in objectInitialValues)) {
                validationErrors.unexpectedPropertyErrors.push(`The '${validateKey}' property is unexpected. Because of this, we will delete the '${validateKey}' property from the game setting values to validate.`);
                delete objectValuesToValidate[validateKey];
            }
        }

        // Loop through all keys within the initial values
        for (const initialKey in objectInitialValues) {
            const valueToValidate = objectValuesToValidate[initialKey];
            const initialValue = objectInitialValues[initialKey];
            const initialOptions = objectInitialOptions[initialKey] || {};

            // If the initial key is not present in the object we are validating, it means that it is a missing property.
            // Because of this, we add an error message, and set the value to the initial value.
            if (!(initialKey in objectValuesToValidate)) {
                validationErrors.missingPropertyErrors.push(`The '${initialKey}' property is missing within the game setting values to validate. We will add the '${initialKey}' property with the initial value.`);
                objectValuesToValidate[initialKey] = initialValue;
                continue;
            }

            // If the value we are validating is an object, we recursively validate it.
            if (
                typeof valueToValidate === 'object' &&
                valueToValidate !== null &&
                !Array.isArray(valueToValidate)
            ) {
                recurse(valueToValidate, initialValue, initialOptions);
                continue;
            }

            // If the value we are validating is not of the same type as the initial value, we add an error message, and set the value to the initial value.
            if (typeof valueToValidate !== typeof initialValue) {
                validationErrors.incorrectValueErrors.push(`The value of the '${initialKey}' property is of the wrong type. It should be of type '${typeof initialValue}', but it is of type '${typeof valueToValidate}'. We will reset the value to the initial value.`);
                objectValuesToValidate[initialKey] = initialValue;
                continue;
            }
            
            // If the value we are validating is of the same type, but the value is not one of the initial options, we add an error message, and set the value to the initial value.
            // Note: We check '!== boolean' because we never set 'options' for boolean values, which is also why we set the 'initialOptions' constant variable to an empty object if the initial options are not present in that case.
            if (
                typeof valueToValidate !== 'boolean' &&
                !initialOptions.includes(valueToValidate)
            ) {
                validationErrors.incorrectValueErrors.push(`The value of the '${initialKey}' property is not a valid option. Because of this, we will reset the value to the initial value.`);
                objectValuesToValidate[initialKey] = initialValue;
                continue;
            }
        }
    }

    const initialGameSettingValues = getInitialGameSettingValues();
    const initialGameSettingOptions = getGameSettingOptions();
    recurse(gameSettingValuesToValidate, initialGameSettingValues, initialGameSettingOptions);

    // Returns whether we must reset the game data or not.
    // This is based on whether there are any incorrect value errors.
    const mustResetGameData = validationErrors.incorrectValueErrors.length > 0;
    return mustResetGameData;
}

/**
 * Validates the setting values.
 * @param {unknown} settingValuesToValidate - The setting values to validate.
 * @throws {TypeError} - If the setting values to validate is not an object.
 * @returns {SettingValuesValidationResult} - The validation result, which contains the validation status, errors, if the game data must be reset, and the validated setting values.
 */
export function validateSettingValues(settingValuesToValidate: unknown): SettingValuesValidationResult {
    if (
        typeof settingValuesToValidate !== 'object' || 
        settingValuesToValidate === null || 
        Array.isArray(settingValuesToValidate)
    ) {
        throw new TypeError('The setting values to validate must be an object.');
    }

    // Initialize the validation errors object.
    // This will be used to store the errors that occur during validation.
    const validationErrors: ValidationErrors = {
        incorrectValueErrors: [],
        missingPropertyErrors: [],
        unexpectedPropertyErrors: []
    }

    let mustResetGameData = false;
    if (!('gameSettings' in settingValuesToValidate)) {
        validationErrors.missingPropertyErrors.push('The \'gameSettings\' property is missing within the setting values to validate.');
    } else {
        mustResetGameData = validateGameSettingValues((settingValuesToValidate as SettingValues).gameSettings, validationErrors);
    }

    const validationResult: SettingValuesValidationResult = {
        isValid: !validationErrors.incorrectValueErrors.length,
        errors: validationErrors,
        mustResetGameData,
        validatedSettingValues: settingValuesToValidate as SettingValues
    };
    return validationResult;
}


/* 
 * <========================================>
 *  Getter Functions  
 * <========================================>
 */


/**
 * Retrieves the initial game setting options from the imported JSON file.
 * @returns {GameSettingOptions} - The initial game setting options object.
 */
export function getGameSettingOptions(): GameSettingOptions {
    // If the initial game setting options are already cached, return them.
    const cachedInitialGameSettingOptions = _INITIAL_SETTINGS_PARTITION_CACHE.options?.gameSettings as GameSettingOptions | undefined;
    if (cachedInitialGameSettingOptions) {
        return cachedInitialGameSettingOptions;
    }

    // Otherwise, retrieve the initial game settings and partition them to get the options.
    const initialGameSettings = getInitialGameSettings();
    const separatedInitialGameSettings = getSeparatedInitialSettings(initialGameSettings, 'gameSettings');
    const initialGameSettingOptions = separatedInitialGameSettings.options as GameSettingOptions;
    return initialGameSettingOptions;
}

/**
 * Retrieves the stored game setting values from the local storage.
 * @returns {GameSettingValues | null} - The stored game setting values if they are stored within the local storage, or null if not.
 */
export function getStoredGameSettingValues(): GameSettingValues | null {
    const storedSettingValues = getStoredSettingValues();
    const gameSettings = storedSettingValues?.gameSettings;
    if (!gameSettings) {
        return null;
    }

    return gameSettings;
}

/**
 * Retrieves the stored setting values from the local storage.
 * @returns {SettingValues | null} - The stored setting values if they are stored within the local storage, or null if not.
 */
export function getStoredSettingValues(): SettingValues | null {
    const storedSettingValues = localStorage.getItem(_SETTINGS_LOCAL_STORAGE_KEY);
    if (!storedSettingValues) {
        return null;
    }

    const parsedSettingValues = JSON.parse(storedSettingValues) as SettingValues;
    return parsedSettingValues;
}

/**
 * Retrieves the initial settings from the imported JSON file.
 * @throws {Error} - If the initial settings data which we imported from the `initialSettings.json` file isn't an object.
 * @returns {Settings} - The initial settings object.
 */
function getInitialSettings(): Settings {
    if (
        typeof rawInitialSettings !== 'object' || 
        rawInitialSettings === null || 
        Array.isArray(rawInitialSettings)
    ) {
        throw new Error('The initial settings data is not available. Please ensure that the initialSettings.json file is correctly imported.');
    }

    // Deeply clone the initial settings data to ensure that we don't modify the original object.
    // This is done to prevent any accidental modifications to the original settings data.
    const parsedInitialSettings = JSON.parse(JSON.stringify(rawInitialSettings)) as Settings;

    console.debug('Retrieving initial settings from the imported JSON file.');
    return parsedInitialSettings;
}

/**
 * Retrieves the initial game settings from the imported JSON file.
 * @throws {Error} - If the `gameSettings` property is mising within the first level of the `initialSettings.json` file.
 * @returns {GameSettings} - The initial game settings object.
 */
function getInitialGameSettings(): GameSettings {
    const initialSettings = getInitialSettings();
    const gameSettings = initialSettings.gameSettings;
    if (!gameSettings) {
        throw new Error('The \'gameSettings\' property is missing within the \'initialSettings.json\' file.');
    }

    return gameSettings;
}

/**
 * Retrieves the initial game setting values from the imported JSON file.
 * @returns {GameSettingValues} - The initial game setting values object.
 */
export function getInitialGameSettingValues(): GameSettingValues {
    // If the initial game setting values are already cached, return them.
    const cachedInitialGameSettingValues = _INITIAL_SETTINGS_PARTITION_CACHE.values?.gameSettings as GameSettingValues | undefined;
    if (cachedInitialGameSettingValues) {
        return cachedInitialGameSettingValues;
    }

    // Otherwise, retrieve the initial game settings and partition them to get the values.
    const initialGameSettings = getInitialGameSettings();
    const separatedInitialGameSettings = getSeparatedInitialSettings(initialGameSettings, 'gameSettings');
    const initialGameSettingValues = separatedInitialGameSettings.values as GameSettingValues;
    return initialGameSettingValues
}

/**
 * Partitions the settings object into separate objects containing the values, options, and explanations.
 * This is done to allow us to cache the partitioned settings, so we don't have to partition the settings every time we need them.
 * @param {object} settingsToPartition - The settings object to partition.
 * @param {SettingKey} settingKey - The key to use for the partition. This will be used to cache the partitioned settings.
 * @throws {Error} - If the settings object we want to partition is not an object.
 * @returns {InitialSettingsPartitionCache} - The partitioned settings object.
 */
function getSeparatedInitialSettings(settingsToPartition: object, settingKey: SettingKey): InitialSettingsPartitionCache {
    if (
        typeof settingsToPartition !== 'object' || 
        settingsToPartition === null ||
        Array.isArray(settingsToPartition)
    ) {
        throw new Error('The settings we want to partition must be an object.');
    }

    // If the initial settings partition cache already contains the partitioned 'values' for the given setting key, we check if we have all the partitions caches beside 'values'.
    // If we do, we return the cached partitions.
    const cachedPartitionValues = _INITIAL_SETTINGS_PARTITION_CACHE.values?.[settingKey] as object | undefined;
    if (cachedPartitionValues) {
        const cachedPartitions = {}
        
        for (const key in settingPartitionKeys) {
            const cachedPartition = _INITIAL_SETTINGS_PARTITION_CACHE[key][settingKey] as object | undefined;
            if (!cachedPartition) {
                break
            }
            cachedPartitions[key] = cachedPartition;
        }
        return cachedPartitions;
    }

    // Partition the settings object into separate objects containing the values, options, and explanations.
    const separatedSettings = partitionSettings(settingsToPartition);

    // Cache the partitioned settings, so we don't have to partition the settings every time we need them.
    for (const key in separatedSettings) {
        _INITIAL_SETTINGS_PARTITION_CACHE[key][settingKey] = separatedSettings[key];
    }

    return separatedSettings;
}


export function getInitialPlayer(): Player {
    // If the initial player is already cached, return it.
    const cachedInitialPlayer = _INITIAL_SETTINGS_PARTITION_CACHE.values?.gameSettings?.player?.initialPlayer;
    if (cachedInitialPlayer) {
        return cachedInitialPlayer;
    }

    // Otherwise, retrieve the initial game settings and get the initial player from it.
    const initialGameSettings = getInitialGameSettings();
    const initialPlayer = initialGameSettings.player.initialPlayer.value;

    return initialPlayer;
}

/**
 * Retrieves the board row amount from the initial game settings.
 * @returns {BoardRow} - The number of rows on the board.
 */
export function getBoardRowAmount(): BoardRow {
    // If the board row amount is already cached, return it.
    const cachedBoardRowAmount = _INITIAL_SETTINGS_PARTITION_CACHE.values?.gameSettings?.board?.rows;
    if (cachedBoardRowAmount) {
        return cachedBoardRowAmount;
    }

    // Otherwise, retrieve the initial game settings and get the board row amount from it.
    const initialGameSettings = getInitialGameSettings();
    const boardRowAmount = initialGameSettings.board.rows.value;
    return boardRowAmount;
}

/* 
 * <========================================>
 *  Save Functions  
 * <========================================>
 */


/**
 * Stores the setting values within the local storage.
 * * This function doesn't validate the setting values before storing them.
 * @param {SettingValues} settingValues - The setting values to store within the local storage.
 * @returns {void}
 */
export function storeSettingValuesWithinLocalStorage(settingValues: SettingValues): void {
    console.debug('Storing settings within the local storage');
    localStorage.setItem(_SETTINGS_LOCAL_STORAGE_KEY, JSON.stringify(settingValues));
}
