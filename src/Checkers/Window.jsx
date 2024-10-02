import { Component, lazy, Suspense } from "react";
import LoadingFallback from "./LoadingFallback";
import MainMenu from './MainMenu';
const Game = lazy(() => import('./Game'));
const Settings = lazy(() => import('./settings/Settings'));
const EscapeMenu = lazy(() => import('./EscapeMenu'));
const About = lazy(() => import('./About'));

class Window extends Component {
    constructor() {
        super();
        this.state = {
            component: {
                current: "Game",
                previous: null
            }
        }
    }

    get currentComponent() {
        // Get the current component that is shown
        const currentComponent = this.state.component.current;
        return currentComponent
    }

    get previousComponent() {
        // Get the previous component that was shown
        const previousComponent = this.state.component.previous;
        return previousComponent
    }

    setCurrentComponent = (newComponent) => {
        // Set the previous component as currentComponent and the currentComponent as newComponent (this func parameter)
        this.setState(state => {
            return {
                component: {
                    previous: state.component.current,
                    current: newComponent
                }
            }
        });
    }

    render() {
        // Render one of the component based on the currentComponent state, if there is no possible case throw an RangeError
        return (
            <Suspense
                fallback={<LoadingFallback />}
            >
                {(() => {
                    switch (this.currentComponent) {
                        case "MainMenu":
                            return <MainMenu
                                setCurrentComponent={this.setCurrentComponent}
                            />
                        case "Settings":
                            return <Settings
                                setCurrentComponent={this.setCurrentComponent}
                                previousComponent={this.previousComponent}
                                settings={this.settings}
                                setSettings={this.setSettings}
                            />
                        case "Game":
                            return <Game
                                setCurrentComponent={this.setCurrentComponent}
                                settings={this.settings}
                                setSettings={this.setSettings}
                                updateSettings={this.updateSettings}
                            />
                        case "EscapeMenu":
                            return <EscapeMenu
                                setCurrentComponent={this.setCurrentComponent}
                                currentComponent={this.currentComponent}
                                settings={this.settings}
                                setSettings={this.setSettings}
                            />
                        case "About":
                            return <About
                                setCurrentComponent={this.setCurrentComponent}
                            />
                        default:
                            throw RangeError("The component named: \"" + this.currentComponent + "\" couldn't be rendered. Check if the name is correctly spelled, or if it's an optional switch case.")
                    }
                })()}
            </Suspense>
        )
    }
}

export default Window;