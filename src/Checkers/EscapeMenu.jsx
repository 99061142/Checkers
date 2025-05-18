// empty class of escape menu
import { Component } from 'react';
import { Button } from 'react-bootstrap';

class EscapeMenu extends Component {
    constructor() {
        super();
        this.keyPressed = this.keyPressed.bind(this);
    }

    componentDidMount() {
        window.addEventListener('keydown', this.keyPressed);
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.keyPressed);
    }

    async keyPressed(ev) {
        // await function to not overload the event loop
        await new Promise(resolve => setTimeout(resolve, 0));

        // If the user presses the escape key on the keyboard, toggle the component to the game
        const key = ev.key;
        if (key === "Back")
            this.props.toggleComponent("Game");
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
                        onClick={() => this.props.toggleComponent("Game")}
                        style={buttonStyling}
                    >
                        Resume Game
                    </Button>
                    <Button
                        className="rounded-5 py-4"
                        onClick={() => this.props.toggleComponent("Settings")}
                        style={buttonStyling}
                    >
                        Settings
                    </Button>
                    <Button
                        className="rounded-5 py-4"
                        onClick={() => this.props.toggleComponent("MainMenu")}
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