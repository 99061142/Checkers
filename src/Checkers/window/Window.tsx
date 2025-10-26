import { FC, lazy, Suspense, useState, ReactNode } from 'react';
import LoadingFallback from '../loadingFallback/LoadingFallback.tsx';

// Import for the components that can be toggled.
import MainMenu from '../mainMenu/MainMenu.tsx';
const Settings = lazy(() => import('../settings/Settings.tsx'));
const Game = lazy(() => import('../game/Game.tsx'));
const EscapeMenu = lazy(() => import('../escapeMenu/EscapeMenu.tsx'));

/**
 * An array of valid component names which holds the names of all components that can be toggled in the Window component.
 */
const validComponentNamesArray = [
    'mainMenu', 
    'settings', 
    'game', 
    'escapeMenu'
] as const;

/**
 * Type representing the names of the components that can be toggled.
 */
export type ComponentName = typeof validComponentNamesArray[number];

/**
 * A set of valid component names which holds the names of all components that can be toggled in the Window component.
 * This is also used for O(1) lookup validation of component names.
 */
export const validComponentNamesSet: ReadonlySet<ComponentName> = new Set(validComponentNamesArray);

/**
 * Interface for the component names state.
 * - `current`: The name of the currently active component.
 * - `previous`: The name of the previously active component, or null if there is none.
 */
interface ComponentNames {
    current: ComponentName;
    previous: ComponentName | null;
}

/**
 * Props for the Window component.
 * - `currentComponentName` (optional): The name of the component to be displayed initially.
 */
interface WindowProps {
    initialComponentName?: ComponentName;
}

/**
 * Generates an error message for an invalid component name.
 * @param {ComponentName} componentName - The name of the component that is invalid.
 * @returns {string} - The error message indicating the invalid component name and available options.
 */
export const faultyComponentNameErrorMessage = (componentName: ComponentName): string => {
    const availableComponentNameOptions = Array.from(validComponentNamesSet)
        .map(componentName => `\n- ${componentName}`) // Format each option on a new line with a dash before the component name.
        .join(''); // Remove the commas between the options.

    let errorMessage = `The component name "${componentName}" isn't one of the possible component names. Please ensure that the component name is one of the following options:\n${availableComponentNameOptions}\n\nYou will be redirected to the main menu as fallback.`;
    return errorMessage;
}

const Window: FC<WindowProps> = (props) => {
    const {
        initialComponentName
    } = props;

    const [componentNames, setcomponentNames] = useState<ComponentNames>({
        current: initialComponentName || 'mainMenu',
        previous: null
    });

    /**
     * Toggles the current component to the specified component name.
     * * If the component name is the same as the current one, it logs an error, and does nothing. (Since toggling to the same component is unnecessary.)
     * * If the component name is invalid, it will be handled in the `getCurrentComponent` function when rendering. Which will log an error and set the current component to the main menu as fallback.
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
     * * If there is no previous component, it logs an error, and does nothing. (Since there is no previous component to toggle to.)
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
     * Map of component names to their respective components.
     */
    const componentsMap: Record<ComponentName, () => ReactNode> = {
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
     * Returns the current component as a React node based on the current component name.
     * * If the current component name is invalid, it returns the main menu as fallback, and logs an error.
     * @returns {ReactNode} The current component to be rendered.
     */
    const getCurrentComponent = (): ReactNode => {
        const currentComponentName = componentNames.current;

        if (!validComponentNamesSet.has(currentComponentName)) {
            const errorMessage = faultyComponentNameErrorMessage(currentComponentName);
            console.error(errorMessage);

            setcomponentNames({
                current: 'mainMenu',
                previous: null
            });
            return componentsMap.mainMenu();
        }
        
        const currentComponent = componentsMap[currentComponentName];
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