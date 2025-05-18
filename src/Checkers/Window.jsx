import { Component, lazy, Suspense } from 'react';

// Import to check if the last game data is present in the local storage
// This is used to check if the game was finished or not, and if the game could be loaded, if settings could be changed, etc.
// The bool of this function which would be returned is set as a state in the Window component,
// And is passed to the components that need to check if the game data is present or not
import { getAllGameDataPresent } from './game/gameData';

// All components that could be rendered
import LoadingFallback from './LoadingFallback';
import MainMenu from './MainMenu';
const Settings = lazy(() => import('./settings/Settings'));
const Game = lazy(() => import('./game/Game'));
const EscapeMenu = lazy(() => import('./EscapeMenu'));

class Window extends Component {
    constructor() {
        super();
        this.state = {
            currentComponentStr: "MainMenu", // This is used to check which component is shown
            previousComponentStr: null, // This is used to check which component was shown before the current component
            gameDataPresent: getAllGameDataPresent() // This is used to check if there is game data present in the local storage
        };
    }

    setGameDataPresent = (bool) => {
        // Set the game data present state
        this.setState({
            gameDataPresent: bool
        });
    }

    get gameDataPresent() {
        // Return if the game data is present
        const gameDataPresent = this.state.gameDataPresent;
        return gameDataPresent
    }

    get previousComponentStr() {
        // Return a string of the name of the previous component
        const previousComponentStr = this.state.previousComponentStr;
        return previousComponentStr;
    }

    get currentComponentStr() {
        // Return a string of the name of the current component
        const currentComponentStr = this.state.currentComponentStr;
        return currentComponentStr;
    }

    setComponentStr = (newComponentStr) => {
        // Set the current component to the new component
        this.setState(prevState => ({
            currentComponentStr: newComponentStr,
            previousComponentStr: prevState.currentComponentStr
        }));
    }

    toggleComponent = (newComponentStr) => {
        // If the new component is the same as the current component, log an error and return
        // This is used to report if the user is trying to switch to the same component, which should not be possible
        if (newComponentStr === this.currentComponentStr) {
            console.error(`Error: Tried to switch to the same component: ${newComponentStr}.`);
            return
        }

        // If the new component isn't the same as the current component, 
        // Set the current component to the new component, and set the previous component to the current component.
        // This is used to show the component the user wants to see, and to save the previous shown component when needed,
        // e.g. when the user needs to redirect to the previous component
        this.setComponentStr(newComponentStr);
    }

    loadPreviousComponent = () => {
        // If the previous component is null, log an error and return
        // This is used to report if the user is trying to switch to a component that doesn't exist
        if (this.previousComponentStr === null) {
            console.error('Error: Tried to switch to the previous component, but the previous component is null.');
            return
        }
        
        // If the previous component is the same as the current component, log an error and return
        // This is used to report if the user is trying to switch to the same component which should not be possible
        if (this.previousComponentStr === this.currentComponentStr) {
            console.error(`Error: Tried to switch to the previous component, but the previous component is the same as the current component: ${this.previousComponentStr}.`);
            return
        }

        // Set the component to the previous component that was shown
        this.setComponentStr(this.previousComponentStr);
    }

    render() {
        return (
            <Suspense 
                fallback={<LoadingFallback />}
            >
                {(() => {
                    switch (this.currentComponentStr) {
                        case "MainMenu":
                            return <MainMenu
                                gameDataPresent={this.gameDataPresent}
                                setGameDataPresent={this.setGameDataPresent}
                                toggleComponent={this.toggleComponent}
                            />
                        case "Settings":
                            return <Settings
                                gameDataPresent={this.gameDataPresent}
                                toggleComponent={this.toggleComponent}
                                previousComponentStr={this.previousComponentStr}
                                loadPreviousComponent={this.loadPreviousComponent}
                            />
                        case "Game":
                            return <Game
                                gameDataPresent={this.gameDataPresent}
                                setGameDataPresent={this.setGameDataPresent}
                                toggleComponent={this.toggleComponent}
                            />
                        case "EscapeMenu":
                            return <EscapeMenu
                                toggleComponent={this.toggleComponent}
                                previousComponentStr={this.previousComponentStr}
                            />
                        default:
                            throw new RangeError(`Invalid component name: '${this.currentComponentStr}'. Check if the component name is starting with a capital letter, and if the component is in the switch statement.`);
                    }
                })()}
            </Suspense>
        );
    }
}

export default Window;