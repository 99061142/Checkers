import { Component } from 'react';
import Stone from './Stone';
import { getStonesInformationData, setStonesInformationData } from './gameData';

class Stones extends Component {
    constructor() {
        super();
        this.state = {
            stonesInformation: {}, // Object to store the information of all the stones. It will be set in the componentDidMount function, and will be used to render the stones, and for the game logic
            allStonesMoves: {}, // Object which is used to store all possible moves of all stones on the board
            chosenPosition: null // State that is used to store the position of the stone that is chosen, the default value is null until a stone is chosen (which would happen when the user dragged/clicked on a stone)
        };
        this.beforeUnloadHandler = this.beforeUnloadHandler.bind(this);
    }

    componentDidMount() {
        window.addEventListener('beforeunload', this.beforeUnloadHandler);

        // If there is game data present in the local storage, set the stones information to the saved game data
        // This could happen if the user loaded the game from the main menu when the previous game wasn't finished yet,
        // Or if the user closed the game and opened it again (e.g. opening the escape menu, and then going back to the game)
        if (this.props.gameDataPresent)
            this.stonesInformation = getStonesInformationData();
        else
            // If there is no saved game data present in the local storage, initialize the stones positions
            this.initializeStonesPositions()
    }

    componentWillUnmount() {
        window.removeEventListener('beforeunload', this.beforeUnloadHandler);

        // If the game is not over, and the stonesInformation object is not empty, 
        // Save the stones information to the local storage.
        //! The check if the stonesInformation object is not empty is done to prevent saving an empty object to the local storage.
        //! This happens because of the React.StrictMode, which renders the component twice in development mode, and since the stonesInformation object is empty at first, it would be saved as an empty object
        if(
            !this.props.gameOver &&
            Object.keys(this.stonesInformation).length > 0
        )
            setStonesInformationData(this.stonesInformation);
    }

    beforeUnloadHandler() {
        // Save the stones information to the local storage when the window is closed
        setStonesInformationData(this.stonesInformation);
    }

    setStoneAsKing = (position) => {
        // Set the stone as a king
        const stonesInformation = this.stonesInformation;
        const newStonesInformation = {
            ...stonesInformation,
            [position]: {
                ...stonesInformation[position],
                isKing: true
            }
        };
        this.stonesInformation = newStonesInformation;
    }

    setChosenPosition = (chosenPosition) => {
        // Set the chosenPosition state to the position of the stone that is chosen
        this.setState({
            chosenPosition
        });
    }

    get chosenPosition() {
        // Return the position of the stone that is chosen
        const chosenPosition = this.state.chosenPosition;
        return chosenPosition
    }

    get allStonesMoves() {
        // Return the allStonesMoves object which is used to store all possible moves of all stones on the board
        const allStonesMoves = this.state.allStonesMoves;
        return allStonesMoves
    }

    addStoneMoves = (stonePosition, possibleMoves) => {
        // Add the possible moves of the stone to the possible moves object,
        // This will happen at the beginning of the game, and when a stone is moved
        this.setState((prevState) => ({
            allStonesMoves: {
                ...prevState.allStonesMoves,
                [stonePosition]: possibleMoves
            }
        }));
    }

    removeStoneMoves = (stonePosition) => {
        // Remove the possible moves of the stone from the possible moves object,
        // This will happen when the stone is moved
        this.setState((prevState) => {
            const newAllStonesMoves = {...prevState.allStonesMoves};
            delete newAllStonesMoves[stonePosition];
            return {
                allStonesMoves: newAllStonesMoves
            }
        });
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
            if (!playerOneHasStonesLeft) {
                this.props.setGameOver(true);
                this.props.setWinner(2);
                return
            }

            const playerTwoHasStonesLeft = Object.values(stonesInformation).some(stoneInformation => stoneInformation.player === 2);
            if (!playerTwoHasStonesLeft) {
                this.props.setGameOver(true);
                this.props.setWinner(1);
            }
        });
    }

    initializeStonesPositions() {
        // Loop through the number of rows and columns to create the initial positions of the stones
        const tilesPerRow = this.props.tilesPerRow;
        const centerRow = tilesPerRow / 2;
        const stonesInformation = {};
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
                    const id = col + row * tilesPerRow; // The ID is used to identify the stone inside the render map. This must be done to prevent prop changes for the componentDidUpdate func inside the Stone component to cause errors
                    const pos = [row, col];
                    const player = row < centerRow ? 1 : 2;
                    stonesInformation[pos] = {
                        player,
                        isKing: false,
                        id
                    };
                }
            }
        }

        // Set the initial positions of the stones to the stonesInformation state
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
        // TODO: ADD CHECK IF THE STONE CAN CAPTURE FURTHER, IF THE GAMERULES FORCE CAPTURING, IF SO, DO NOT SWITCH THE PLAYER
        this.props.switchPlayer();
    }

    render() {
        return (
            <>
                {Object
                    .entries(this.stonesInformation)
                    .map(([stonePosStr, stoneData]) =>
                        <Stone
                            setStoneAsKing={this.setStoneAsKing}
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
                            removeStoneMoves={this.removeStoneMoves}
                            setChosenPosition={this.setChosenPosition}
                            chosenPosition={this.chosenPosition}
                            key={stoneData.id}
                        />
                    )
                }
                {this.chosenPosition && 
                    this.allStonesMoves[this.chosenPosition].map(({ endPosition, capturedPosition }, key) =>
                        <div
                            className="position-absolute"
                            style={{
                                width: `${this.props.tileDimensions.width}px`,
                                height: `${this.props.tileDimensions.height}px`,
                                top: `${this.props.tileDimensions.height * endPosition[0]}px`,
                                left: `${this.props.tileDimensions.width * endPosition[1]}px`,
                                backgroundColor: "green"
                            }}
                            onClick={() => this.moveChosenStone(endPosition, capturedPosition)}
                            onDragOver={(e) => e.preventDefault()} // Remove the 'not-allowed' cursor when dragging over this element, which is the possible move
                            key={key}
                        />
                    )
                }
            </>
        );
    }
}

export default Stones;