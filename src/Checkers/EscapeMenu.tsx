import { Component } from 'react';
import { Button } from 'react-bootstrap';

/**
 * Props for the EscapeMenu component.
 * - toggleComponent: Function to toggle the current component.
 */
interface EscapeMenuProps {
    toggleComponent: (componentName: string) => void;
}

class EscapeMenu extends Component<EscapeMenuProps> {
    constructor(props: EscapeMenuProps) {
        super(props);
        this.keyPressed = this.keyPressed.bind(this);
    }

    componentDidMount() {
        window.addEventListener('keydown', this.keyPressed);
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.keyPressed);
    }


    /**
     * Handles key presses in the Escape Menu.
     * @param {KeyboardEvent} ev - The keyboard event triggered by the user.
     * @returns {Promise<void>} - A promise that resolves when the key press is handled.
     */
    async keyPressed(ev: KeyboardEvent): Promise<void> {
        // Yield the event loop to ensure the event is processed correctly
        await Promise.resolve();

        // If the user presses the Escape key, toggle the Game component to resume the game
        if (ev.key === "Escape") {
            this.props.toggleComponent("game");
        }
    }

    render() {
        const buttonStyling = {
            background: "linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), linear-gradient(135deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000)",
            border: "3px #000 solid",
            fontSize: "2vw",
            color: "black"
        };

        return (
            <div
                data-testid="escapeMenu"
                className="d-flex flex-column justify-content-center align-items-center"
                style={{
                    height: "100vh",
                    width: "100vw",
                    background: "linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), linear-gradient(135deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000)"
                }}
            >
                <h1
                    className="text-center"
                    style={{
                        fontSize: "7.5vw",
                        marginBottom: "10vh"
                    }}
                >
                    Escape Menu
                </h1>
                <div
                    className="d-flex gap-5 flex-column"
                    style={{
                        width: "40vw"
                    }}
                >
                    <Button
                        className="rounded-5 py-4"
                        data-testid="escapeMenuResumeButton"
                        onClick={() => this.props.toggleComponent("game")}
                        style={buttonStyling}
                    >
                        Resume Game
                    </Button>
                    <Button
                        className="rounded-5 py-4"
                        data-testid="escapeMenuSettingsButton"
                        onClick={() => this.props.toggleComponent("settings")}
                        style={buttonStyling}
                    >
                        Settings
                    </Button>
                    <Button
                        className="rounded-5 py-4"
                        data-testid="escapeMenuQuitButton"
                        onClick={() => this.props.toggleComponent("mainMenu")}
                        style={buttonStyling}
                    >
                        Main Menu
                    </Button>
                </div>
            </div>
        );
    }
}

export default EscapeMenu;