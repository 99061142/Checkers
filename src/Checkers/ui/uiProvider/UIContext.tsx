import { createContext, Context } from 'react';
import { ComponentConfig, ComponentName } from './UIProviderUtils.ts';

/**
 * Type for the UI Provider context value.
 * - `getCurrentDisplayedComponentsConfig`: Function to get the currently displayed components' configurations.
 * - `navigateTo`: Function to navigate to a specific component.
 * - `openOverlay`: Function to open a component as an overlay.
 * - `openRoot`: Function to open a component as a root component. This will clear the history and set the component as the only displayed component.
 * - `goBack`: Function to go back to the previous component.
 */
export interface UIContextType {
    getCurrentDisplayedComponentsConfig: () => ComponentConfig[];
    navigateTo: (componentName: ComponentName) => void;
    openOverlay: (componentName: ComponentName) => void;
    openRoot: (componentName: ComponentName) => void;
    goBack: () => void;
}

/**
 * Context for the UI Provider.
 */
export const UIProviderContext: Context<UIContextType | null> = createContext<UIContextType | null>(null);