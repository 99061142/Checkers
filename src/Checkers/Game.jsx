import { Component } from "react";
import Board from "./Board";

class Game extends Component {
    constructor() {
        super();
        this.state = {
            currentPlayer: 2
        };
        this.keyPressed = this.keyPressed.bind(this);
    }

    async componentDidMount() {
        // Add an event listener when the the user presses a key
        window.addEventListener('keydown', this.keyPressed, false);

        // Set the gameRunning setting to true 
        this.props.updateSettings(["gameRunning"], [true])
    }

    componentWillUnmount() {
        // Remove the event listener when the user presses a key
        window.removeEventListener('keydown', this.keyPressed, false);
    }

    keyPressed(ev) {
        // Go to the escape menu if the user presses the esc key
        if (ev.key === "Escape")
            this.props.setCurrentComponent("EscapeMenu");
    }

    get currentPlayer() {
        const currentPlayer = this.state.currentPlayer;
        return currentPlayer
    }

    set currentPlayer(player) {
        this.setState({
            currentPlayer: player
        });
    }

    switchCurrentPlayer = () => {
        this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
    }

    render() {
        return (
            <Board
                currentPlayer={this.currentPlayer}
                switchCurrentPlayer={this.switchCurrentPlayer}
                settings={this.props.settings}
            />
        );
    }
}

export default Game;