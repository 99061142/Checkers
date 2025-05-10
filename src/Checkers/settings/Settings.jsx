import { Component, lazy, Suspense } from 'react';
import { Button, Container, Row, Col, Navbar, Nav, NavLink } from 'react-bootstrap';
import './settingsStyling.scss'

// Importing the exports to talk with the localstorage of the stored settings
import { getSettings, setSettings } from './settingsData';

// Importing the settings forms,
// In which the user can change the settings of the gamerules, board, and/or more depending on the respective form
import LoadingFallback from '../LoadingFallback';
import GameSettings from './gameSettings';
const BoardSettings = lazy(() => import('./boardSettings'));

class Settings extends Component {
    constructor() {
        super();
        this.state = {
            formShownStr: "game", // This is used to check which form is shown
            formAllowedToChange: true, // This is used to check if the form is allowed to change, If the user has made a change without saving it, this will be set to false
            formSettings: getSettings()
        };
        this.keyPressed = this.keyPressed.bind(this);
    }

    componentDidMount() {
        window.addEventListener('keydown', this.keyPressed);

        // Save the settings to the localstorage before the window is unloaded
        window.onbeforeunload = () => {
            setSettings(this.formSettings);
        };
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.keyPressed);

        // Save the state settings to the localstorage before the user leaves the settings page
        setSettings(this.formSettings);
    }

    async keyPressed(ev) {
        // Await function to not overload the event loop
        await new Promise(resolve => setTimeout(resolve, 0));

        // If the user presses the escape key, load the previous component
        if (ev.key === "Escape")
            this.exitButtonPressed();
    }

    setFormShownStr = (formShownStr) => {
        this.setState({
            formShownStr
        });
    }

    exitButtonPressed = () => {
        this.props.loadPreviousComponent();
    }

    get formSettings() {
        const formSettings = this.state.formSettings;
        return formSettings
    }

    set formSettings(settings) {
        this.setState({
            formSettings: settings
        });
    }

    updateSettingValue = (settingName, settingValue) => {
        const tempSettings = this.formSettings;
        let currentObject = tempSettings;
        const deepKeys = settingName.split("-");
        // If the setting name contains only one key, and couldn't be found, throw an error
        if (
            deepKeys.length === 1 && 
            currentObject[settingName] === undefined
        )
            throw Error(`Tried to access a non-existing key: ${settingName}.`);
        
        // If the setting name contains more than one key, go to the last key if possible, and set the value of the last key to the setting value
        // If one of the keys doesn't exist, throw an error
        for (let deepKey of deepKeys.slice(0, -1)) {
            if (currentObject[deepKey] === undefined)
                throw Error(`Tried to access a non-existing key while deep searching the settings object. Last key that couldn't be found: ${deepKey}.`);
            currentObject = currentObject[deepKey];
        }
        // Set the value of the last key to the setting value
        currentObject[deepKeys.at(-1)] = settingValue;

        // update the state with the new value for the setting that was changed
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
                                            fontWeight: this.state.formShownStr === "game" ? "bold" : "normal"
                                        }}
                                        disabled={this.state.formShownStr === "game"}
                                        draggable={false}
                                        onClick={() => this.setFormShownStr("game")}
                                    >
                                        Game
                                    </NavLink>
                                    <NavLink
                                        className="text-dark"
                                        style={{
                                            fontWeight: this.state.formShownStr === "board" ? "bold" : "normal",
                                        }}
                                        disabled={this.state.formShownStr === "board"}
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
                                    switch (this.state.formShownStr) {
                                        case "game":
                                            return <GameSettings
                                                ref={this.currentFormRef}
                                                settings={this.formSettings}
                                                updateSettingValue={this.updateSettingValue}
                                            />
                                        case "board":
                                            return <BoardSettings
                                                ref={this.currentFormRef}
                                                settings={this.formSettings}
                                                updateSettingValue={this.updateSettingValue}
                                            />
                                        default:
                                            throw new RangeError(`Invalid formShownStr: ${this.state.formShownStr}. Check if the form name is a valid case in the switch statement.`);
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