import { Component } from 'react';
import Stone from './Stone';

class Stones extends Component {
    constructor() {
        super();
        this.state = {
            stonesInformation: {}, // This is used to store the information (key=pos, value=player) of the stones (e.g. {'0,0': 1}=player 1 has a stone on pos 1). It will be set when the component is mounted
            stoneChosenData: null // This is used to store an object with the (pos / possible moves) of the stone that is chosen, It will be set when the user selects a stone, the initial value or when no stone is selected, the value is null
        };
    }

    componentDidMount() {
        // Initialize the stones positions
        this.initializeStonesPositions();
    }

    setStoneChosenData = (stoneChosenData) => {
        // Set the data of the stone that is chosen,
        // If a stone is chosen, the above parameter is an object with the position of the stone and the possible moves,
        // If no stone is chosen, the above parameter is null
        this.setState({
            stoneChosenData
        });
    }

    get stoneChosenData() {
        const stoneChosenData = this.state.stoneChosenData;
        return stoneChosenData
    }

    get stonesInformation() {
        const stonesInformation = this.state.stonesInformation;
        return stonesInformation
    }

    set stonesInformation(stonesInformation) {
        this.setState({
            stonesInformation
        });
    }

    initializeStonesPositions() {
        const stonesInformation = [];
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
                    stonesInformation[pos] = player;
                }
            }
        }
        this.stonesInformation = stonesInformation;
    }

    moveChosenStone = (chosenPosition) => {
        // Move the chosen stone to the chosen position
        const currentPosition = this.stoneChosenData.position;
        const stonesInformation = this.stonesInformation;

        // Update the stones information with the new position of the stone
        const newStonesInformation = {
            ...stonesInformation,
            [chosenPosition]: stonesInformation[currentPosition]
        };
        delete newStonesInformation[currentPosition];
        this.stonesInformation = newStonesInformation;

        // Delete the chosen stone data after the move is made
        this.setStoneChosenData(null);

        // Switch the player after the move is made
        this.props.switchPlayer(); 
    }

    render() {
        return (
            <>
                {Object
                    .entries(this.stonesInformation)
                    .map(([stonePosStr, player], key) =>
                        <Stone
                            moveChosenStone={this.moveChosenStone}
                            stoneChosenData={this.stoneChosenData}
                            setStoneChosenData={this.setStoneChosenData}
                            stonesInformation={this.stonesInformation}
                            currentPlayer={this.props.currentPlayer}
                            player={player}
                            position={stonePosStr.split(",").map(Number)}
                            tilesPerRow={this.props.tilesPerRow}
                            tileDimensions={this.props.tileDimensions}
                            key={key}
                        />
                    )
                }
                {this.stoneChosenData && 
                    this.stoneChosenData.possibleMoves.map((possibleMove, key) =>
                        <div
                            onClick={() => this.moveChosenStone(possibleMove)}
                            className="position-absolute"
                            style={{
                                width: `${this.props.tileDimensions.width}px`,
                                height: `${this.props.tileDimensions.height}px`,
                                top: `${this.props.tileDimensions.height * possibleMove[0]}px`,
                                left: `${this.props.tileDimensions.width * possibleMove[1]}px`,
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