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
                className="d-flex flex-column gap-5"
            >
                <button
                    onClick={() => this.props.setCurrentComponent("Game")}
                    className="btn btn-primary px-5 py-1"
                >
                    back
                </button>
                <button
                    onClick={() => this.props.setCurrentComponent("Settings")}
                    className="btn btn-primary px-5 py-1"
                >
                    settings
                </button>
                <button
                    onClick={() => this.exitPressed()}
                    className="btn btn-primary px-5 py-1"
                >
                    exit
                </button>
            </div>
        )
    }
}

export default EscapeMenu;