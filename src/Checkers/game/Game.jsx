// empty class for the game
import { Component } from 'react';
import Board from './Board.jsx';
import { getLastCurrentPlayer, setLastCurrentPlayer, getAllGameDataPresent } from './gameData.js';
import { getSettings } from '../settings/settingsData.js';
import GameOverOverlay from './gameOverOverlay';

class Game extends Component {
    constructor() {
        super();
        this.state = {
            currentPlayer: null, // Set the initial player based on the default settings. This could be changed in the componentDidMount() method if a game was not finished yet, which would load the last player
            gameOver: false, // This is used to check if the game is finished or not
            winner: null  // This is used to check which player won the game if the game is finished. If the game is not finished, this will be null
        }
        this.keyPressed = this.keyPressed.bind(this);
        this.beforeUnloadHandler = this.beforeUnloadHandler.bind(this)
    }

    componentDidMount() {
        window.addEventListener('keydown', this.keyPressed);
        window.addEventListener('beforeunload', this.beforeUnloadHandler);
        
        // Initialize the current player based on the default settings, or the last player that played if a game was not finished yet
        this.currentPlayer = getAllGameDataPresent() ? getLastCurrentPlayer() : getSettings().initialPlayer;
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.keyPressed);
        window.removeEventListener('beforeunload', this.beforeUnloadHandler);

        // If the player was initialized, and the game is closed, save the current player to the local storage
        // This initializion must be set because of the react strict mode, which calls the componentDidMount() twice
        // And will also call this function, while the initialization was not yet set for the current player, which would return in that the current player is null
        if (
            this.currentPlayer !== null &&
            !this.gameOver
        )
            setLastCurrentPlayer(this.currentPlayer);
    }

    beforeUnloadHandler() {
        setLastCurrentPlayer(this.currentPlayer);
    }

    set currentPlayer(player) {
        // Set the current player
        this.setState({
            currentPlayer: player
        });
    }

    get currentPlayer() {
        // Get the current player from the state
        const currentPlayer = this.state.currentPlayer;
        return currentPlayer
    }

    get gameOver() {
        // Return if the game is finished
        const gameOver = this.state.gameOver;
        return gameOver
    }

    setGameOver = (bool) => {
        // Set if the game is finished
        this.setState({
            gameOver: bool
        });
    }

    setWinner = (player) => {
        // Set the player that won the game
        this.setState({
            winner: player
        });
    }

    get winner() {
        // Get the player that won the game
        const winner = this.state.winner;
        return winner
    }

    switchPlayer = () => {
        // If the current player is 1, set it to 2, else set it to 1
        this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
    }

    async keyPressed(ev) {
        // await function to not overload the event loop
        await new Promise(resolve => setTimeout(resolve, 0));

        if (
            ev.key === "Escape" &&
            !this.gameOver
        )
            this.props.toggleComponent("EscapeMenu");
    }

    render() {
        return (
            <>
            {this.gameOver &&
                <GameOverOverlay 
                    toggleComponent={this.props.toggleComponent}
                    winner={this.winner}
                />
            }
            <Board
                setGameOver={this.setGameOver}
                setWinner={this.setWinner}
                gameOver={this.gameOver}
                currentPlayer={this.currentPlayer}
                switchPlayer={this.switchPlayer}
            />
            </>
        );
    }
}

export default Game;