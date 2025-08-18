import { FC, lazy, Suspense, useState } from 'react';
import LoadingFallback from './LoadingFallback.tsx';

// Import for the components that can be toggled.
import MainMenu from './MainMenu.tsx';
const Settings = lazy(() => import('./settings/Settings.tsx'));
const Game = lazy(() => import('./game/Game.tsx'));
const EscapeMenu = lazy(() => import('./EscapeMenu.tsx'));

/**
 * Type representing the names of the components that can be toggled.
 */
export type ComponentName = 'mainMenu' | 'settings' | 'game' | 'escapeMenu';

/**
 * Interface for the component names state.
 * - `current`: The name of the currently active component.
 * - `previous`: The name of the previously active component, or null if there is none.
 */
interface ComponentNames {
    current: ComponentName;
    previous: ComponentName | null;
}

const Window: FC = () => {
    const [componentNames, setcomponentNames] = useState<ComponentNames>({
        current: 'mainMenu',
        previous: null
    });

    // Map of components to their respective (lazy-loaded) components.
    const componentsMap: Record<ComponentName, () => React.ReactNode> = {
        mainMenu: () => <MainMenu
            toggleComponent={toggleComponent} 
        />,
        settings: () => <Settings
            togglePreviousComponent={togglePreviousComponent} 
        />,
        game: () => <Game
            toggleComponent={toggleComponent}
        />,
        escapeMenu: () => <EscapeMenu
            toggleComponent={toggleComponent} 
        />
    };

    /**
     * Generates an error message for an invalid component name.
     * @param {ComponentName} componentName - The name of the component that is invalid.
     * @returns {string} - The error message indicating the invalid component name and available options.
     */
    const faultyComponentNameErrorMessage = (componentName: ComponentName): string => {
        let errorMessage = `The component name "${componentName}" isn't one of the possible component names. Please ensure that the component name is one of the following options: \n`;

        for (const availableComponentName of Object.keys(componentsMap)) {
            errorMessage += `\n- ${availableComponentName}`;
        }

        return errorMessage;
    }

    /**
     * Toggles the current component to the specified component name.
     * * If the component name is the same as the current one, it logs an error.
     * * If the component name is invalid, it logs an error with the available options.
     * @param {ComponentName} componentName - The name of the component to toggle to.
     * @returns {void}
     */
    const toggleComponent = (componentName: ComponentName): void => {
        if (componentName === componentNames.current) {
            console.error(`The component "${componentName}" is already the current component. No need to toggle it. Please ensure that we are not trying to toggle to the same component before calling this function.`);
            return;
        }

        setcomponentNames(prev => ({
            current: componentName,
            previous: prev.current
        }));
    };

    /**
     * Toggles the current component to the previous component.
     * * If there is no previous component, it logs an error.
     * @returns {void}
     */
    const togglePreviousComponent = (): void => {
        if (componentNames.previous === null) {
            console.error('There is no previous component to load. Please ensure that we have a previous component to toggle to before calling this function.');
            return;
        }

        setcomponentNames(prev => ({
            current: prev.previous as ComponentName,
            previous: prev.current
        }));
    }

    /**
     * Returns the current component as a React node based on the current component name.
     * * If the current component name is invalid, it returns the main menu as fallback, and logs an error.
     * @returns {React.ReactNode} The current component to be rendered.
     */
    const getCurrentComponent = (): React.ReactNode => {
        const currentComponentName = componentNames.current;
        const currentComponent = componentsMap[currentComponentName];

        if (!currentComponent) {
            const errorMessage = faultyComponentNameErrorMessage(currentComponentName) + '\n\nThe main menu will be shown as fallback.';
            console.error(errorMessage);
            
            setcomponentNames({
                previous: null,
                current: 'mainMenu'
            });

            return componentsMap.mainMenu();
        }

        return currentComponent();
    }

    return (
        <Suspense 
            fallback={<LoadingFallback />}
        >
            {getCurrentComponent()}
        </Suspense>
    );
}

export default Window;