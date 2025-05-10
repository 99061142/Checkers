// empty class for the game
import { Component } from 'react';
import Board from './Board.jsx';
import { getLastCurrentPlayer, setLastCurrentPlayer, getAllGameDataPresent, removeAllGameData } from './gameData.js';
import { getSettings } from '../settings/settingsData.js';

class Game extends Component {
    constructor() {
        super();
        this.state = {
            currentPlayer: getSettings().initialPlayer, // Set the initial player based on the default settings. This could be changed in the componentDidMount() method if a game was not finished yet, which would load the last player
            gameFinished: false // This is used to check if the game is finished or not
        }
        this.keyPressed = this.keyPressed.bind(this);
    }

    set currentPlayer(currentPlayer) {
        // Set the current player
        this.setState({
            currentPlayer: currentPlayer
        });
    }

    get currentPlayer() {
        // Get the current player from the state
        const currentPlayer = this.state.currentPlayer;
        return currentPlayer
    }

    get gameFinished() {
        // Return if the game is finished
        const gameFinished = this.state.gameFinished;
        return gameFinished
    }

    set gameFinished(bool) {
        // Set if the game is finished
        this.setState({
            gameFinished: bool
        });
    }

    switchPlayer = () => {
        // If the current player is 1, set it to 2, else set it to 1
        this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
    }

    componentDidMount() {
        window.addEventListener('keydown', this.keyPressed);

        // If there is game data present in the local storage, set the current player to the last current player
        // This could happen if the user loaded the game from the main menu when the previous game wasn't finished yet,
        // Or if the user closed the game and opened it again (e.g. opening the escape menu, and then going back to the game)
        if (getAllGameDataPresent())
            this.currentPlayer = getLastCurrentPlayer();
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.keyPressed);

        // Save the currentPlayer to the local storage if the game was not finished yet,
        // Else remove all game data from the local storage
        if (!this.gameFinished)
            setLastCurrentPlayer(this.currentPlayer);
        else
            removeAllGameData();
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
                gameFinished={this.gameFinished}
                currentPlayer={this.currentPlayer}
                switchPlayer={this.switchPlayer}
            />
        );
    }
}

export default Game;