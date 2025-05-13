// empty class for the game
import { Component } from 'react';
import Board from './Board.jsx';
import { getLastCurrentPlayer, setLastCurrentPlayer, getAllGameDataPresent, removeAllGameData } from './gameData.js';
import { getSettings } from '../settings/settingsData.js';

class Game extends Component {
    constructor() {
        super();
        this.state = {
            currentPlayer: null, // Set the initial player based on the default settings. This could be changed in the componentDidMount() method if a game was not finished yet, which would load the last player
            gameFinished: false // This is used to check if the game is finished or not
        }
        this.keyPressed = this.keyPressed.bind(this);
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
        
        // Before the window is closed, save the current player to the local storage
        window.addEventListener('beforeunload', () => setLastCurrentPlayer(this.currentPlayer));
        
        // Initialize the current player based on the default settings, or the last player that played if a game was not finished yet
        this.currentPlayer = getAllGameDataPresent() ? getLastCurrentPlayer() : getSettings().initialPlayer;
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.keyPressed);

        // If the game is finished, remove all game data from the local storage
        if (this.gameFinished)
            removeAllGameData();

        // If the player was initialized, and the game is closed, save the current player to the local storage
        // This initializion must be set because of the react strict mode, which calls the componentDidMount() twice
        // And will also call this function, while the initialization was not yet set for the current player, which would return in that the current player is null
        if (this.currentPlayer !== null)
            setLastCurrentPlayer(this.currentPlayer);
    }

    async keyPressed(ev) {
        // await function to not overload the event loop
        await new Promise(resolve => setTimeout(resolve, 0));

        if (ev.key === "Escape")
            this.props.toggleComponent("EscapeMenu");
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