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
            currentComponentName: "Game",
            previousComponentName: null
        }
    }

    setCurrentComponentName = (componentName) => {
        this.setState(state => {
            return {
                previousComponentName: state.currentComponentName,
                currentComponentName: componentName
            }
        });
    }

    get previousComponentName() {
        return this.state.previousComponentName;
    }

    get currentComponentName() {
        return this.state.currentComponentName
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
                                setCurrentComponent={this.setCurrentComponentName}
                            />
                        case "Settings":
                            return <Settings
                                setCurrentComponent={this.setCurrentComponentName}
                                previousComponent={this.previousComponentName}
                                settings={this.settings}
                                setSettings={this.setSettings}
                            />
                        case "Game":
                            return <Game
                                setCurrentComponent={this.setCurrentComponentName}
                                settings={this.settings}
                                setSettings={this.setSettings}
                                updateSettings={this.updateSettings}
                            />
                        case "EscapeMenu":
                            return <EscapeMenu
                                setCurrentComponent={this.setCurrentComponentName}
                                currentComponent={this.currentComponent}
                                settings={this.settings}
                                setSettings={this.setSettings}
                            />
                        case "About":
                            return <About
                                setCurrentComponent={this.setCurrentComponentName}
                            />
                        default:
                            throw RangeError("The component named: \"" + this.currentComponentName + "\" couldn't be rendered. Check if the name is correctly spelled, or if it's an optional switch case.")
                    }
                })()}
            </Suspense>
        )
    }
}

export default Window;