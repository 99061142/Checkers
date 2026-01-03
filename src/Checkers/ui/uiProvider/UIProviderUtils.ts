/**
 * Array of valid component names which holds the names of all components that can be displayed.
 * 
 * ! Only use this when an array is the only option, otherwise use the `validComponentNames` set.
 */
const validComponentNamesArray = [
    'mainMenu', 
    'settings', 
    'game', 
    'escapeMenu'
] as const;

/**
 * Type representing the names of the components that can be displayed.
 */
export type ComponentName = typeof validComponentNamesArray[number];

/**
 * The name of the fallback component to be used when an invalid component name is provided, or for the initial display.
 */
export const fallbackComponentName: ComponentName = "mainMenu";

/**
 * Set of valid component names.
 */
export const validComponentNames: Set<ComponentName> = new Set<ComponentName>(validComponentNamesArray);

/**
 * The message for when there is no last set displayed component available.
 */
export const noLastSetComponentDisplayedMessage: string = `There is no last set displayed component available. Please ensure that there is a last set displayed component to go back to.`;

/**
 * The error message for when the fallback component name is not valid.
 */
export const fallbackComponentNameNotValidMessage: string = `The fallback component name "${fallbackComponentName}" is not valid. Please ensure that the fallback component name is one of the valid component names.`;

/**
 * Returns an message for when a component is already being displayed.
 * @param {string} componentName - The name of the component that is already displayed. 
 * @returns {string} The error message.
 */
export const getComponentAlreadyDisplayedMessage = (componentName: string): string => {
    const message: string = `The component "${componentName}" is already being displayed. Please ensure that we are not trying to display a component that is already being displayed.`;
    return message;
}

/**
 * Returns a message for when a component is already hidden.
 * @param {string} componentName - The name of the component that is already hidden.
 * @returns {string} The error message.
 */
export const getComponentAlreadyHiddenMessage = (componentName: string): string => {
    const message: string = `The component "${componentName}" is already hidden. Please ensure that we are not trying to hide a component that is already hidden.`;
    return message;
}

/**
 * Returns an message for when an invalid component name is given.
 * @param {string} componentName - The name of the component that is invalid.
 * @returns {string} The error message.
 */
export const getInvalidComponentMessage = (componentName: string): string => {
    const availableComponentNamesOptions = validComponentNamesArray
        .map(name => `\n- ${name}`)
        .join('');

    const message: string = `The component name "${componentName}" is not valid. Please ensure that the component name is one of the valid component names:\n${availableComponentNamesOptions}`;
    return message;
}

/**
 * Returns an message for redirecting to a fallback component when an invalid component name is given.
 * @param {string} invalidComponentName - The name of the component that is invalid.
 * @returns {string} The error message.
 */
export const getInvalidComponentRedirectMessage = (invalidComponentName: string): string => {
    const invalidComponentErrorMessage: string = getInvalidComponentMessage(invalidComponentName);
    const errorMessage: string = `${invalidComponentErrorMessage}\n\nRedirecting to the ${fallbackComponentName} as fallback component.`;
    return errorMessage;
}

/**
 * Validates if a component name is valid.
 * @param {string} componentName - The component name to validate.
 * @returns true if valid, false otherwise.
 */
export const isValidComponentName = (componentName: string): boolean => {
    if (validComponentNames.has(componentName as ComponentName)) {
        return true;
    }
    return false;
};