import { createContext, Context, ReactNode } from 'react';
import { ComponentName } from './UIProviderUtils.ts';

/**
 * Type representing the display state of each component.
 * Each key represents a component and the value is a boolean indicating whether the component is displayed.
 */
export type DisplayState = {
    [componentName in ComponentName]: boolean;
}

/**
 * Type for the UI Provider context value.
 * - `displayComponent`: Function to display a component by its name.
 * - `hideComponent`: Function to hide a component by its name.
 * - `hideAllDisplayedComponents`: Function to hide all currently displayed components, with an optional set of exceptions.
 * - `displayLastSetDisplayedComponent`: Function to display the last set displayed component.
 * - `hideLastSetDisplayedComponent`: Function to hide the last set displayed component.
 * - `hideCurrentlyDisplayedComponentsAndDisplayNewComponent`: Function to hide currently displayed components and display a new component, with optional exceptions.
 * - `hideLastDisplayedComponentAndDisplayNewComponent`: Function to hide the last displayed component and display a new component.
 * - `getComponent`: Function to retrieve a component by its name.
 * - `displayState`: Object representing the current display state of all components.
 */
export interface UIContextType {
    displayComponent: (componentName: ComponentName) => void;
    hideComponent: (componentName: ComponentName) => void;
    hideAllDisplayedComponents: (exceptComponentsName?: Set<ComponentName>) => void;
    displayLastSetDisplayedComponent: () => void;
    hideLastSetDisplayedComponent: () => void;
    hideCurrentlyDisplayedComponentsAndDisplayNewComponent: (componentName: ComponentName, exceptComponentsName?: Set<ComponentName>) => void;
    hideLastDisplayedComponentAndDisplayNewComponent: (componentName: ComponentName) => void;
    getComponent: (componentName: ComponentName) => ReactNode | null;
    displayState: DisplayState;
}

/**
 * Context for the UI Provider.
 */
export const UIProviderContext: Context<UIContextType | null> = createContext<UIContextType | null>(null);