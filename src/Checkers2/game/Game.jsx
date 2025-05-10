// empty class for the game
import { Component } from 'react';
import Board from './Board.jsx';

class Game extends Component {
    constructor() {
        super();
        this.state = {
            currentPlayer: 1
        }
        this.keyPressed = this.keyPressed.bind(this);
    }

    componentDidMount() {
        window.addEventListener('keydown', this.keyPressed);
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.keyPressed);
    }

    get currentPlayer() {
        // Get the current player from the state
        const currentPlayer = this.state.currentPlayer;
        return currentPlayer
    }

    switchPlayer = () => {
        // Switch the player between 1 and 2
        this.setState(prevState => ({
            currentPlayer: prevState.currentPlayer === 1 ? 2 : 1
        }));
    }

    async keyPressed(ev) {
        // await function to not overload the event loop
        await new Promise(resolve => setTimeout(resolve, 0));

        if (ev.key === "Escape") {
            this.props.toggleComponent("EscapeMenu");
            return
        }
    }


    render() {
        return (
            <Board
                currentPlayer={this.currentPlayer}
                switchPlayer={this.switchPlayer}
            />
        );
    }
}

export default Game;