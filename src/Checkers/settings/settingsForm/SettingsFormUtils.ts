import { FC } from "react";

/**
 * Array of valid settings form names which holds the names of all forms that can be displayed.
 * 
 * ! Only use this when an array is the only option, otherwise use the `settingsFormNamesSet` set.
 */
export const settingsFormNamesArray = [
    "game"
] as const;

/**
 * Set of valid settings form names.
 */
const settingsFormNamesSet: Set<SettingName> = new Set<SettingName>(settingsFormNamesArray);

/**
 * The name of the fallback settings form to be used when an invalid form name is provided, and for the initial display when no form name is provided.
 */
export const fallbackSettingsFormName: SettingName = "game";

/**
 * Type representing the names of the settings forms that can be displayed. 
 */
export type SettingsFormNamesArray = typeof settingsFormNamesArray;

/**
 * Type representing a valid settings form name.
 */
export type SettingName = SettingsFormNamesArray[number];


/** 
 * Type representing the configuration for a single settings form.
 * - `Component`: The actual React component for the settings form.
 * - `shouldSuspense`: Whether the settings form should be wrapped in a Suspense boundary.
 * - `props`: The props which should be passed to the settings form component.
 * - `displayName`: The display name which is used to identify the settings form.
*/
export type SettingsFormConfig<TProps = any> = {
    Component: FC<TProps>;
    shouldSuspense: boolean;
    props: TProps;
    displayName: string;
}

/**
 * Type representing the configuration for all settings forms.
 * Each key represents a settings form name and the value is the configuration for that form.
 */
export type SettingsFormsConfig = {
    [settingName in SettingName]: SettingsFormConfig<any>;
};


/**
 * Returns whether the provided name is a valid settings form name.
 * @param {string} name - The settings form name to be checked.
 * @returns {boolean} True if the name is a valid settings form name, false otherwise.
 */
export const isValidSettingsFormName = (name: string): boolean => {
    if (settingsFormNamesSet.has(name as SettingName)) {
        return true;
    }

    return false;
}

/**
 * The error message for when the fallback settings form name is not valid.
 */
export const fallbackSettingsFormNameNotValidMessage: string = `The fallback settings form name "${fallbackSettingsFormName}" is not a valid settings form name.`;

/**
 * The error message for when a settings form is missing its configuration.
 * @param {SettingName} formName - The name of the settings form.
 * @returns {string} The error message.
 */
export const missingConfigForSettingsFormErrorMessage = (formName: SettingName): string => {
    const message: string = `The component "${formName}" is missing its configuration. Please ensure that there is a configuration for the component "${formName}".`;
    return message;
}

export const revertToFallbackSettingsFormMessage = (invalidFormName: string): string => {
    const message: string = `The settings form name "${invalidFormName}" is not valid. Reverting to the fallback settings form "${fallbackSettingsFormName}".`;
    return message;
}