import { Component, lazy, Suspense } from 'react';
import { Button, Container, Row, Col, Navbar, Nav, NavLink } from 'react-bootstrap';
import './settingsStyling.scss';

// Importing the exports to talk with the localstorage of the stored settings
import { getSettings, setSettings } from './settingsData';

// Importing the settings forms in which the user can change the settings of the gamerules, board, and/or more depending on the respective form
import LoadingFallback from '../LoadingFallback';
import GameSettings from './gameSettings';
const BoardSettings = lazy(() => import('./boardSettings'));

class Settings extends Component {
    constructor() {
        super();
        this.state = {
            currentFormStr: "game", // This is used to check which form is shown
            formSettings: getSettings() // Call the exported function to get the settings from the localstorage. This would be used to set the form to the settings that are stored in the localstorage, and let the user make changes in real time based on the changes of this state
        };
        this.keyPressed = this.keyPressed.bind(this);
        this.beforeUnloadHandler = this.beforeUnloadHandler.bind(this);
    }

    componentDidMount() {
        window.addEventListener('keydown', this.keyPressed);

        // Save the settings to the localstorage before the window is unloaded
        window.addEventListener('beforeunload', this.beforeUnloadHandler);
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.keyPressed);
        window.removeEventListener('beforeunload', this.beforeUnloadHandler);

        // Save the settings to the localstorage before the current component is unmounted
        setSettings(this.formSettings);
    }

    async keyPressed(ev) {
        // Await function to not overload the event loop
        await new Promise(resolve => setTimeout(resolve, 0));

        // If the user presses the escape key on the keyboard, load the previous shown component
        const key = ev.key;
        if (key === "Escape")
            this.exitButtonPressed();
    }

    beforeUnloadHandler() {
        // Save the settings to the localstorage before the window is unloaded
        setSettings(this.formSettings);
    }

    get currentFormStr() {
        // Return a string of the name of the current form
        const currentFormStr = this.state.currentFormStr;
        return currentFormStr;
    }

    setFormShownStr = (chosenFormStr) => {
        // Set the string of the current form to chosenFormStr
        // Which the user has selected in the navbar
        // This will render the new form of the chosen form
        this.setState({
            currentFormStr: chosenFormStr
        });
    }

    exitButtonPressed = () => {
        // Call the prop which is passed from the Windows.jsx component,
        // And is used to change the component which is shown to the previously shown component 
        this.props.loadPreviousComponent();
    }

    get formSettings() {
        // Return the object which contains the settings of the application. 
        const formSettings = this.state.formSettings;
        return formSettings
    }

    set formSettings(settings) {
        // Set the object which contains the settings of the current setting component.
        //! This won't change the localstorage settings, but only the 'formSettings' state of the current component.
        //! The localstorage settings are only changed when the user leaves the settings page, or when the user closes the window.
        //! The change happens in the beforeUnloadHandler, or in the componentWillUnmount function.
        this.setState({
            formSettings: settings
        });
    }

    updateSettingValue = (settingName, settingValue) => {        
        const tempSettings = this.formSettings;
        let currentObject = tempSettings;
        const nestedKeys = settingName.split("-");
        
        // If the setting name isn't a nested key, and couldn't be found, throw an error.
        // If the setting name could be found, update the value of the setting to the setting value, and return
        if (nestedKeys.length === 1) {
            if (!currentObject.hasOwnProperty(settingName))
                throw Error(`The key '${settingName}' doesn't exist in the first level of the settings object.`);
            currentObject[settingName] = settingValue;
            this.formSettings = tempSettings;
            return
        }

        // If the setting name is a nested key, loop through the keys and check if the key exists in the object
        // If the key doesn't exist in the given level, throw an error,
        // Else, update the value of the setting to the setting value
        for (let i = 0; i < nestedKeys.length - 1; i++) {
            const nestedKey = nestedKeys[i];
            if (currentObject[nestedKey] === undefined)
                throw Error(`The key '${nestedKey}' doesn't exist in level ${i} of the settings object.`);
            currentObject = currentObject[nestedKey];
        }
        currentObject[nestedKeys.at(-1)] = settingValue;
        this.formSettings = tempSettings;
    }

    render() {
        return (
            <>
                <div
                    className="m-3 d-flex justify-content-between"
                >
                    <h1>
                        Settings
                    </h1>
                    <Button
                        className="border-0 bg-transparent text-dark text-bold btn btn-lg"
                        onClick={this.exitButtonPressed}
                    >
                        X
                    </Button>
                </div>
                <hr />
                <Container
                    fluid
                >
                    <Row>
                        <Col 
                            md={2}
                            className="d-flex justify-content-center align-items-start"
                        >
                            <Navbar>
                                <Nav
                                    style={{
                                        color: "black",
                                        fontSize: "1.25rem"
                                    }}
                                >
                                    <NavLink
                                        className="text-dark"
                                        style={{
                                            fontWeight: this.state.currentFormStr === "game" ? "bold" : "normal"
                                        }}
                                        disabled={this.state.currentFormStr === "game"}
                                        draggable={false}
                                        onClick={() => this.setFormShownStr("game")}
                                    >
                                        Game
                                    </NavLink>
                                    <NavLink
                                        className="text-dark"
                                        style={{
                                            fontWeight: this.state.currentFormStr === "board" ? "bold" : "normal",
                                        }}
                                        disabled={this.state.currentFormStr === "board"}
                                        draggable={false}
                                        onClick={() => this.setFormShownStr("board")}
                                    >
                                        Board
                                    </NavLink>
                                </Nav>
                            </Navbar>
                        </Col>
                        <Col
                            md={10}
                        >
                        <Suspense
                            fallback={<LoadingFallback />}
                        >
                                {(() => {
                                    switch (this.state.currentFormStr) {
                                        case "game":
                                            return <GameSettings
                                                settings={this.formSettings}
                                                updateSettingValue={this.updateSettingValue}
                                            />
                                        case "board":
                                            return <BoardSettings
                                                gameDataPresent={this.props.gameDataPresent}
                                                settings={this.formSettings}
                                                updateSettingValue={this.updateSettingValue}
                                            />
                                        default:
                                            throw new RangeError(`Invalid currentFormStr: ${this.state.currentFormStr}. Check if the form name is a valid case in the switch statement.`);
                                    }
                                })()}
                            </Suspense>
                        </Col>
                    </Row>
                </Container>
            </>
        );
    }
}

export default Settings;