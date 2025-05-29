import { Component } from 'react';
import { getLastPlayer, setLastPlayer, deleteGameData } from './gameData';
import { getSettings } from '../settings/settingsData';
import GameOverOverlay from './GameOverOverlay';
import Board from './Board';

class Game extends Component {
    constructor() {
        super();
        this.state = {
            currentPlayer: null, // Set the initial player based on the default settings. This could be changed in the componentDidMount() method if a game was not finished yet, which would load the last player
            gameOver: false, // This is used to check if the game is finished or not
            winner: null  // This is used to check which player won the game if the game is finished. If the game is not finished, this will be null
        }
        this.keyPressed = this.keyPressed.bind(this);
        this.beforeUnloadHandler = this.beforeUnloadHandler.bind(this);
    }

    componentDidMount() {
        window.addEventListener('keydown', this.keyPressed);
        window.addEventListener('beforeunload', this.beforeUnloadHandler);
        
        // If the game was loaded from the local storage, set the current player to the last player that played,
        // else set it to the initial player which is set in the defaultSettings.json file
        this.currentPlayer = this.props.gameDataPresent ? getLastPlayer() : getSettings().initialPlayer;

        // Set the game data present to true, which will say if there is game data present in the local storage or not
        // This function is found in the Window component, and is passed as a prop to this component
        this.props.setGameDataPresent(true);
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.keyPressed);
        window.removeEventListener('beforeunload', this.beforeUnloadHandler);

        // If the player was initialized, and the game is closed, save the current player to the local storage.
        // This initializion check must be done because of the React.StrictMode inside of the index.js file, which initialize the component twice.
        if (
            this.currentPlayer !== null &&
            !this.gameOver
        )
            setLastPlayer(this.currentPlayer);

        // If the game is over, set the gameDataPresent to false, which will say if there is game data present in the local storage or not
        // This function is found in the Window component, and is passed as a prop to this component
        if (this.gameOver)
            this.props.setGameDataPresent(false);
    }

    beforeUnloadHandler() {
        // If the game is over, remove all game data from the local storage, and return
        if (this.gameOver) {
            deleteGameData();
            return
        }

        // Save the current player to the local storage when the user closes the game
        setLastPlayer(this.currentPlayer);
    }

    set currentPlayer(player) {
        // Set the current player
        this.setState({
            currentPlayer: player
        });
    }

    get currentPlayer() {
        // Return the current player
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
        // Return the player that won the game
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

        // If the user presses the escape key on the keyboard, and the game is not over, toggle the component to the escape menu
        const key = ev.key;
        if (
            key === "Escape" &&
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
                    gameDataPresent={this.props.gameDataPresent}
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