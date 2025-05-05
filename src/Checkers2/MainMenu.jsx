import { Component } from 'react';
import { Button } from 'react-bootstrap';

class MainMenu extends Component {
    render() {
        // Styling for the buttons
        const buttonStyling = {
            background: "linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), linear-gradient(135deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000)",
            border: "3px #000 solid",
            color: "#fff",
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
                    MAIN MENU
                </h1>
                <div
                    className="d-flex gap-5 flex-column"
                    style={{
                        width: "40vw"
                    }}
                >
                    <Button
                        className="rounded-5 py-4"
                        style={buttonStyling}
                        onClick={() => this.props.toggleComponent("Game")}
                    >
                        Play
                    </Button>
                    <Button
                        className="rounded-5 py-4"
                        style={buttonStyling}
                        onClick={() => this.props.toggleComponent("Settings")}
                    >
                        Settings
                    </Button>
                </div>
            </div>
        );
    }
}

export default MainMenu;