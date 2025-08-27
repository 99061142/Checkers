import { createContext, FC, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { GameSettingValues, getInitialGameSettingValues, storeSettingValuesWithinLocalStorage, validateSettingValues, getGameSettingOptions, getStoredSettingValues, ValidationErrors, SettingValues } from './settingsStorageUtils.ts';
import { useGameStorageContext } from '../../game/gameStorage/gameStorage.tsx';

const useSettingsStorage = () => {
    const {
        canGameBeLoaded,
        deleteGameData
    } = useGameStorageContext();

    const [isSettingFormShown, setIsSettingFormShown] = useState<boolean>(false);
    const [gameSettings, setGameSettings] = useState<GameSettingValues>(getStoredSettingValues()?.gameSettings || getInitialGameSettingValues()); 
    
    const gameSettingOptions = getGameSettingOptions();
    const boardRowsAmount = gameSettings.board.rows;

    /**
     * Returns an object containing the current setting values.
     * @returns {SettingValues} - The current setting values.
     */
    const currentSettingValues = useMemo((): SettingValues => {
        const currentSettingValues: SettingValues = {
            gameSettings
        };
        return currentSettingValues;
    }, [gameSettings]);

    /**
     * * logs error messages for incorrect values. (values which are of the wrong type, or not one of the allowed values)
     * * logs info messages for missing properties. (values that are expected but not present)
     * * logs debug messages for unexpected properties. (values that are present but not expected)
     * @param {ValidationErrors} errors - The validation errors to log.
     * @returns {void}
     */
    const logErrorMessagesForInvalidSettings = useCallback((errors: ValidationErrors): void => {
        // Logs the error messages for the incorrect values.
        // This could be due to the value being of the wrong type, or the value is not one of the allowed values.
        // We log these as errors, since they are critical issues that need to be addressed.
        const incorrectValueErrors = errors.incorrectValueErrors;
        for (const errorMessage of incorrectValueErrors) {
            console.error(errorMessage);
        }

        // Logs the error messages for the missing properties.
        // This could be due to the `initialSettings.json` file being changed from the previous time the application was run.
        // We log these as `info`, since they are not critical issues, but gives context to the user about the missing properties.
        const missingPropertyErrors = errors.missingPropertyErrors;
        for (const errorMessage of missingPropertyErrors) {
            console.info(errorMessage);
        }

        // Logs the error messages for the unexpected properties.
        // This could be due to the `initialSettings.json` file being changed from the previous time the application was run.
        // We log these as `debug`, since they are not critical issues, but gives context to the developer about the unexpected properties.
        const unexpectedPropertyErrors = errors.unexpectedPropertyErrors;
        for (const errorMessage of unexpectedPropertyErrors) {
            console.debug(errorMessage);
        }
    }, []);

    /**
     * Validates the settings and persists them within the local storage.
     * * If some setting properties are missing, incorrect, or unexpected, it logs the error messages.
     * * Afterwards, it stores the validated settings within the local storage.
     * * If the validation result indicates that the game data must be reset, it deletes the game data.
     * @param {SettingValues} settingsToValidate - The settings to validate.
     * @returns {void}
     */
    const validateAndPersistSettings = useCallback((settingsToValidate: SettingValues, mustStoreSettings: boolean = true): void => {
        const validationResult = validateSettingValues(settingsToValidate);
        const { errors, validatedSettingValues, mustResetGameData, isValid } = validationResult;

        logErrorMessagesForInvalidSettings(errors);

        // We store the `validatedSettingValues` within the local storage if:
        // 1. The application gets loaded, and the settings are invalid.
        // 2. The settings form is closed, we always save the settings.
        if (
            mustStoreSettings || 
            !isValid
        ) {
            storeSettingValuesWithinLocalStorage(validatedSettingValues)
        }

        // If the validation result indicates that the game data must be reset, we delete the game data.
        // This is done to ensure that the game data is in a valid state, since the settings have changed.
        if (
            mustResetGameData && 
            canGameBeLoaded
        ) {
            deleteGameData();
        }
    }, [logErrorMessagesForInvalidSettings, deleteGameData, canGameBeLoaded]);

    // When the `SettingsStorageProvider` mounts, it validates the settings and persists them within the local storage.
    const isInitialValidationValidatedRef = useRef(false);
    useEffect(() => {
        if (isInitialValidationValidatedRef.current) {
            return;
        }
        isInitialValidationValidatedRef.current = true;

        const mustStoreSettings = false;
        validateAndPersistSettings(currentSettingValues, mustStoreSettings);
    }, [currentSettingValues, validateAndPersistSettings]);

    // When the `isSettingFormShown` state changes from `true` to `false`, which indicates that the settings form has been closed, we validate and persist the settings.
    const previousIsSettingFormShownState = useRef(isSettingFormShown);
    useEffect(() => {
        // If the form is closed after being opened
        if (
            previousIsSettingFormShownState.current && 
            !isSettingFormShown
        ) {
            validateAndPersistSettings(currentSettingValues);
        }
        
        previousIsSettingFormShownState.current = isSettingFormShown;
    }, [isSettingFormShown, currentSettingValues, validateAndPersistSettings]);

    // Add the `beforeunload` event listener to validate and persist the settings when the user tries to close the application, while still being within the settings form.
    useEffect(() => {
        /** 
         * If the user tries to close the application while still being within the settings form, we validate and persist the settings.
         * @returns {void}
         */
        const beforeunloadHandler = (): void => {
            if (isSettingFormShown) {
                validateAndPersistSettings(currentSettingValues);
            }
        };

        window.addEventListener('beforeunload', beforeunloadHandler);
        return () => {
            window.removeEventListener('beforeunload', beforeunloadHandler);
        }
    }, [validateAndPersistSettings, currentSettingValues, isSettingFormShown]);

    return {
        gameSettings,
        setGameSettings,
        gameSettingOptions,
        setIsSettingFormShown,
        boardRowsAmount
    };
}


const SettingsStorageContext = createContext<ReturnType<typeof useSettingsStorage> | null>(null);

export const SettingsStorageProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const value = useSettingsStorage();
    return (
        <SettingsStorageContext.Provider 
            value={value}
        >
            {children}
        </SettingsStorageContext.Provider>
    );
};

export function useSettingsStorageContext() {
    const context = useContext(SettingsStorageContext);
    if (!context) {
        throw new Error('useSettingsStorageContext must be used within a SettingsStorageProvider');
    }
    return context;
}