import { Component } from "react";
import Board from "./Board";

class Game extends Component {
    constructor() {
        super();
        this.state = {
            currentPlayer: 2
        };
    }

    get currentPlayer() {
        const currentPlayer = this.state.currentPlayer;
        return currentPlayer
    }

    set currentPlayer(player) {
        this.setState({
            player
        });
    }

    setCurrentPlayer(player) {
        this.setState({
            currentPlayer: player
        });
    }

    render() {
        return (
            <Board />
        );
    }
}

export default Game;