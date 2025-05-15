import { Component } from 'react';
import Stone from './Stone';
import { getStonesInformationData, getAllGameDataPresent, setStonesInformationData } from './gameData.js';

class Stones extends Component {
    constructor() {
        super();
        this.state = {
            stonesInformation: {}, // Object to store the information of all the stones. It will be set in the componentDidMount function, and will be used to render the stones, and for the game logic
            allStonesMoves: {}, // Object which is used to store all possible moves of all stones on the board
            chosenPosition: null // State that is used to store the position of the stone that is chosen, the default value is null until a stone is chosen (which would happen when the user dragged/clicked on a stone)
        };
    }

    updateStoneInformation = (position, stoneData) => {
        // Update the stone information with new data
        const stonesInformation = this.stonesInformation;
        const newStonesInformation = {
            ...stonesInformation,
            [position]: stoneData
        };
        this.stonesInformation = newStonesInformation;
    }

    componentDidMount() {
        // Before the window is closed, save the stones information to the local storage
        window.addEventListener('beforeunload', () => setStonesInformationData(this.stonesInformation));
        
        // If there is game data present in the local storage, set the stones information to the saved game data
        // This could happen if the user loaded the game from the main menu when the previous game wasn't finished yet,
        // Or if the user closed the game and opened it again (e.g. opening the escape menu, and then going back to the game)
        if (getAllGameDataPresent())
            this.stonesInformation = getStonesInformationData();
        else
            // If there is no saved game data present in the local storage, initialize the stones positions
            this.initializeStonesPositions()
    }

    componentWillUnmount() {
        // Save the stones information to the local storage if the game was not finished yet
        if(
            !this.props.gameFinished &&
            Object.keys(this.stonesInformation).length > 0
        )
            setStonesInformationData(this.stonesInformation);
    }

    setChosenPosition = (chosenPosition) => {
        // Set the position of the stone that is chosen
        this.setState({
            chosenPosition
        });
    }

    removeStone = (position) => {
        // Remove the stone from the board
        const stonesInformation = this.stonesInformation;
        const newStonesInformation = {...stonesInformation};
        delete newStonesInformation[position];
        this.stonesInformation = newStonesInformation;
    }

    get chosenPosition() {
        // Return the position of the stone that is chosen
        const chosenPosition = this.state.chosenPosition;
        return chosenPosition
    }

    get allStonesMoves() {
        // Return an object with all the possible moves of all stones on the board
        const allStonesMoves = this.state.allStonesMoves;
        return allStonesMoves
    }

    addStoneMoves = (stonePosition, possibleMoves) => {
        // Add the possible moves of the stone to the possible moves object
        this.setState((prevState) => ({
            allStonesMoves: {
                ...prevState.allStonesMoves,
                [stonePosition]: possibleMoves
            }
        }));
    }

    get stonesInformation() {
        // Return the object with all the stones information.
        // The moves are excluded, and will be stored in the allStonesMoves object
        const stonesInformation = this.state.stonesInformation;
        return stonesInformation
    }

    set stonesInformation(stonesInformation) {
        // Set the object with all the stones information
        this.setState({
            stonesInformation
        }, () => {
            // Check if the game is over, and set the winner if so.
            // This is done by checking if there are any stones left for both players
            // If one of the players has no stones left, the game is over
            const playerOneHasStonesLeft = Object.values(stonesInformation).some(stoneInformation => stoneInformation.player === 1);
            const playerTwoHasStonesLeft = Object.values(stonesInformation).some(stoneInformation => stoneInformation.player === 2);
            if (
                !playerOneHasStonesLeft ||
                !playerTwoHasStonesLeft
            )
                this.props.setGameOver(true);
                const winner = playerOneHasStonesLeft ? 1 : 2;
                this.props.setWinner(winner);
        });
    }

    initializeStonesPositions() {
        const stonesInformation = {};
        const tilesPerRow = this.props.tilesPerRow;
        const centerRow = tilesPerRow / 2;

        // Loop through the number of rows and columns to create the initial positions of the stones
        for (let row = 0; row < tilesPerRow; row++) {
            // Skip the center row and the row above the center row
            if (
                row === centerRow ||
                row === centerRow - 1
            )
                continue

            // Add the stones information to the array based on the row and column
            for (let col = 0; col < tilesPerRow; col++) {
                if ((row + col) % 2 === 0) {
                    const pos = [row, col];
                    const player = row < centerRow ? 1 : 2;
                    stonesInformation[pos] = {
                        player,
                        isKing: false
                    };
                }
            }
        }
        this.stonesInformation = stonesInformation;
    }

    moveChosenStone = (endPosition, capturedPosition) => {
        // Update the stones information with the new position of the stone
        const stonesInformation = this.stonesInformation;
        const newStonesInformation = {
            ...stonesInformation,
            [endPosition]: stonesInformation[this.chosenPosition]
        };
        delete newStonesInformation[this.chosenPosition];

        // If a stone was captured, remove it from the stones information
        if (capturedPosition !== null)
            delete newStonesInformation[capturedPosition];

        // Set the new stones information, with the new position of the stone, and the removed stone if it was captured
        this.stonesInformation = newStonesInformation;

        // Unset the chosen position after the move is made
        this.setChosenPosition(null);

        // Switch the player after the move is made
        //! TODO: ADD CHECK IF THE STONE CAN CAPTURE FURTHER, IF THE GAMERULES FORCE CAPTURING, IF SO, DO NOT SWITCH THE PLAYER
        this.props.switchPlayer(); 
    }

    render() {
        return (
            <>
                {Object
                    .entries(this.stonesInformation)
                    .map(([stonePosStr, stoneData], key) =>
                        <Stone
                            updateStoneInformation={this.updateStoneInformation}
                            moveChosenStone={this.moveChosenStone}
                            stonesInformation={this.stonesInformation}
                            currentPlayer={this.props.currentPlayer}
                            player={stoneData.player}
                            isKing={stoneData.isKing}
                            position={stonePosStr.split(",").map(Number)}
                            tilesPerRow={this.props.tilesPerRow}
                            tileDimensions={this.props.tileDimensions}
                            allStonesMoves={this.allStonesMoves}
                            addStoneMoves={this.addStoneMoves}
                            setChosenPosition={this.setChosenPosition}
                            chosenPosition={this.chosenPosition}
                            removeStone={this.removeStone}
                            key={key}
                        />
                    )
                }
                {this.chosenPosition && 
                    this.allStonesMoves[this.chosenPosition].map(({ endPosition, capturedPosition }, key) =>
                        <div
                            onClick={() => this.moveChosenStone(endPosition, capturedPosition)}
                            className="position-absolute"
                            style={{
                                width: `${this.props.tileDimensions.width}px`,
                                height: `${this.props.tileDimensions.height}px`,
                                top: `${this.props.tileDimensions.height * endPosition[0]}px`,
                                left: `${this.props.tileDimensions.width * endPosition[1]}px`,
                                backgroundColor: "green"
                            }}
                            key={key}
                            onDragOver={(e) => e.preventDefault()} // Remove the 'not-allowed' cursor when dragging over this element, which is the possible move
                        />
                    )
                }
            </>
        );
    }
}

export default Stones;