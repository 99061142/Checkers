import { Component } from 'react';
import { getLastPlayer, setLastPlayer, clearGameData, LastPlayer } from './gameData.ts';
import { getInitialPlayer } from '../settings/settingsData.ts';
import GameOverOverlay from './GameOverOverlay.tsx';
import Board from './Board.tsx';


/**
 * Props for the Game component.
 * - gameDataPresent: A boolean value indicating whether the game data is present in the local storage.
 * - toggleComponent: Function to toggle the current component.
 */
interface GameProps {
    gameDataPresent: boolean;
    toggleComponent: (componentName: string) => void;
}

/**
 * State for the Game component.
 * - currentPlayer: The current player (1 or 2).
 * - gameOver: A boolean value indicating whether the game is over or not.
 * - winner: The player that won the game, or null if the game is not finished.
 */
interface GameState {
    currentPlayer: LastPlayer
    gameOver: boolean;
    winner: LastPlayer | null;
}

class Game extends Component<GameProps, GameState> {
    lastPlayerHasChanged = false; // Flag to check if the last player has been changed

    constructor(props: GameProps) {
        super(props);
        this.state = {
            currentPlayer: this.props.gameDataPresent ? getLastPlayer()! : getInitialPlayer(),
            gameOver: false,
            winner: null
        };
    }

    componentDidMount() {
        window.addEventListener('keydown', this.keydownHandler);
        window.addEventListener('beforeunload', this.beforeUnloadHandler);
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.keydownHandler);
        window.removeEventListener('beforeunload', this.beforeUnloadHandler);

        // If the last player has changed, save the current player to the local storage
        if (this.lastPlayerHasChanged) {
            this.saveGameData();
        }
    }

    /**
     * Saves the current component game data to the local storage.
     * This function is called when the game is closed.
     * 
     * Note: Only the data in the component's state is saved. Other game data which is created in other components are not saved in this function.
     * @returns {void}
     */
    saveGameData(): void {
        // If the last player has been changed, save the current player to the local storage
        if (this.lastPlayerHasChanged) {
            setLastPlayer(this.state.currentPlayer);
        }
    }

    /**
     * Handles the keydown event
     * @param {KeyboardEvent} ev - The keyboard event triggered by the user.
     * @returns {void}
     */
    keydownHandler = (ev: KeyboardEvent): void => {
        if (ev.key === "Escape" && !this.state.gameOver) {
            this.props.toggleComponent("EscapeMenu");
        }
    }

    /**
     * Sets the winner of the game.
     * @param {LastPlayer} player - The player that won the game.
     * @return {void}
     */
    setWinner = (player: LastPlayer): void => {
        this.setState({
            winner: player
        });
    }

    /**
     * Mark if the game is over or not.
     * @param {boolean} isGameOver - A boolean value indicating whether the game is over or not.
     * @return {void}
     */
    markGameOver = (isGameOver: boolean): void => {
        this.setState({
            gameOver: isGameOver
        });
    }

    /**
     * Switch the current player.
     * If the current player is 1, set it to 2, else set it to 1.
     *
     * Also marks the last player as changed, so that the player is saved to the local storage when the game is closed.
     * @return {void}
     */
    switchPlayer = (): void => {
        this.setState(prevState => ({
            currentPlayer: prevState.currentPlayer === 1 ? 2 : 1
        }));

        // Mark the last player as changed
        this.lastPlayerHasChanged = true;
    }

    /**
     * Save the game data before exiting the game if the game is not over.
     */
    beforeUnloadHandler = () => {
        // If the game is over, clear the game data, and return
        if (this.state.gameOver) {
            clearGameData();
            return
        }

        // Save the game data which is present in the component's state
        this.saveGameData();
    }

    render() {
        return (
            <>
                {this.state.gameOver && this.state.winner !== null &&
                    <GameOverOverlay 
                        toggleComponent={this.props.toggleComponent}
                        winner={this.state.winner}
                    />
                }
                <Board
                    gameDataPresent={this.props.gameDataPresent}
                    markGameOver={this.markGameOver}
                    setWinner={this.setWinner}
                    gameOver={this.state.gameOver}
                    currentPlayer={this.state.currentPlayer}
                    switchPlayer={this.switchPlayer}
                />
            </>
        )
    }
}

export default Game;