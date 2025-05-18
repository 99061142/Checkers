import { Component } from 'react';
import { getSettings } from '../settings/settingsData';
import Stones from './Stones';
const boardSize = getSettings().boardSize;

class Board extends Component {
    constructor() {
        super();
        this.state = {
            boardDimensions: 0 // Set the initial board dimensions to 0, Inside the componentDidMount function. The board dimensions will be set based on the window size
        };
    }

    windowResizeHandler = () => {
        // Update the board dimensions based on the new window size
        this.updateBoardDimensions();
    }

    componentDidMount() {
        window.addEventListener('resize', this.windowResizeHandler);
        
        // Initialize the board (including the tiles, stones, etc) size
        // Without this, the board size would be 0, and the board would not be set correctly, which would cause the game to not work.
        // The stone size would be calculated based on the tileDimensions, which will be given as a prop to the Stones and Stone components
        this.updateBoardDimensions();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.windowResizeHandler);
    }

    get boardDimensions() {
        // Return the dimensions of the board,
        // It only includes the width and height of the board, which is calculated in the updateBoardDimensions function, and called to the boardDimensions setter
        const boardDimensions = this.state.boardDimensions;
        return boardDimensions
    }

    set boardDimensions(boardDimensions) {
        // Set the dimensions of the board, which is used to calculate the size of the tiles
        this.setState({
            boardDimensions
        });
    }

    get tileDimensions() {
        const boardDimensions = this.boardDimensions; // Get the width and height of the board
        const tilePerRow = this.tilesPerRow; // Get the number of tiles per row
        const tileSizePixels = Math.floor(boardDimensions.width / tilePerRow); // The tile size is the board size divided by the number of tiles per row, rounded down to the nearest integer
        
        // Return the tile width and height in pixels, which will render the tiles on the board with the background attribute,
        // and will also be send as a prop to the Stones and Stone components, which will be used to calculate the size of the stones, position of the stones, and render a tile where the user can move the stone to
        const tileDimensions = {
            width: tileSizePixels,
            height: tileSizePixels
        };
        return tileDimensions
    }

    updateBoardDimensions() {
        const calculateBoardDimensions = () => {
            // Set the variables of the maximum height and width of the board, based on the highest board size percentage, which is 75% of the screen size
            const boardSizepercentage = 75;
            const maxBoardHeight = Math.floor(window.innerHeight * (boardSizepercentage / 100));
            const maxBoardWidth = Math.floor(window.innerWidth * (boardSizepercentage / 100));

            // Choose smallest size between the height and width of the screen.
            // This makes sure that the board is always a square, and that the tiles are always the same size
            const highestBoardSizePixels = Math.floor(Math.min(maxBoardHeight, maxBoardWidth) / this.tilesPerRow) * this.tilesPerRow;

            // Return the width and height of the board based on the highestBoardSizePixels variable which we calculated above.
            // This will always be the same value for the width and height, because the board is a square
            const boardDimensions = {
                width: highestBoardSizePixels,
                height: highestBoardSizePixels
            };
            return boardDimensions
        }

        // Set the board dimensions to the calculated board dimensions
        this.boardDimensions = calculateBoardDimensions();
    }

    get tilesPerRow() {
        // Return the number of the tiles per row.
        // The returned number will also be the number of tiles per column, because the board is a square
        // So we use this getter for both the row and column
        const tilesPerRow = boardSize;
        return tilesPerRow
    }

    render() {
        const tileDimensions = this.tileDimensions; // Variable with the width and height of the tiles, which we use to render the tiles, and pass as a prop to the Stones component to render the stones
        return (
            <div
                className="position-absolute m-auto top-0 bottom-0 start-0 end-0 border border-dark"
                id="board"
                style={{
                    width: `${this.boardDimensions.width}px`,
                    height: `${this.boardDimensions.height}px`,
                    background: "linear-gradient(to bottom, black 50%, white 50%), linear-gradient(to right, white 50%, black 50%)",
                    backgroundBlendMode: "difference, normal",
                    backgroundSize: `${tileDimensions.width * 2}px ${tileDimensions.height * 2}px`
                }}
            >
                <Stones
                    gameDataPresent={this.props.gameDataPresent}
                    gameOver={this.props.gameOver}
                    setGameOver={this.props.setGameOver}
                    setWinner={this.props.setWinner}
                    switchPlayer={this.props.switchPlayer}
                    currentPlayer={this.props.currentPlayer}
                    tileDimensions={tileDimensions}
                    tilesPerRow={this.tilesPerRow}
                />
            </div>
        );
    }
}

export default Board;