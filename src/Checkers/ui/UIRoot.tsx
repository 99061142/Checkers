import { FC, Fragment, ReactNode, Suspense, useMemo } from 'react';
import LoadingFallback from '../loadingFallback/LoadingFallback.tsx';
import { useUI } from './uiProvider/useUI.ts';
import { ComponentName } from './uiProvider/UIProviderUtils.ts';

/**
 * Type which describes the configuration for a UI component's display state.
 * - componentName: The name of the component.
 * - shouldBeDisplayed: Whether the component should be displayed.
 * - shouldSuspense: Whether the component should be wrapped in a Suspense boundary.
 */
interface UIComponentConfig {
    componentName: ComponentName;
    shouldBeDisplayed: boolean;
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
     * Determines whether the main menu component should be displayed.
     * @returns {boolean} - True if the main menu should be displayed, false otherwise.
     */
    const shouldMainMenuBeDisplayed = useMemo((): boolean => {
        // If the main menu should not be displayed, return false
        if (!displayState.mainMenu) {
            return false;
        }

        return true;
    }, [displayState.mainMenu]);

    /**
     * Determines whether the settings component should be displayed.
     * @returns {boolean} - True if the settings should be displayed, false otherwise.
     */
    const shouldSettingsBeDisplayed = useMemo((): boolean => {
        // If the settings should not be displayed, return false
        if (!displayState.settings) {
            return false;
        }

        return true;
    }, [displayState.settings]);

    /**
     * Determines whether the game component should be displayed.
     * @returns {boolean} - True if the game should be displayed, false otherwise.
     */
    const shouldGameBeDisplayed = useMemo((): boolean => {
        // If the game should not be displayed, return false
        if (!displayState.game) {
            return false;
        }

        return true;
    }, [displayState.game]);

    /**
     * Determines whether the escape menu component should be displayed.
     * @returns {boolean} - True if the escape menu should be displayed, false otherwise.
     */
    const shouldEscapeMenuBeDisplayed = useMemo((): boolean => {
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
            shouldBeDisplayed: shouldMainMenuBeDisplayed,
            shouldSuspense: false
        },
        {
            componentName: "settings",
            shouldBeDisplayed: shouldSettingsBeDisplayed,
            shouldSuspense: true 
        },
        {
            componentName: "game",
            shouldBeDisplayed: shouldGameBeDisplayed,
            shouldSuspense: true
        },
        {
            componentName: "escapeMenu",
            shouldBeDisplayed: shouldEscapeMenuBeDisplayed,
            shouldSuspense: true
        }
    ], [shouldMainMenuBeDisplayed, shouldSettingsBeDisplayed, shouldGameBeDisplayed, shouldEscapeMenuBeDisplayed]);

    return (
        <>
            {components.map(({ componentName, shouldBeDisplayed, shouldSuspense }) => {
                // If the component should not be displayed, return null
                if (!shouldBeDisplayed) {
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