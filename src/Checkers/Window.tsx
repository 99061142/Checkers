import { Component, lazy, Suspense, ComponentType } from 'react';
import { gameDataPresent } from './game/gameData.ts';
import LoadingFallback from './LoadingFallback.tsx';
import MainMenu from './MainMenu.tsx';
const Settings = lazy(() => import('./settings/Settings.tsx'));
const Game = lazy(() => import('./game/Game.tsx'));
const EscapeMenu = lazy(() => import('./EscapeMenu.tsx'));

/**
 * Props for the Window component.
 * - No props expected
 */
interface WindowProps {}

/**
 * The state of the Window component.
 * - currentComponentName: The current component to be rendered.
 * - previousComponentName: The previous component that was shown, or null if there is no previous component.
 * - gameDataPresent: A boolean value indicating whether the game data is present in the local storage.
 */
interface WindowState {
    currentComponentName: string;
    previousComponentName: string | null;
    gameDataPresent: boolean;
}

class Window extends Component<WindowProps, WindowState> {
    // Map of component names and their corresponding components
    windowComponentsMap = {
        mainMenu: MainMenu,
        settings: Settings,
        game: Game,
        escapeMenu: EscapeMenu
    } as Record<string, ComponentType<any>>;

    // List of available component names, derived from the keys of windowComponentsMap
    availableWindowComponentNames = Object.keys(this.windowComponentsMap);

    // Set of available form names for quick validation
    availableWindowComponentNamesSet = new Set(this.availableWindowComponentNames);

    constructor(props: WindowProps) {
        super(props);
        this.state = {
            currentComponentName: "game",
            previousComponentName: null,
            gameDataPresent: gameDataPresent()
        };
    }

    /**
     * Mark whether the game data is present or not
     * @param {boolean} flag - A boolean value indicating whether the game data is present or not
     * @return {void}
     */
    setGameDataPresent = (flag: boolean): void => {
        this.setState({
            gameDataPresent: flag
        });
    }

    /**
     * Sets the current component to the provided component name,
     * and sets the previous component to the current component.
     * @param {string} componentName - The name of the new component to be set as the current component
     */
    set currentComponentName(componentName: string) {
        this.setState(prevState => ({
            currentComponentName: componentName,
            previousComponentName: prevState.currentComponentName
        }));
    }

    /**
     * Sets the current component to the provided component name,
     * and sets the previous component to the current component.
     * @param {string} componentName - The name of the new component to be set as the current component
     * @throws {TypeError} - If the provided component name is not a string
     * @throws {RangeError} - If the provided component name is not a valid component name
     *
     * - Logs an error and stop the execution if the provided component name is the same as the current component name.
     * @return {void}
     */
    toggleComponent = (componentName: string): void => {
        // If the provided component name is not a string, throw an error
        if (typeof componentName !== 'string') {
            throw new TypeError(`Invalid component name: '${componentName}'. Expected a string.`);
        }

        // If the provided component name is the same as the current component name, log an error and return
        if (componentName === this.state.currentComponentName) {
            console.debug(`Error: Tried to switch to the same component: ${componentName}.`);
            return
        }

        // If the provided component name is not a valid component name, throw an error
        if (!this.availableWindowComponentNamesSet.has(componentName)) {
            const availableFormNamesStr = this.availableWindowComponentNames.map(name => `'${name}'`).join(', ');
            throw new RangeError(`Invalid component name. Valid component names are: ${availableFormNamesStr}.`);
        }

        // Set the current component to the provided component name,
        // and set the previous component to the current component
        this.currentComponentName = componentName;
    }

    /**
     * Load the previous component that was shown.
     * - If the previous component is null, log an error and stop execution.
     * - If the previous component is the same as the current component, log an error and stop execution.
     * @return {void}
     */
    loadPreviousComponent = (): void => {
        // If the previous component is null, log an error and return
        if (this.state.previousComponentName === null) {
            console.error('Error: Tried to switch to the previous component, but the previous component is null.');
            return
        }
        
        // If the previous component is the same as the current component, log an error and return
        if (this.state.previousComponentName === this.state.currentComponentName) {
            console.error(`Error: Tried to switch to the previous component, but the previous component is the same as the current component: ${this.state.previousComponentName}.`);
            return
        }

        // Set the current component to the previous component that was shown, 
        // and set the previous component to the current component
        this.currentComponentName = this.state.previousComponentName;
    }

    /**
     * Returns the component to be rendered based on the current component name.
     * - If the current component name is not valid, it will return null.
     * @return {React.JSX.Element | null} - The component to be rendered, or null if the component is not found.
     */
    get windowComponent(): React.JSX.Element | null {
        // Get the component to be rendered based on the current component name
        const ComponentToRender = this.windowComponentsMap[this.state.currentComponentName];

        // If the component is not found with the current component name, return null
        // This never happens, since we will throw an error when trying to set an invalid component name,
        // but we keep this check for safety
        if (!ComponentToRender) {
            return null
        }

        switch (this.state.currentComponentName) {
            case "mainMenu":
                return <MainMenu
                    toggleComponent={this.toggleComponent}
                    gameDataPresent={this.state.gameDataPresent}
                    setGameDataPresent={this.setGameDataPresent}
                />
            case "settings":
                return <Settings
                    gameDataPresent={this.state.gameDataPresent}
                    loadPreviousComponent={this.loadPreviousComponent}
                />
            case "game":
                return <Game
                    gameDataPresent={this.state.gameDataPresent}
                    setGameDataPresent={this.setGameDataPresent}
                    toggleComponent={this.toggleComponent}
                />
            case "escapeMenu":
                return <EscapeMenu
                    toggleComponent={this.toggleComponent}
                />
            default:
                return null
        }
    }

    render() {
        return (
            <Suspense 
                fallback={<LoadingFallback />}
            >
                {this.windowComponent}
            </Suspense>
        );
    }
}

export default Window;