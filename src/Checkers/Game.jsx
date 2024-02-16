import { Component, createRef } from "react";
import Board from "./Board";

class Game extends Component {
    constructor() {
        super();
        this.state = {
            currentPlayer: 2
        };
        this.board = createRef(null);
    }

    get currentPlayer() {
        const currentPlayer = this.state.currentPlayer;
        return currentPlayer
    }

    setCurrentPlayer(player) {
        this.setState({
            currentPlayer: player
        });
    }

    render() {
        return (
            <Board
                board={this.board}
                ref={this.board}
            />
        );
    }
}

export default Game;
