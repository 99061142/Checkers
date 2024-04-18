import { Component, lazy, Suspense } from "react";
import LoadingFallback from "./LoadingFallback";
import MainMenu from './MainMenu';

const Game = lazy(() => import('./Game'));
const Settings = lazy(() => import('./settings/Settings'));
const EscapeMenu = lazy(() => import('./EscapeMenu'));
const About = lazy(() => import('./About'));

class App extends Component {
    constructor() {
        super();
        this.state = {
            settings: require('./settings/settingsData.json'),
            currentComponent: "MainMenu",
            previousComponent: null,
            currentGameComponent: null,
        };
    }

    setCurrentComponent = (component) => {
        this.setState(prevState => {
            return {
                    ...prevState,
                    previousComponent: prevState.currentComponent,
                    currentComponent: component
            }
        });
    }

    get previousComponent() {
        const previousComponent = this.state.previousComponent;
        return previousComponent;
    }

    get currentComponent() {
        const currentComponent = this.state.currentComponent;
        return currentComponent
    }

    get settings() {
        const settings = this.state.settings;
        return settings
    }

    setSettings = (settings) => {
        this.setState({
            settings
        });
    }

    render() {
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
                            />
                        case "EscapeMenu": 
                            return <EscapeMenu
                                currentComponent={this.currentComponent}
                                setCurrentComponent={this.setCurrentComponent}
                                settings={this.settings}
                                setSettings={this.setSettings}
                            />
                        case "About": 
                            return <About
                                setCurrentComponent={this.setCurrentComponent}
                            />
                        default:
                            throw RangeError("The component named: \"" + this.currentComponent + "\" couldn't be rendered.")
                    }
                })()}
            </Suspense>
        )
    }
}

export default App;