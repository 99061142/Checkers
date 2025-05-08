import { Component, lazy, Suspense } from 'react';

// Json object that contains the key events for the above imported components
// This import is used as a prop to the components, so that the components can use the key events
import keyEvents from './keyEvents.json';

// All components that could be rendered in the window to play the game
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
            previousComponentStr: null // This is used to check which component was shown before the current component
        };
    }

    get previousComponentStr() {
        const previousComponentStr = this.state.previousComponentStr;
        return previousComponentStr;
    }

    get currentComponentStr() {
        const currentComponentStr = this.state.currentComponentStr;
        return currentComponentStr;
    }

    toggleComponent = (newComponent) => {
        // If the new component is the same as the current component, log an error and return
        // This is used to report if the user is trying to switch to the same component, which should not be possible
        const currentComponent = this.state.currentComponentStr;
        if (newComponent === currentComponent) {
            console.error(`Error: Tried to switch to the same component: ${newComponent}.`);
            return
        }

        // If the new component isn't the same as the current component, 
        // Set the current component to the new component, and set the previous component to the current component
        // This is used to show the component the user wants to see, and to save the previous shown component when needed,
        // e.g. when the user presses an back button, or if the user click on ESC key on the keyboard if an keydown event for ESC is set in the keyEvents.json file
        this.setState({
            currentComponentStr: newComponent,
            previousComponentStr: currentComponent
        });
    }

    loadPreviousComponent = () => {
        // If the previous component is null, log an error and return
        // This is used to report if the user is trying to switch to a component that doesn't exist
        if (this.previousComponentStr === null) {
            console.error(`Error: Tried to switch to the previous component, but the previous component is null.`);
            return
        }
        
        // If the previous component is the same as the current component, log an error and return
        // This is used to report if the user is trying to switch to the same component
        if (this.previousComponentStr === this.currentComponentStr) {
            console.error(`Error: Tried to switch to the previous component, but the previous component is the same as the current component: ${this.previousComponentStr}.`);
            return
        }

        // If the previous component is not null, and is not the same as the current component,
        // Set the current component to the previous component, and set the previous component to the current component
        this.setState((prevState) => ({
            currentComponentStr: prevState.previousComponentStr,
            previousComponentStr: prevState.currentComponentStr
        }));
    }

    render() {
        const { currentComponentStr, previousComponentStr } = this.state;

        return (
            <Suspense fallback={<LoadingFallback />}>
                {(() => {
                    switch (currentComponentStr) {
                        case "MainMenu":
                            return <MainMenu
                                toggleComponent={this.toggleComponent}
                                keyEvents={keyEvents.mainMenu || {}}
                            />
                        case "Settings":
                            return <Settings
                                toggleComponent={this.toggleComponent}
                                previousComponentStr={previousComponentStr}
                                keyEvents={keyEvents.settings || {}}
                                loadPreviousComponent={this.loadPreviousComponent}
                            />
                        case "Game":
                            return <Game
                                toggleComponent={this.toggleComponent}
                                keyEvents={keyEvents.game || {}}
                            />
                        case "EscapeMenu":
                            return <EscapeMenu
                                toggleComponent={this.toggleComponent}
                                previousComponentStr={previousComponentStr}
                                keyEvents={keyEvents.escapeMenu || {}}
                            />
                        default:
                            throw new RangeError(`Invalid component name: ${currentComponentStr}. Check if the component name is starting with a capital letter, and if the component is in the switch statement.`);
                    }
                })()}
            </Suspense>
        );
    }
}

export default Window;