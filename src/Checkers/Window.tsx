import { Component, lazy, Suspense } from 'react';
import { gameDataPresent } from './game/gameData.ts';
import LoadingFallback from './LoadingFallback.jsx';
import MainMenu from './MainMenu.tsx';
const Settings = lazy(() => import('./settings/Settings.tsx'));
const Game = lazy(() => import('./game/Game.jsx'));
const EscapeMenu = lazy(() => import('./EscapeMenu.tsx'));

interface WindowProps {}; // No props expected for the Window component
type PreviousComponentName = string | null; // The previous component that was shown, or null if there is no previous component

/**
 * The state of the Window component.
 * - currentComponentName: The current component to be rendered.
 * - previousComponentName: The previous component that was shown, or null if there is no previous component.
 * - gameDataPresent: A boolean value indicating whether the game data is present in the local storage.
 */
interface WindowState {
    currentComponentName: string;
    previousComponentName: PreviousComponentName;
    gameDataPresent: boolean;
}

class Window extends Component<WindowProps, WindowState> {
    validComponentNamesSet = new Set([
        "MainMenu",
        "Settings",
        "Game",
        "EscapeMenu"
    ]);
    validComponentNamesStr = Array.from(this.validComponentNamesSet).map(name => `'${name}'`).join(', ');

    constructor(props: WindowProps) {
        super(props);
        this.state = {
            currentComponentName: "MainMenu",
            previousComponentName: null,
            gameDataPresent: gameDataPresent()
        };
    }

    /**
     * Mark whether the game data is present or not
     * @param {boolean} flag - A boolean value indicating whether the game data is present or not
     * @return {void}
     */
    markGameDataPresent = (flag: boolean): void => {
        this.setState({
            gameDataPresent: flag
        });
    }

    /**
     * Returns a boolean value indicating whether the game data is present or not
     * @return {boolean} - A boolean value indicating whether the game data is present or not
     */
    get gameDataPresent(): boolean {
        const gameDataPresent = this.state.gameDataPresent;
        return gameDataPresent
    }

    /**
     * Returns the name of the previous component that was shown
     * @return {PreviousComponentName} - The name of the previous component that was shown, or null if there is no previous component
     */
    get previousComponentName(): PreviousComponentName {
        const previousComponentName = this.state.previousComponentName;
        return previousComponentName
    }

    /**
     * Returns the name of the current component that is being rendered
     * @return {string} - The name of the current component that is being rendered
     */
    get currentComponentName(): string {
        // Return a string of the name of the current component
        const currentComponentName = this.state.currentComponentName;
        return currentComponentName
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
        if (componentName === this.currentComponentName) {
            console.debug(`Error: Tried to switch to the same component: ${componentName}.`);
            return
        }

        // If the provided component name is not a valid component name, throw an error
        if (!this.validComponentNamesSet.has(componentName)) {
            throw new RangeError(`Invalid component name: '${componentName}'. Valid component names are: ${this.validComponentNamesStr}.`);
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
        if (this.previousComponentName === null) {
            console.error('Error: Tried to switch to the previous component, but the previous component is null.');
            return
        }
        
        // If the previous component is the same as the current component, log an error and return
        if (this.previousComponentName === this.currentComponentName) {
            console.error(`Error: Tried to switch to the previous component, but the previous component is the same as the current component: ${this.previousComponentName}.`);
            return
        }

        // Set the current component to the previous component that was shown, 
        // and set the previous component to the current component
        this.currentComponentName = this.previousComponentName;
    }

    render() {
        return (
            <Suspense 
                fallback={<LoadingFallback />}
            >
                {(() => {
                    switch (this.currentComponentName) {
                        case "MainMenu":
                            return <MainMenu
                                toggleComponent={this.toggleComponent}
                                gameDataPresent={this.gameDataPresent}
                                markGameDataPresent={this.markGameDataPresent}
                            />
                        case "Settings":
                            return <Settings
                                gameDataPresent={this.gameDataPresent}
                                loadPreviousComponent={this.loadPreviousComponent}
                            />
                        case "Game":
                            return <Game
                                gameDataPresent={this.gameDataPresent}
                                getGameDataPresent={this.gameDataPresent}
                                toggleComponent={this.toggleComponent}
                            />
                        case "EscapeMenu":
                            return <EscapeMenu
                                toggleComponent={this.toggleComponent}
                            />
                        default:
                            throw new RangeError(`Invalid component name: '${this.currentComponentName}'. Valid component names are: ${this.validComponentNamesStr}.`);
                    }
                })()}
            </Suspense>
        );
    }
}

export default Window;