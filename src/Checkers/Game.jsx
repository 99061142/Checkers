import { Component, createRef } from "react";
import Board from "./Board";

class Game extends Component {
    constructor() {
        super();
        this._boardComponentRef = createRef(null);
        this.keyPressed = this.keyPressed.bind(this);
    }

    async componentDidMount() {
        // Add an event listener when the the user presses a key
        window.addEventListener('keydown', this.keyPressed, false);

        // Set the gameRunning setting to true 
        const updatedSettings = JSON.parse(JSON.stringify(this.props.settings));
        updatedSettings.gameRunning = true;
        this.props.setSettings(updatedSettings);
    }

    componentWillUnmount() {
        // remove the event listener when the user presses a key
        window.removeEventListener('keydown', this.keyPressed, false);

        // * TODO: functionality to save the game
    }

    keyPressed(ev) {
        // Go to the escape menu if the user presses esc
        if (ev.key === "Escape")
            this.props.setCurrentComponent("EscapeMenu");
    }

    switchCurrentPlayer = () => {
        const updatedSettings = this.props.settings;
        updatedSettings.currentPlayer = this.updatedSettings.currentPlayer === 1 ? 2 : 1;
        this.props.setSettings(updatedSettings);
    }

    start() {
        // * TODO: functionality to start the game
    }

    restart() {
        // * TODO: functionality to restart the game
    }

    render() {
        return (
            <Board
                ref={this._boardComponentRef}
                switchCurrentPlayer={this.switchCurrentPlayer}
                settings={this.props.settings}
            />
        );
    }
}

export default Game;