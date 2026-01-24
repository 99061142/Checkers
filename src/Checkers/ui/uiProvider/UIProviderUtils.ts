import { FC } from "react";

/**
 * Array of valid component names which holds the names of all components that can be displayed.
 * 
 * ! Only use this when an array is the only option, otherwise use the `validComponentNames` set.
 */
export const validComponentNamesArray = [
    'mainMenu', 
    'settings', 
    'game', 
    'escapeMenu'
] as const;

/**
 * The name of the fallback component to be used when an invalid component name is provided, or for the initial display.
 */
export const fallbackComponentName: ComponentName = "mainMenu";

/**
 * Set of valid component names.
 */
export const validComponentNames: Set<ComponentName> = new Set<ComponentName>(validComponentNamesArray);

/**
 * Type representing the names of the components that can be displayed.
 */
export type ComponentName = typeof validComponentNamesArray[number];

/**
 * Type representing the type of component.
 * This is used to determine how and if the component should be displayed.
 * - If the component is of type "overlay", it should be displayed on top of the current component(s).
 * - If the component is of type "fullscreen", it is the only component that should be displayed, hiding all other "fullscreen" components.
 */
export type ComponentUIType = "overlay" | "fullscreen"

/**
 * Type representing the role of a component.
 * This states the role of the component in the UI hierarchy, and does not affect what should be displayed.
 * - If the component is of role "root", it should be the first component in the set of displayed components.
 * - If the component is of role "modal", it should be displayed on top of the root component. This is because we then allow the user to travel back to the previous component, which can be either a "modal" or "root" component.
 * - If the component is of role "overlay", it should be displayed on top of the "modal" and "root" components. We then also allow the user to travel back to the previous component, which can be either a "modal" or "root" component.
 */
export type ComponentUIRole = "root" | "modal" | "overlay";

/** 
 * Type representing the configuration for a single component.
 * - `type`: The type of the component, which determines how it should be displayed.
 * - `Component`: The actual React component to be displayed.
 * - `role`: The role of the component in the UI hierarchy.
 * - `shouldSuspense`: Whether the component should be wrapped in a Suspense boundary.
 * - `props`: The props which should be passed to the component.
 * - `displayName`: The display name which is used to identify the component.
 */
export type ComponentConfig<TProps = any> = {
    type: ComponentUIType;
    Component: FC<TProps>;
    role: ComponentUIRole;
    shouldSuspense: boolean;
    props: TProps;
    displayName: string;
}

/**
 * Type representing the configuration for all components.
 * Each key represents a component name and the value is the configuration for that component.
 */
export type ComponentsConfig = {
    [componentName in ComponentName]: ComponentConfig<any>;
};

/**
 * The error message for when a component is not of the specified role.
 * @param {ComponentName} componentName - The name of the component.
 * @param {ComponentUIRole} role - The role that the component is expected to have.
 * @returns {string} The error message.
 */
export const componentIsNotSpecifiedRoleErrorMessage = (componentName: ComponentName, role: ComponentUIRole): string => {
    const message: string = `The component "${componentName}" is not of role "${role}". Please ensure that only components of role "${role}" are used for this operation.`;
    return message;
}

/**
 * The error message for when a component is not one of the specified roles.
 * @param {ComponentName} componentName - The name of the component.
 * @param {ComponentUIRole[]} roles - The roles that the component is expected to have.
 * @returns {string} The error message.
 */
export const componentIsNotOneOfSpecifiedRolesErrorMessage = (componentName: ComponentName, roles: ComponentUIRole[]): string => {
    const availableRolesOptions = roles
        .map(name => `\n- ${name}`)
        .join('');

    const message: string = `The component "${componentName}" is not one of the following roles:\n${availableRolesOptions}. Please ensure that only components of role ${availableRolesOptions} are used for this operation.`;
    return message;
}

/**
 * The error message for when a component is missing its configuration.
 * @param {ComponentName} componentName - The name of the component.
 * @returns {string} The error message.
 */
export const missingConfigForComponentErrorMessage = (componentName: ComponentName): string => {
    const message: string = `The component "${componentName}" is missing its configuration. Please ensure that there is a configuration for the component "${componentName}".`;
    return message;
}

/**
 * The error message for when a component is missing a required property in its configuration.
 * @param {ComponentName} componentName - The name of the component.
 * @param {keyof ComponentConfig<any>} missingProperty - The missing property in the component's configuration.
 * @returns {string} The error message.
 */
export const missingConfigPropertyForComponentErrorMesage = (componentName: ComponentName, missingProperty: keyof ComponentConfig<any>): string => {
    const message: string = `The component "${componentName}" is missing the required property "${missingProperty}" in its configuration. Please ensure that the property "${missingProperty}" is specified for the component "${componentName}".`;
    return message;
}

/**
 * The error message for when the fallback component name is not valid.
 */
export const fallbackComponentNameNotValidMessage: string = `The fallback component name "${fallbackComponentName}" is not valid. Please ensure that the fallback component name is one of the valid component names.`;

/**
 * The message for when there is no previous component to go back to.
 */
export const noPreviousComponentToGoBackToMessage: string = `There is no previous component to go back to. Please ensure that there is a previous component in the history to go back to.`;

/**
 * The message for when there are no components available to display.
 */
export const noComponentsAvailableToDisplayErrorMessage: string = "There are no components available to display. Please ensure that there is at least one component configured to be displayed.";

/**
 * Returns a message for when an invalid component name is given.
 * @param {string} componentName - The name of the component that is invalid.
 * @returns {string} The error message.
 */
export const getInvalidComponentMessage = (componentName: string): string => {
    // Create a string listing all valid component names.
    const availableComponentNamesOptions: string = validComponentNamesArray
        .map(name => `\n- ${name}`)
        .join('');

    const message: string = `The component name "${componentName}" is not valid. Please ensure that the component name is one of the valid component names:\n${availableComponentNamesOptions}`;
    return message;
}

/**
 * Returns a message when an invalid component name is given, including stating that we are redirecting to the fallback component.
 * @param {string} invalidComponentName - The name of the component that is invalid.
 * @returns {string} The error message.
 */
export const getInvalidComponentRedirectMessage = (invalidComponentName: string): string => {
    const invalidComponentMessage: string = getInvalidComponentMessage(invalidComponentName);
    const message: string = `${invalidComponentMessage}\n\nRedirecting to the ${fallbackComponentName} as fallback component.`;
    return message;
}

/**
 * The message for when the components history is empty and we are redirecting to the fallback component.
 */
export const getEmptyComponentsHistoryRedirectMessage = `The components history is empty. Redirecting to the ${fallbackComponentName} as fallback component.`;


/**
 * Validates if a component name is valid.
 * @param {string} componentName - The component name to validate.
 * @returns True if valid, false otherwise.
 */
export const isValidComponentName = (componentName: string): boolean => {
    // If the component name exists in the set of valid component names, return true, else return false.
    if (validComponentNames.has(componentName as ComponentName)) {
        return true;
    }
    return false;
};