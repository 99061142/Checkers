import { Component } from 'react';
import { getBoardSize } from '../settings/settingsData.ts';
import { CurrentPlayer, GameData } from './gameData.ts';
import Stones from './Stones.tsx';

/**
 * Props for the Board component.
 * - gameDataPresent: A boolean value indicating whether the game data is present in the local storage.
 * - setWinner: Function to set the winner of the game.
 * - gameData: The game data object containing the current player and board state.
 * - gameOver: A boolean value indicating whether the game is over or not.
 * - setGameData: Function to set the game data.
 */
interface BoardProps {
    gameDataPresent: boolean;
    setWinner: (player: CurrentPlayer) => void;
    gameData: GameData;
    gameOver: boolean;
    setGameData: (gameData: GameData) => void;
}

/**
 * State for the Board component.
 * - boardPixelSize: The size of the board in pixels. This will be the same for both the width and height of the board.
 * - tilePixelSize: The size of the tiles in pixels. This will be the same for both the width and height of the tiles.
 */
interface BoardState {
    boardPixelSize: number;
    tilePixelSize: number;
}

class Board extends Component<BoardProps, BoardState> {
    // The number of tiles per row and column on the board
    boardSize = getBoardSize();

    constructor(props: BoardProps) {
        super(props);
        this.state = {
            boardPixelSize: 0,
            tilePixelSize: 0
        };
    }

    componentDidMount() {
        window.addEventListener('resize', this.resizeHandler);

        // Initialize the board and tile sizes when the component is mounted
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
     * Set the board and tile sizes based on the current window size.
     * This will ensure that the board and tiles are always a square.
     * @returns {void}
     */
    updateBoardPixelSizes(): void {
        // Percentage of the parent container which the board should occupy
        const boardSizePercentageOfContainer = 75;

        // Set the maximum board height and width based on the window size and the percentage we want the board to occupy
        const maxBoardHeight = Math.floor(window.innerHeight * (boardSizePercentageOfContainer / 100));
        const maxBoardWidth = Math.floor(window.innerWidth * (boardSizePercentageOfContainer / 100));

        // Choose the smallest size between the height and width of the screen.
        // This will ensure that the board is always a square
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
                    setWinner={this.props.setWinner}
                    tileSize={this.state.tilePixelSize}
                    gameDataPresent={this.props.gameDataPresent}
                    gameData={this.props.gameData}
                    setGameData={this.props.setGameData}
                />
            </div>
        )
    }
}

export default Board;