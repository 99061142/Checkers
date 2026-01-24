import { FC, ReactNode, useState, useCallback, lazy, useMemo, useEffect, MutableRefObject, useRef, memo } from 'react';
import { ComponentName, fallbackComponentName, fallbackComponentNameNotValidMessage, getInvalidComponentRedirectMessage, isValidComponentName, noPreviousComponentToGoBackToMessage, ComponentsConfig, ComponentConfig, noComponentsAvailableToDisplayErrorMessage, getInvalidComponentMessage, componentIsNotSpecifiedRoleErrorMessage, ComponentUIRole, componentIsNotOneOfSpecifiedRolesErrorMessage, missingConfigForComponentErrorMessage, ComponentUIType, missingConfigPropertyForComponentErrorMesage, getEmptyComponentsHistoryRedirectMessage } from './UIProviderUtils.ts';
import { UIProviderContext, UIContextType } from './UIContext.tsx';

// Import props for the lazy loaded components.
// If the component is not lazy loaded, import the props along with the component
import { GameProps } from '../../game/Game.tsx';
import { SettingsProps } from '../../settings/Settings.tsx';
import { EscapeMenuProps } from '../../escapeMenu/EscapeMenu.tsx';

// Import for the components and non-lazy loaded component props
import MainMenu, { MainMenuProps } from '../../mainMenu/MainMenu.tsx';
const Settings = lazy(() => import('../../settings/Settings.tsx'));
const Game = lazy(() => import('../../game/Game.tsx'));
const EscapeMenu = lazy(() => import('../../escapeMenu/EscapeMenu.tsx'));

/**
 * Props for the useUIProvider hook.
 * - `initialComponentHistory` (optional): The initial history of components to be displayed. Defaults to an array containing only the fallback component name.
 */
interface UseUIProviderProps {
    initialComponentHistory?: ComponentName[];
}

/**
 * Custom hook to manage the UI state.
 * @param {UIProviderProps} initialComponentHistory - The initial history of components to be displayed. Defaults to an array containing only the fallback component name.
 */
const useUIProvider = ({ 
    initialComponentHistory = [fallbackComponentName]
}: UseUIProviderProps) => {
    // If the fallback component name is not valid, throw an error.
    // This is done even when the initial component name is provided, to ensure that the fallback is always valid
    if (!isValidComponentName(fallbackComponentName)) {
        throw new RangeError(fallbackComponentNameNotValidMessage);
    }
    
    /**
     * Ref to track if the UIProvider has been initialized
     */
    const isInitializedRef: MutableRefObject<boolean> = useRef<boolean>(false);

    /**
     * State to track the history of displayed components.
     * ! This state would be initialized in one of the useEffect hooks within the UIProvider
     */
    const [displayedComponentsHistory, setDisplayedComponentsHistory] = useState<ComponentName[]>([]);

    /**
     * Configuration for all components that can be displayed.
     */
    const componentsConfig: ComponentsConfig = useMemo(() => {
        /**
         * Creates a component configuration with the specified parameters.
         * 
         * This creates a memoized component with default props bound, but also accepts
         * additional props that get merged with the defaults, allowing flexible reuse
         * @param {ComponentConfig} args - The parameters for the component configuration. 
         * @returns {ComponentConfig} The component configuration.
         */
        const createComponentConfig = <TProps extends Record<string, any>>(
            args: ComponentConfig<TProps>
        ): ComponentConfig<TProps> => {
            const { 
                Component, 
                displayName, 
                props: defaultProps 
            } = args;

            // Create a memoized component that accepts additional props
            // These get merged with the default props from the config
            const MemoizedComponent = memo<Partial<TProps>>((additionalProps = {}) => (
                <Component
                    {...(defaultProps as TProps)}
                    {...additionalProps}
                />
            ));

            // Set the display name on the memoized component itself.
            // This way, we don't need to use the 'name' property separately elsewhere
            MemoizedComponent.displayName = displayName;

            return {
                ...args,
                Component: MemoizedComponent
            };
        };

        return {
            'mainMenu': createComponentConfig<MainMenuProps>({
                Component: MainMenu,
                type: "fullscreen",
                role: "root",
                shouldSuspense: false,
                props: {},
                displayName: 'Main-Menu'
            }),
            'settings': createComponentConfig<SettingsProps>({
                Component: Settings,
                type: "fullscreen",
                role: "modal",
                shouldSuspense: true,
                props: {},
                displayName: 'Settings'
            }),
            'game': createComponentConfig<GameProps>({
                Component: Game,
                type: "fullscreen",
                role: "root",
                shouldSuspense: true,
                props: {},
                displayName: 'Game'
            }),
            'escapeMenu': createComponentConfig<EscapeMenuProps>({
                Component: EscapeMenu,
                type: "overlay",
                role: "overlay",
                shouldSuspense: true,
                props: {},
                displayName: 'Escape-Menu'
            })
        };
    }, []);

    /**
     * Gets the component configuration for the specified component name.
     * @param {ComponentName} componentName - The name of the component.
     * @returns {ComponentConfig<any> | null} The component configuration, or null if the component name is invalid.
     */
    const getComponentConfig = useCallback((componentName: ComponentName): ComponentConfig<any> | null => {
        // If the component name is not valid, log an error and return null
        if (!isValidComponentName(componentName)) {
            const errorMessage: string = getInvalidComponentMessage(componentName);
            console.error(errorMessage);
            return null;
        }

        const componentConfig: ComponentConfig<any> = componentsConfig[componentName];
        return componentConfig;
    }, [componentsConfig]);

    /**
     * Gets the role of the specified component.
     * @param {ComponentName} componentName - The name of the component.
     * @returns {ComponentUIRole | null} The role of the component, or null if the component name is invalid or the component configuration is missing.
     */
    const getComponentRole = useCallback((componentName: ComponentName): ComponentUIRole | null => {
        const componentConfig: ComponentConfig<any> | null = getComponentConfig(componentName);
        
        // If there is no configuration for the component, log an error and return null
        if (!componentConfig) {
            const errorMessage: string = missingConfigForComponentErrorMessage(componentName);
            console.error(errorMessage);
            return null;
        }

        const { role } = componentConfig;

        // If the role is not specified, log an error and return null
        if (!role) {
            const errorMessage: string = missingConfigPropertyForComponentErrorMesage(componentName, "role");
            console.error(errorMessage);
            return null;
        }

        return role;
    }, [getComponentConfig]);

    /**
     * Gets the type of the specified component.
     * @param {ComponentName} componentName - The name of the component.
     * @returns {ComponentUIType | null} The type of the component, or null if the component name is invalid or the component configuration is missing.
     */
    const getComponentType = useCallback((componentName: ComponentName): ComponentUIType | null => {
        const componentConfig: ComponentConfig<any> | null = getComponentConfig(componentName);
        
        // If there is no configuration for the component, log an error and return null
        if (!componentConfig) {
            const errorMessage: string = missingConfigForComponentErrorMessage(componentName);
            console.error(errorMessage);
            return null;
        }

        const { type } = componentConfig;
        
        // If the type property is missing, log an error and return null
        if (!type) {
            const errorMessage: string = missingConfigPropertyForComponentErrorMesage(componentName, "type");
            console.error(errorMessage);
            return null;
        }

        return type;
    }, [getComponentConfig]);

    /**
     * Sets the displayed components history to only include the specified component as the root.
     * @param {ComponentName} componentName - The name of the component to be set as the root.
     * @returns {void}
     */
    const showAsRoot = useCallback((componentName: ComponentName): void => {
        // If the component name is not valid, log an error and return
        if (!isValidComponentName(componentName)) {
            const errorMessage: string = getInvalidComponentMessage(componentName);
            console.error(errorMessage);
            return;
        }

        // If the component role is not "root", log an error and return
        const componentRole: ComponentUIRole | null = getComponentRole(componentName);
        const wantedRole: ComponentUIRole = "root";
        if (componentRole !== wantedRole) {
            const errorMessage: string = componentIsNotSpecifiedRoleErrorMessage(componentName, wantedRole);
            console.error(errorMessage);

            // If there are currently no components in the history, set the history to the fallback component
            setDisplayedComponentsHistory((prevHistory) => {
                if (!prevHistory.length) {
                    return [fallbackComponentName];
                }
                return prevHistory;
            });

            return;
        }

        setDisplayedComponentsHistory([componentName]);
    }, [getComponentRole]);

    /**
     * Pushes a component to the displayed components history.
     * @param {ComponentName} componentName - The name of the component to be pushed to the history.
     * @returns {void}
     */
    const pushComponentToHistory = useCallback((componentName: ComponentName) => {        
        // If the component name is not valid, log an error and return
        if (!isValidComponentName(componentName)) {
            const errorMessage: string = getInvalidComponentMessage(componentName);
            console.error(errorMessage);
            return;
        }


        // If the component role is not one of the allowed roles, log an error and return
        const componentRole: ComponentUIRole | null = getComponentRole(componentName);
        const allowedRoles: ComponentUIRole[] = [
            "modal", 
            "overlay"
        ];
        if (
            !componentRole ||
            !allowedRoles.includes(componentRole)
        ) {
            const errorMessage: string = componentIsNotOneOfSpecifiedRolesErrorMessage(componentName, allowedRoles);
            console.error(errorMessage);
            return;
        }

        setDisplayedComponentsHistory((prevComponentsHistory) => [
            ...prevComponentsHistory,
            componentName
        ]);
    }, [getComponentRole]);

    /**
     * Removes the last component that was added to the displayed components history.
     * @returns {void}
     */
    const goBack = useCallback(() => {
        setDisplayedComponentsHistory((prevComponentsHistory) => {
            // If there is only one component in the history, we cannot go back.
            // If that is the case, log an error and return the current history without changes.
            if (prevComponentsHistory.length <= 1) {
                console.error(noPreviousComponentToGoBackToMessage);
                return prevComponentsHistory;
            }

            return prevComponentsHistory.slice(0, -1);
        });
    }, []);

    /**
     * Navigates to the specified component.
     * @param {ComponentName} componentName - The name of the component to navigate to.
     * @returns {void}
     */
    const navigateTo = useCallback((componentName: ComponentName) => {
        pushComponentToHistory(componentName);
    }, [pushComponentToHistory]);

    /**
     * Opens the specified component.
     * @param {ComponentName} componentName - The name of the component to open.
     * @returns {void}
     */
    const openOverlay = useCallback((componentName: ComponentName) => {
        // If the component role is not "overlay", log a debug error for future proofing.
        //! This is since we currently use the same logic to navigate to a component that isn't necessarily an overlay
        const componentRole: ComponentUIRole | null = getComponentRole(componentName);
        const wantedRole: ComponentUIRole = "overlay";
        if (componentRole !== wantedRole) {
            const errorMessage: string = componentIsNotSpecifiedRoleErrorMessage(componentName, wantedRole);
            console.debug(errorMessage);
        }

        pushComponentToHistory(componentName);
    }, [pushComponentToHistory, getComponentRole]);

    /**
     * Gets the configurations of the currently displayed components.
     * @returns {ComponentConfig<any>[]} The configurations of the currently displayed components.
     */
    const getCurrentDisplayedComponentsConfig = useCallback((): ComponentConfig<any>[] => {
        const componentsToDisplay: ComponentConfig<any>[] = [];
        
        // If the UIProvider is not yet initialized, return early.
        // This is needed because we initialize the displayed components history in a useEffect hook,
        // which means that on the first render, the history is still empty, 
        // which is never allowed
        if (!isInitializedRef.current) {
            return componentsToDisplay;
        }

        const displayedComponentsHistoryLength: number = displayedComponentsHistory.length;
        
        // If there are no components in the history, and we are initialized, throw an error.
        // This should never happen, since we always want at least one component to be displayed
        if (!displayedComponentsHistoryLength) {
            throw new Error(noComponentsAvailableToDisplayErrorMessage);
        }
        
        // Loop through the displayed components history in reverse order to get the components to display.
        //! This is because there can only be one component with type "fullscreen" in the list of components which we want to display
        for (let i = displayedComponentsHistoryLength - 1; i >= 0; i--) {
            const componentName: ComponentName = displayedComponentsHistory[i];
            const componentConfig: ComponentConfig<any> | null = getComponentConfig(componentName)

            // If there is no configuration for the component, log an error and continue to the next component
            if (!componentConfig) {
                const errorMessage: string = missingConfigForComponentErrorMessage(componentName);
                console.error(errorMessage);
                continue;
            }

            // Add the component to the list of components to display
            componentsToDisplay.push(componentConfig);
            
            // If the component config type is "fullscreen", we stop adding more components.
            // This is because there can only be one fullscreen component displayed at a time
            const type: ComponentUIType | null = getComponentType(componentName)
            if (type === "fullscreen") {
                break;
            }
        }

        return componentsToDisplay;
    }, [displayedComponentsHistory, getComponentConfig, getComponentType]);

    /**
     * Opens the specified component as the root component.
     * @param {ComponentName} componentName - The name of the component to open as the root.
     * @returns {void}
     */
    const openRoot = useCallback((componentName: ComponentName) => {
        showAsRoot(componentName);
    }, [showAsRoot]);

    useEffect(() => {
        if (isInitializedRef.current) {
            return;
        }

        isInitializedRef.current = true;

        // Validate that initialComponentHistory is an array and has at least one component
        if (!Array.isArray(initialComponentHistory) || initialComponentHistory.length === 0) {
            console.error(getEmptyComponentsHistoryRedirectMessage);
            setDisplayedComponentsHistory([fallbackComponentName]);
            return;
        }

        // Validate all component names in the initial history
        for (const componentName of initialComponentHistory) {
            if (!isValidComponentName(componentName)) {
                const errorMessage: string = getInvalidComponentRedirectMessage(componentName);
                console.error(errorMessage);
                setDisplayedComponentsHistory([fallbackComponentName]);
                return;
            }
        }
        
        // We don't use the showAsRoot method directly here to avoid unnecessary console logging.
        // This is since we allow the initial component to be of any role if it is valid
        setDisplayedComponentsHistory(initialComponentHistory);
    }, [initialComponentHistory]);

    return {
        getCurrentDisplayedComponentsConfig,
        navigateTo,
        openOverlay,
        openRoot,
        goBack
    };
}

/**
 * Props for the UI Provider.
 * - `children`: All components that are wrapped by the provider.
 * - `initialComponentHistory` (optional): The initial history of components to be displayed.
 */
interface UIProviderProps {
    children: ReactNode;
    initialComponentHistory?: ComponentName[];
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