import { Component, lazy, Suspense } from 'react';
import { getCurrentPlayer, clearGameData, CurrentPlayer, setGameData, GameData, getBoard, getInitialBoardGrid } from './gameData.ts';
import { getInitialPlayer } from '../settings/settingsData.ts';
import Board from './Board.tsx';
import LoadingFallback from '../LoadingFallback.tsx';
const GameOverOverlay = lazy(() => import('./GameOverOverlay.tsx'));

/**
 * Props for the Game component.
 * - gameDataPresent: A boolean value indicating whether the game data is present in the local storage.
 * - setGameDataPresent: Function to set the game data present flag.
 * - toggleComponent: Function to toggle the current component.
 */
interface GameProps {
    gameDataPresent: boolean;
    setGameDataPresent: (flag: boolean) => void;
    toggleComponent: (componentName: string) => void;
}

/**
 * State for the Game component.
 * - gameOver: A boolean value indicating whether the game is over or not.
 * - winner: The player that won the game, or null if the game is not finished.
 * - gameData: An object containing the game data.
 */
interface GameState {
    gameOver: boolean;
    winner: CurrentPlayer | null;
    gameData: GameData
}

class Game extends Component<GameProps, GameState> {
    // Flag which indicdates if a change has been made to the game data.
    gameHasChanged = false;

    constructor(props: GameProps) {
        super(props);
        this.state = {
            gameOver: false,
            winner: null,
            gameData: {
                currentPlayer: this.props.gameDataPresent ? getCurrentPlayer()! : getInitialPlayer(),
                board: this.props.gameDataPresent ? getBoard()! : getInitialBoardGrid()
            }
        };
    }

    /**
     * @return {void}
     */
    componentDidMount(): void {
        window.addEventListener('keydown', this.keydownHandler);
        window.addEventListener('beforeunload', this.beforeUnloadHandler);
    }

    /**
     * Lifecycle method that is called when the component is about to be unmounted.
     * - If the game is not over, it will save the game data to the local storage.
     * - If the game is over, it will clear the game data from the local storage.
     * @return {void}
     */
    componentWillUnmount(): void {
        window.removeEventListener('keydown', this.keydownHandler);
        window.removeEventListener('beforeunload', this.beforeUnloadHandler);

        // If the game is over, clear the game data, otherwise save it if the game has changed.
        if (this.state.gameOver) {
            clearGameData();
            this.props.setGameDataPresent(false);
        } else {
            this.saveGameData();
        }
    }

    /**
     * Saves the game data to the local storage if the game has been changed.
     * @returns {void}
     */
    saveGameData(): void {
        // If the game has been changed, save the game data to the local storage
        if (this.gameHasChanged) {
            setGameData(this.state.gameData);
        }
    }

    /**
     * Handler for the keydown event.
     * @param {KeyboardEvent} ev - The keyboard event triggered by the user.
     * @returns {void}
     */
    keydownHandler = (ev: KeyboardEvent): void => {
        // If the Escape key is pressed and the game is not over, toggle the escape menu component
        if (ev.key === "Escape" && !this.state.gameOver) {
            this.props.toggleComponent("escapeMenu");
        }
    }

    /**
     * Sets the winner of the game in the component's state, and set the gameOver state to true.
     * @param {CurrentPlayer} player - The player that won the game.
     * @return {void}
     */
    setWinner = (player: CurrentPlayer): void => {
        this.setState({
            winner: player,
            gameOver: true
        });
    }

    /**
     * Sets the game data in the component's state.
     * 
     * This function also marks that the game has been changed, which is used to determine if the game data should be saved when the component is unmounted.
     * @param {GameData} gameData - The game data object containing the current player and grid of the board.
     * @returns {void}
     */
    setGameData = (gameData: GameData): void => {
        this.setState({
            gameData
        }, () => {
            // Mark that the game data has been changed.
            // This is used to determine if the game data should be saved when the component is unmounted
            this.gameHasChanged = true;

            // Mark the game data as present.
            // This is used to determine if some settings could be changed, or if we could load a saved game
            this.props.setGameDataPresent(true);
        });
    }

    /**
     * Handler for the beforeunload event.
     * @return {void}
     */
    beforeUnloadHandler = (): void => {
        // If the game is not over, save the game data to the local storage
        if (!this.state.gameOver) {
            this.saveGameData();
        }
    }

    render() {
        return (
            <>
                {this.state.gameOver && this.state.winner !== null &&
                    <Suspense 
                        fallback={<LoadingFallback />}
                    >
                        <GameOverOverlay 
                            toggleComponent={this.props.toggleComponent}
                            winner={this.state.winner}
                            setGameDataPresent={this.props.setGameDataPresent}
                        />
                    </Suspense>
                }
                <Board
                    gameData={this.state.gameData}
                    setGameData={this.setGameData}
                    gameDataPresent={this.props.gameDataPresent}
                    setWinner={this.setWinner}
                    gameOver={this.state.gameOver}
                />
            </>
        )
    }
}

export default Game;