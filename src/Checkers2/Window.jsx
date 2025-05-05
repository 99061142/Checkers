import { Component, lazy, Suspense } from 'react';

// Json object that contains the key events for the above imported components
// This import is used as a prop to the components, so that the components can use the key events
import keyEvents from './keyEvents.json';

// All components that could be rendered in the window to play the game
import LoadingFallback from './LoadingFallback';
import MainMenu from './MainMenu';
const Settings = lazy(() => import('./Settings.jsx'));
const Game = lazy(() => import('./Game'));
const EscapeMenu = lazy(() => import('./EscapeMenu'));

class Window extends Component {
    constructor() {
        super();
        this.state = {
            currentComponentStr: "MainMenu",
            previousComponentStr: null
        };
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

    render() {
        const { currentComponentStr, previousComponentStr } = this.state;

        return (
            <div
                className="position-absolute top-50 start-50 translate-middle"
            >
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
            </div>
        );
    }
}

export default Window;