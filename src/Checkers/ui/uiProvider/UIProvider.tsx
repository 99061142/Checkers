import { FC, ReactNode, useEffect, useState, useCallback, lazy, useRef, MutableRefObject } from 'react';
import { ComponentName, fallbackComponentName, getComponentAlreadyDisplayedMessage, getComponentAlreadyHiddenMessage, fallbackComponentNameNotValidMessage, getInvalidComponentMessage, getInvalidComponentRedirectMessage, noLastSetComponentDisplayedMessage, isValidComponentName } from './UIProviderUtils.ts';
import { UIProviderContext, DisplayState, UIContextType } from './UIContext.tsx';

// Import for the components
import MainMenu from '../../mainMenu/MainMenu.tsx';
const Settings = lazy(() => import('../../settings/Settings.tsx'));
const Game = lazy(() => import('../../game/Game.tsx'));
const EscapeMenu = lazy(() => import('../../escapeMenu/EscapeMenu.tsx'));

/**
 * Props for the useUIProvider hook.
 * - `initialComponentName` (optional): The name of the component to be displayed initially.
 */
interface UseUIProviderProps {
    initialComponentName?: ComponentName;
}

/**
 * Custom hook to manage the UI state.
 * @param {UIProviderProps} initialComponentName - The name of the component to be displayed initially. Defaults to the fallback component name.
 */
const useUIProvider = ({ 
    initialComponentName = fallbackComponentName
}: UseUIProviderProps) => {
    // If the fallback component name is not valid, throw an error.
    // This is done even when the initial component name is provided, to ensure that the fallback is always valid.
    if (!isValidComponentName(fallbackComponentName)) {
        throw new RangeError(fallbackComponentNameNotValidMessage);
    }

    const lastSetDisplayedComponentNameRef: MutableRefObject<ComponentName | null> = useRef<ComponentName | null>(null);
    const lastSetHiddenComponentNameRef: MutableRefObject<ComponentName | null> = useRef<ComponentName | null>(null);
    const [displayState, setDisplayState] = useState<DisplayState>({
        mainMenu: false,
        settings: false,
        game: false,
        escapeMenu: false
    });

    /**
     * Returns the React component corresponding to the given component name.
     * @param {ComponentName} componentName - The name of the component to retrieve.
     * @returns {ReactNode | null} The React component, or null if the component name is invalid.
     */
    const getComponent = useCallback((componentName: ComponentName): ReactNode | null => {
        switch (componentName) {
            case 'mainMenu':
                return <MainMenu />;
            case 'settings':
                return <Settings />;
            case 'game':
                return <Game />;
            case 'escapeMenu':
                return <EscapeMenu />;
            default:
                const errorMessage: string = getInvalidComponentMessage(componentName);
                console.error(errorMessage);
                return null;
        }
    }, []);

    /**
     * Displays the specified component.
     * @param {ComponentName} componentName - The name of the component to display.
     * @returns {void}
     */
    const displayComponent = useCallback((componentName: ComponentName): void => {
        // If the component name is not valid, log an error and return early
        if (!isValidComponentName(componentName)) {
            const errorMessage: string = getInvalidComponentMessage(componentName);
            console.error(errorMessage);
            return;
        }

        setDisplayState(prev => {
            // If the component is already displayed, log a debug message and return early
            if (prev[componentName]) {
                const debugMessage: string = getComponentAlreadyDisplayedMessage(componentName);
                console.debug(debugMessage);
                return prev;
            }

            // Else display the component
            lastSetDisplayedComponentNameRef.current = componentName;
            return {
                ...prev,
                [componentName]: true
            };
        });
    }, []);

    /**
     * Hides the specified component.
     * @param {ComponentName} componentName - The name of the component to hide.
     * @returns {void} 
     */
    const hideComponent = useCallback((componentName: ComponentName): void => {
        // If the component name is not valid, log an error and return early
        if (!isValidComponentName(componentName)) {
            const errorMessage: string = getInvalidComponentMessage(componentName);
            console.error(errorMessage);
            return;
        }

        setDisplayState(prev => {
            // If the component is already hidden, log a debug message and return early
            if (!prev[componentName]) {
                const debugMessage: string = getComponentAlreadyHiddenMessage(componentName);
                console.debug(debugMessage);
                return prev;
            }

            // Else hide the component
            lastSetHiddenComponentNameRef.current = componentName;
            return {
                ...prev,
                [componentName]: false
            };
        });
    }, []);
    
    /**
     * Hide all currently displayed components.
     * @param {Set<ComponentName>} exceptComponentsName - (optional) A set of component names to exclude from hiding.
     * @returns {void}
     */
    const hideAllDisplayedComponents = useCallback((exceptComponentsName?: Set<ComponentName>): void => {
        setDisplayState(prev => {
            // Get all currently displayed components
            const displayedComponents = new Set<ComponentName>();
            for (const [componentName, isDisplayed] of Object.entries(prev)) {
                if (isDisplayed) {
                    displayedComponents.add(componentName as ComponentName);
                }
            }

            // If there are no displayed components, return early
            if (displayedComponents.size === 0) {
                return prev;
            }

            // Create new state
            const newState: DisplayState = { ...prev };
            let someComponentWasHidden: boolean = false;

            for (const componentName of displayedComponents) {
                // If the component name is in the list of excepted component names, continue to the next iteration
                if (exceptComponentsName?.has(componentName)) {
                    continue;
                }

                // Hide the component
                newState[componentName] = false;

                someComponentWasHidden = true;
            }
            
            // If no component was hidden, which means all displayed components were in the except list, return early
            if (!someComponentWasHidden) {
                return prev;
            }

            return newState;
        });
    }, []);

    /**
     * Hide the previous displayed component.
     * @returns {void}
     */
    const hideLastSetDisplayedComponent = useCallback((): void => {
        // If the last set displayed component name is not available, log a debug message and return early
        const lastSetDisplayedComponentName: ComponentName | null = lastSetDisplayedComponentNameRef.current;
        if (!lastSetDisplayedComponentName) {
            console.debug(noLastSetComponentDisplayedMessage);
            return;
        }

        hideComponent(lastSetDisplayedComponentName);
    }, [hideComponent]);
    
    /**
     * Display the previous displayed component.
     * @returns {void}
     */
    const displayLastSetDisplayedComponent = useCallback((): void => {
        // If the last set displayed component name is not available, log an error and return early
        const lastSetDisplayedComponentName: ComponentName | null = lastSetDisplayedComponentNameRef.current;
        if (!lastSetDisplayedComponentName) {
            console.error(noLastSetComponentDisplayedMessage);
            return;
        }

        displayComponent(lastSetDisplayedComponentName);
    }, [displayComponent]);

    /**
     * Hides all currently displayed components and displays the new component.
     * @param {ComponentName} componentName - The name of the component to display.
     * @param {Set<ComponentName>} exceptComponentsName - (optional) A set of component names to exclude from hiding.
     * @returns {void}
     */
    const hideCurrentlyDisplayedComponentsAndDisplayNewComponent = useCallback((componentName: ComponentName, exceptComponentsName?: Set<ComponentName>): void => {
        hideAllDisplayedComponents(exceptComponentsName);
        
        // If the component to display is not valid, we display the fallback component instead
        if (!isValidComponentName(componentName)) {
            const errorMessage: string = getInvalidComponentRedirectMessage(componentName);
            console.error(errorMessage);
            displayComponent(fallbackComponentName);
            return;
        }

        displayComponent(componentName);
    }, [displayComponent, hideAllDisplayedComponents]);

    /**
     * Hides the last displayed component and displays the new component.
     * @param {ComponentName} componentName - The name of the component to display.
     * @returns {void}
     */
    const hideLastDisplayedComponentAndDisplayNewComponent = useCallback((componentName: ComponentName): void => {
        hideLastSetDisplayedComponent();
        displayComponent(componentName);
    }, [displayComponent, hideLastSetDisplayedComponent]);

    useEffect(() => {
        // If we have already set the last set displayed component name, return early.
        // This is to prevent displaying the initial component multiple times in strict mode.
        if (lastSetDisplayedComponentNameRef.current) {
            return;
        }

        // If the 'initialComponentName' prop isn't valid, log an error message and display the fallback component.
        if (!isValidComponentName(initialComponentName)) {
            const errorMessage: string = getInvalidComponentRedirectMessage(initialComponentName);
            console.error(errorMessage);
            
            displayComponent(fallbackComponentName);
            return;
        }

        // Display the initial component
        displayComponent(initialComponentName);
        lastSetDisplayedComponentNameRef.current = initialComponentName;
    }, [displayComponent, initialComponentName]);

    return {
        displayComponent,
        hideComponent,
        hideAllDisplayedComponents,
        displayLastSetDisplayedComponent,
        hideLastSetDisplayedComponent,
        displayState,
        getComponent,
        hideCurrentlyDisplayedComponentsAndDisplayNewComponent,
        hideLastDisplayedComponentAndDisplayNewComponent
    };
}

/**
 * Props for the UI Provider.
 * - `children`: All components that are wrapped by the provider.
 * - `initialComponentName` (optional): The name of the component to be displayed initially.
 */
interface UIProviderProps {
    children: ReactNode;
    initialComponentName?: ComponentName;
}

/**
 * UI Provider component to manage and provide UI state and methods.
 * @param {UIProviderProps} props - The props for the UI Provider.
 * @returns {ReactNode} The UI Provider component.
 */
export const UIProvider: FC<UIProviderProps> = ({ 
    children,
    ...rest
}) => {
    const value: UIContextType = useUIProvider(rest);
    return (
        <UIProviderContext.Provider 
            value={value}
        >
            {children}
        </UIProviderContext.Provider>
    );
};