import { FC, memo, Suspense, useCallback, useEffect, useMemo } from "react";
import { fallbackSettingsFormName, fallbackSettingsFormNameNotValidMessage, isValidSettingsFormName, missingConfigForSettingsFormErrorMessage, revertToFallbackSettingsFormMessage, SettingName, SettingsFormConfig, SettingsFormsConfig } from "./SettingsFormUtils.ts";
import GameSettingsForm, { GameSettingsFormProps } from "./gameSettingsForm/GameSettingsForm.tsx";
import LoadingFallback from "../../loadingFallback/LoadingFallback.tsx";

interface SettingsFormProps {
    initialSettingsFormName?: SettingName;
    currentFormName: SettingName | null;
    setCurrentFormName: (formName: SettingName) => void;
}

const SettingsForm: FC<SettingsFormProps> = ({
    initialSettingsFormName = fallbackSettingsFormName,
    currentFormName,
    setCurrentFormName
}) => {
    // If the fallback settings form name is invalid, default to the fallback settings form name
    // This is done even when the initial settings form name is provided, to ensure that the fallback is always valid
    if (!isValidSettingsFormName(fallbackSettingsFormName)) {
        throw new RangeError(fallbackSettingsFormNameNotValidMessage);
    }

    /**
     * Configuration for all settings form components that can be displayed.
     */
    const settingsFormsConfig: SettingsFormsConfig = useMemo(() => {
        /**
         * Creates a settings form configuration with the specified parameters.
         * 
         * This creates a memoized component which merges the default props with any additional props passed to it.
         * @param {SettingsFormConfig} args - The parameters for the settings form configuration. 
         * @returns {SettingsFormConfig} The settings form configuration with memoized component.
         */
        const createSettingsFormConfig = <TProps extends Record<string, any>>(
            args: SettingsFormConfig<TProps>
        ): SettingsFormConfig<TProps> => {
            const { 
                Component,
                props: defaultProps,
                displayName
            } = args;

            // Create a memoized component that merges default props with any additional props
            const MemoizedComponent = memo<Partial<TProps>>((additionalProps = {}) => (
                <Component
                    {...(defaultProps as TProps)}
                    {...additionalProps}
                />
            ));

            MemoizedComponent.displayName = displayName;

            // Return the settings form configuration with the memoized component
            return {
                ...args,
                Component: MemoizedComponent
            };
        };

        // Define and return the settings forms configuration
        return {
            'game': createSettingsFormConfig<GameSettingsFormProps>({
                Component: GameSettingsForm,
                shouldSuspense: false,
                props: {},
                displayName: 'Game'
            })
        };
    }, []);

    /**
     * Returns the settings form configuration for the specified form name.
     * @param {SettingName} formName - The name of the settings form.
     * @returns {SettingsFormConfig | null} The settings form configuration, or null if not found.
     */
    const getSettingsFormConfig = useCallback((formName: SettingName): SettingsFormConfig<any> | null => {
        const settingsFormConfig = settingsFormsConfig[formName];

        // If the settings form config is not found, return an error message
        if (!settingsFormConfig) {
            const errorMessage: string = missingConfigForSettingsFormErrorMessage(formName);
            console.error(errorMessage);
            return null;
        }

        return settingsFormConfig;

    }, [settingsFormsConfig]);

    /**
     * Returns the configuration for the currently displayed settings form.
     * If the current form name is invalid, it returns the fallback settings form configuration.
     * @returns {SettingsFormConfig | null} The current settings form configuration, or null if not found.
     */
    const getCurrentSettingsFormConfig = useCallback((): SettingsFormConfig<any> | null => {
        // If the current form name is not yet set, return null
        if (!currentFormName) {
            return null;
        }

        const currentSettingsFormConfig: SettingsFormConfig<any> | null = getSettingsFormConfig(currentFormName);

        // If the settings form config is not found, log an error and return the fallback settings form config
        if (!currentSettingsFormConfig) {
            const errorMessage: string = missingConfigForSettingsFormErrorMessage(currentFormName);
            console.error(errorMessage);
            
            const fallbackSettingsFormConfig: SettingsFormConfig<any> | null = getSettingsFormConfig(fallbackSettingsFormName);
            return fallbackSettingsFormConfig;
        }
        
        return currentSettingsFormConfig;
    }, [currentFormName, getSettingsFormConfig]);


    /**
     * Handles initializing the current form name based on the initial settings form name.
     * If no initial form name is provided, or if it is invalid, it defaults to the fallback settings form name.
     */
    useEffect(() => {
        // If the initial settings form name is not valid, log an error and redirect to the fallback settings form, and return
        if (!isValidSettingsFormName(initialSettingsFormName)) {
            const errorMessage: string = revertToFallbackSettingsFormMessage(initialSettingsFormName);
            console.error(errorMessage);
            
            setCurrentFormName(fallbackSettingsFormName);
            return;
        }

        setCurrentFormName(initialSettingsFormName);
    }, [initialSettingsFormName, setCurrentFormName]);
    

    // Show the loading fallback while currentFormName is being initialized.
    // This should only happen while the settings page is initializing
    if (!currentFormName) {
        return <LoadingFallback />;
    }

    const { Component, shouldSuspense } = getCurrentSettingsFormConfig() || {};
    return (
        <>
            {shouldSuspense ? (
                <Suspense
                    fallback={<LoadingFallback />}
                >
                    {Component ? <Component /> : null}
                </Suspense>
            ) : (
                Component ? <Component /> : null
            )}
        </>
    );
}

export default SettingsForm;