import { Component } from "react";
import Board from "./Board";

class Game extends Component {
    constructor() {
        super();
        this.state = {
            currentPlayer: 2
        };
    }

    switchCurrentPlayer = () => {
        this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
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

    render() {
        return (
            <Board
                switchCurrentPlayer={this.switchCurrentPlayer}
                currentPlayer={this.currentPlayer}
            />
        );
    }
}

export default Game;