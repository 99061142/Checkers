import { Component } from "react";

class EscapeMenu extends Component {
    constructor() {
        super();
        this.keyPressed = this.keyPressed.bind(this);
    }

    keyPressed(ev) {
        if (ev.key === "Escape")
            this.props.setCurrentComponent("Game");
    }

    componentDidMount() {
        window.addEventListener('keydown', this.keyPressed, false);
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.keyPressed, false);
    }

    exitPressed() {
        // Set the gameRunning setting to false
        const updatedSettings = JSON.parse(JSON.stringify(this.props.settings));
        updatedSettings.gameRunning = false;
        this.props.setSettings(updatedSettings);

        // Go to the main menu
        this.props.setCurrentComponent("MainMenu");
    }

    render() {
        return (
            <div
                className="position-absolute start-50 top-50 d-flex gap-5 flex-column"
                style={{
                    width: "30%",
                    WebkitTansform: "translate(-50%, -50%)",
                    transform: "translate(-50%, -50%)"
                }}
            >
                <button
                    onClick={() => this.props.setCurrentComponent("Game")}
                    className="btn btn-primary px-4 py-2"
                >
                    Back
                </button>
                <button
                    onClick={() => this.props.setCurrentComponent("Settings")}
                    className="btn btn-primary px-4 py-2"
                >
                    Settings
                </button>
                <button
                    onClick={() => this.exitPressed()}
                    className="btn btn-primary px-4 py-2"
                >
                    Exit
                </button>
            </div>
        )
    }
}

export default EscapeMenu;