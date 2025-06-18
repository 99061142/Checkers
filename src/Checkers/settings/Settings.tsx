import { Component, lazy, Suspense, ComponentType } from 'react';
import { Button, Container, Row, Col, Navbar, Nav, NavLink } from 'react-bootstrap';
import './settingsStyling.scss';
import LoadingFallback from '../LoadingFallback.jsx';
import GameSettings from './GameSettings.tsx';
const BoardSettings = lazy(() => import('./BoardSettings.tsx'));

/**
 * Props for the Settings component.
 * - gameDataPresent: A boolean value indicating whether the game data is present in the local storage.
 * - loadPreviousComponent: Function to load the previous displayed component.
 */
interface SettingsProps {
    gameDataPresent: boolean;
    loadPreviousComponent: () => void;
}

/**
 * State for the Settings component.
 * - currentFormName: The name of the currently displayed form.
 */
interface SettingsState {
    currentFormName: string;
}

class Settings extends Component<SettingsProps, SettingsState> {
    // Map of form names and their corresponding components
    formComponentMap = {
        game: GameSettings,
        board: BoardSettings,
    } as Record<string, ComponentType<{ gameDataPresent: boolean }>>;

    // List of available form names, derived from the keys of formComponentMap
    availableFormNames = Object.keys(this.formComponentMap);

    // Set of available form names for quick validation
    availableFormNamesSet = new Set(this.availableFormNames);

    // String representation of valid form names for error messages
    availableFormNamesStr = this.availableFormNames.map(name => `'${name}'`).join(', ');

    constructor(props: SettingsProps) {
        super(props);
        this.state = {
            currentFormName: "game"
        };
    }

    componentDidMount() {
        window.addEventListener('keydown', this.handleKeyDown);
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.handleKeyDown);
    }

    /**
     * Handles keydown events in the settings component.
     * @param {KeyboardEvent} ev - The keyboard event triggered by the user.
     * @returns {void}
     */
    handleKeyDown = (ev: KeyboardEvent): void => {
        // If the user presses the Escape key on the keyboard, exit the settings
        if (ev.key === "Escape") {
            this.handleExit();
        }
    }

    /**
     * Exits the settings component and load the previous displayed component.
     * @returns {void}
     */
    handleExit = (): void => {
        this.props.loadPreviousComponent();
    }

    /**
     * Sets the currently displayed settings form
     * @param {string} formName - The name of the form to be displayed.
     * @throws {RangeError} If the provided name is not a valid form name.
     * @returns {void}
     */
    setFormName(formName: string): void {
        if (!this.availableFormNamesSet.has(formName)) {
            throw new RangeError(`Invalid form name: '${formName}'. Available form names are: ${this.availableFormNamesStr}`);
        }

        this.setState({
            currentFormName: formName
        });
    }

    /**
     * Returns the settings form component to display based on the current form name.
     * If the current form name is not valid, returns null.
     * @returns {React.JSX.Element | null} The component to be displayed in the settings form, or null if the form name is invalid.
     */
    get settingsForm(): React.JSX.Element | null {    
        // If the component for the current form name is not found, return null
        const Component = this.formComponentMap[this.state.currentFormName];
        if (!Component) {
            return null
        }

        // Return the component based on the current form name with the needed props
        return <Component 
            gameDataPresent={this.props.gameDataPresent} 
        />
    }

    render() {
        return (
            <div
                data-testid="settings"
            >
                <div
                    className="m-3 d-flex justify-content-between"
                >
                    <h1>
                        Settings
                    </h1>
                    <Button
                        data-testid="exitButton"
                        className="border-0 bg-transparent text-dark text-bold btn btn-lg"
                        onClick={this.handleExit}
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
                                    {this.availableFormNames.map((formName) => {
                                        const formNameCapitalized = formName.charAt(0).toUpperCase() + formName.slice(1);
                                        return (
                                            <NavLink
                                                as={Button}
                                                className="text-dark bg-transparent"
                                                style={{
                                                    fontWeight: this.state.currentFormName === formName ? "bold" : "normal",
                                                }}
                                                data-testid={`settingsNavLink${formNameCapitalized}`}
                                                disabled={this.state.currentFormName === formName}
                                                draggable={false}
                                                onClick={() => this.setFormName(formName)}
                                                key={formName}
                                            >
                                                {formNameCapitalized}
                                            </NavLink>
                                        )
                                    })}
                                </Nav>
                            </Navbar>
                        </Col>
                        <Col
                            md={10}
                        >
                            <Suspense
                                fallback={<LoadingFallback />}
                            >
                                {this.settingsForm}
                            </Suspense>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}

export default Settings;