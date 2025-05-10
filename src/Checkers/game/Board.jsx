import { Component } from 'react';
import { getSettings } from '../settings/settingsData';
import Stones from './Stones';
const settings = getSettings(); // Get the settings object from the settingsData.js file

class Board extends Component {
    constructor() {
        super();
        this.state = {
            boardDimensions: null
        };
        this.updateBoardDimensions = this.updateBoardDimensions.bind(this);
    }

    get boardDimensions() {
        const boardDimensions = this.state.boardDimensions;
        return boardDimensions
    }

    get tileDimensions() {
        const boardDimensions = this.boardDimensions; // Get the current dimensions of the board from the state
        const tilePerRow = this.tilesPerRow(); // Get the number of tiles per row from the tilesPerRow function
        const tileSizePixels = Math.floor(boardDimensions.width / tilePerRow); // The tile size is the board size divided by the number of tiles per row, rounded down to the nearest integer
        const tileDimensions = {
            width: tileSizePixels,
            height: tileSizePixels
        };
        return tileDimensions
    }

    componentDidMount() {
        // Add an event listener for window resize to update the board dimensions when the window is resized
        window.addEventListener('resize', this.updateBoardDimensions.bind(this));
        
        // Initialize the board (including the tiles, stones, etc) sizes
        this.updateBoardDimensions();
    }

    componentWillUnmount() {
        // Remove the event listener for window resize when the component is unmounted
        window.removeEventListener('resize', this.updateBoardDimensions.bind(this));
    }

    updateBoardDimensions() {
        // Update the board dimensions when the window is resized, based on the current size of the window
        const boardDimensions = this.calculateBoardDimensions();
        this.setState({
            boardDimensions: boardDimensions
        });
    }

    tilesPerRow() {
        // Get the number of tiles per row from the settings object which is stored in the current component state
        const tilesPerRow = settings.boardSize;
        return tilesPerRow
    }

    calculateBoardDimensions() {
        const boardSizepercentage = 75; // The highest board size percentage is 75% of the the screen size

        // Set the variables of the maximum height and width of the board, based on the boardSizepercentage value set above
        const maxBoardHeight = Math.floor(window.innerHeight * (boardSizepercentage / 100));
        const maxBoardWidth = Math.floor(window.innerWidth * (boardSizepercentage / 100));

        // Choose smallest size between the height and width of the screen, and set it to the highestBoardSizePixel variable
        // This is so that the board is always a square
        const highestBoardSizePixels = Math.floor(Math.min(maxBoardHeight, maxBoardWidth) / this.tilesPerRow()) * this.tilesPerRow();

        // Return the width and height of the board based on the highestBoardSizePixels variable,
        // Which we calculated above
        const boardDimensions = {
            width: highestBoardSizePixels,
            height: highestBoardSizePixels
        };
        return boardDimensions
    }
    
    render() {
        // If the board dimensions are not set, return null
        // This only happens when the component is first mounted, and the board dimensions are not set yet
        const boardDimensions = this.boardDimensions;
        if (boardDimensions === null) 
            return null;

        const tileDimensions = this.tileDimensions; // Get the tile dimensions from the tileDimensions function
        return (
            <div
                className="position-absolute m-auto top-0 bottom-0 start-0 end-0 border border-dark"
                id="board"
                style={{
                    width: `${boardDimensions.width}px`,
                    height: `${boardDimensions.height}px`,
                    background: "linear-gradient(to bottom, black 50%, white 50%), linear-gradient(to right, white 50%, black 50%)",
                    backgroundBlendMode: "difference, normal",
                    backgroundSize: `${tileDimensions.width * 2}px ${tileDimensions.height * 2}px`
                }}
            >
                <Stones
                    switchPlayer={this.props.switchPlayer}
                    currentPlayer={this.props.currentPlayer}
                    tileDimensions={tileDimensions}
                    tilesPerRow={this.tilesPerRow()}
                />
            </div>
        );
    }
}

export default Board;