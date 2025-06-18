import { Component } from 'react';
import { getBoardSize } from '../settings/settingsData.ts';
import { LastPlayer } from './gameData.ts';
import Stones from './Stones.tsx';

/**
 * Props for the Board component.
 * - gameDataPresent: A boolean value indicating whether the game data is present in the local storage.
 * - markGameOver: Function to mark the game as over.
 * - setWinner: Function to set the winner of the game.
 * - currentPlayer: The current player (1 or 2).
 * - gameOver: A boolean value indicating whether the game is over or not.
 * - switchPlayer: Function to switch the current player.
 */
interface BoardProps {
    gameDataPresent: boolean;
    markGameOver: (isGameOver: boolean) => void;
    setWinner: (player: LastPlayer) => void;
    currentPlayer: LastPlayer;
    gameOver: boolean;
    switchPlayer: () => void;
}

/**
 * State for the Board component.
 * - boardPixelSize: The size of the board in pixels, this will be the same for both the width and height of the board.
 * - tilePixelSize: The size of the tiles in pixels, this will be the same for both the width and height of the tiles.
 */
interface BoardState {
    boardPixelSize: number;
    tilePixelSize: number;
}

class Board extends Component<BoardProps, BoardState> {
    boardHasChanged = false; // Flag to check if the board has changed
    boardSize = getBoardSize(); // Number of tiles per row and column on the board

    constructor(props: BoardProps) {
        super(props);
        this.state = {
            boardPixelSize: 0,
            tilePixelSize: 0
        };
    }

    componentDidMount() {
        window.addEventListener('resize', this.resizeHandler);

        // Initialize the board and tile sizes when the component mounts
        this.updateBoardPixelSizes();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resizeHandler);
    }

    /**
     * Handles the window resize event to update the board and tile sizes.
     * @returns {void}
     */
    resizeHandler = (): void => {
        // Update the board and tile sizes when the window is resized
        this.updateBoardPixelSizes();   
    }

    /**
     * Initializes and updates the board and tile sizes based on the current window size.
     * This will ensure that the board is always a square and that the tiles are always the same size.
     * @returns {void}
     */
    updateBoardPixelSizes(): void {
        // Percentage of the parent container that the board should occupy
        const boardSizePercentOfContainer = 75;

        // Set the maximum board height and width based on the window size and the percentage of the container
        const maxBoardHeight = Math.floor(window.innerHeight * (boardSizePercentOfContainer / 100));
        const maxBoardWidth = Math.floor(window.innerWidth * (boardSizePercentOfContainer / 100));

        // Choose the smallest size between the height and width of the screen.
        // This will ensure that the board is always a square, and that the tiles are always the same size
        const boardPixelSize = Math.floor(Math.min(maxBoardHeight, maxBoardWidth) / this.boardSize) * this.boardSize;

        // Calculate the tile size based on the board size divided by the number of tiles per row/column
        const tilePixelSize = Math.floor(boardPixelSize / this.boardSize);

        // Set the state with the calculated sizes
        this.setState({
            boardPixelSize,
            tilePixelSize
        });
    }

    render () {
        return (
            <div
                className="position-absolute m-auto top-0 bottom-0 start-0 end-0 border border-dark"
                data-testid="board"
                style={{
                    width: `${this.state.boardPixelSize}px`,
                    height: `${this.state.boardPixelSize}px`,
                    background: "linear-gradient(to bottom, black 50%, white 50%), linear-gradient(to right, white 50%, black 50%)",
                    backgroundBlendMode: "difference, normal",
                    backgroundSize: `${this.state.tilePixelSize * 2}px ${this.state.tilePixelSize * 2}px`
                }}
            >
                <Stones
                    tileSize={this.state.tilePixelSize}
                    gameDataPresent={this.props.gameDataPresent}
                    markGameOver={this.props.markGameOver}
                    setWinner={this.props.setWinner}
                    currentPlayer={this.props.currentPlayer}
                    switchPlayer={this.props.switchPlayer}
                />
            </div>
        )
    }
}

export default Board;