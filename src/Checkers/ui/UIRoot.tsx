import { FC, Fragment, ReactNode, Suspense, useMemo } from 'react';
import LoadingFallback from '../loadingFallback/LoadingFallback.tsx';
import { useUI } from './uiProvider/useUI.ts';
import { ComponentName } from './uiProvider/UIProviderUtils.ts';

/**
 * Type which describes the configuration for a UI component's display state.
 * - componentName: The name of the component.
 * - shouldShow: Whether the component should be displayed.
 * - shouldSuspense: Whether the component should be wrapped in a Suspense boundary.
 */
interface UIComponentConfig {
    componentName: ComponentName;
    shouldShow: boolean;
    shouldSuspense: boolean;
}

/**
 * Type representing a list of UI component display configurations.
 */
type UIComponentsConfig = UIComponentConfig[];

const UIRoot: FC = () => {
    const {
        displayState,
        getComponent
    } = useUI();
    
    /**
     * Determines whether to show the main menu component.
     * @returns {boolean} - True if the main menu should be displayed, false otherwise.
     */
    const shouldShowMainMenu = useMemo((): boolean => {
        // If the main menu should not be displayed, return false
        if (!displayState.mainMenu) {
            return false;
        }

        return true;
    }, [displayState.mainMenu]);

    /**
     * Determines whether to show the settings component.
     * @returns {boolean} - True if the settings should be displayed, false otherwise.
     */
    const shouldShowSettings = useMemo((): boolean => {
        // If the settings should not be displayed, return false
        if (!displayState.settings) {
            return false;
        }

        return true;
    }, [displayState.settings]);

    /**
     * Determines whether to show the game component.
     * @returns {boolean} - True if the game should be displayed, false otherwise.
     */
    const shouldShowGame = useMemo((): boolean => {
        // If the game should not be displayed, return false
        if (!displayState.game) {
            return false;
        }

        return true;
    }, [displayState.game]);

    /**
     * Determines whether to show the escape menu component.
     * @returns {boolean} - True if the escape menu should be displayed, false otherwise.
     */
    const shouldShowEscapeMenu = useMemo((): boolean => {
        // If the escape menu should not be displayed, return false
        if (!displayState.escapeMenu) {
            return false;
        }

        return true;
    }, [displayState.escapeMenu]);

    /**
     * Array of components with their display and suspense states.
     */
    const components: UIComponentsConfig = useMemo(() => [
        {
            componentName: "mainMenu",
            shouldShow: shouldShowMainMenu,
            shouldSuspense: false
        },
        {
            componentName: "settings",
            shouldShow: shouldShowSettings,
            shouldSuspense: true 
        },
        {
            componentName: "game",
            shouldShow: shouldShowGame,
            shouldSuspense: true
        },
        {
            componentName: "escapeMenu",
            shouldShow: shouldShowEscapeMenu,
            shouldSuspense: true
        }
    ], [shouldShowMainMenu, shouldShowSettings, shouldShowGame, shouldShowEscapeMenu]);

    return (
        <>
            {components.map(({ componentName, shouldShow, shouldSuspense }) => {
                // If the component should not be shown, return null
                if (!shouldShow) {
                    return null;
                }
                
                // Else, show the component
                const component: ReactNode = getComponent(componentName);
                return shouldSuspense ? (
                    <Suspense
                        key={componentName} 
                        fallback={<LoadingFallback />}
                    >
                        {component}
                    </Suspense>
                ) : (
                    <Fragment
                        key={componentName}
                    >
                        {component}
                    </Fragment>
                );
            })}
        </>
    );
}

export default UIRoot;