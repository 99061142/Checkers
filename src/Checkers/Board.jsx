import { Component, createRef } from "react";
import Stone from "./Stone";
import PossibleMove from "./PossibleMove";

class Board extends Component {
    constructor() {
        super();
        this.state = {
            tilePixelSize: 0,
            board: {},
            size: null, // Set when mounted
            movablePositions: [], // Set when mounted & every size change
            chosenStoneData: null
        };
        this._ref = createRef(null);
    }

    componentDidMount() {
        // Set the size for the board
        this.size = 8;
    }

    componentDidUpdate(prevProps) {
        // If the current player is changed, update the movable positions to the current player
        if (prevProps.currentPlayer !== this.props.currentPlayer)
            this.movablePositions = this.currentPlayerMovablePositions;
    }

    get rows() {
        // Return the amount of rows on the board
        const rows = this.size;
        return rows
    }

    get cols() {
        // Return the amount of columns for 1 row on the board
        const cols = this.size;
        return cols
    }

    get size() {
        // Return the size (rows x columns) of the board
        const size = this.state.size;
        return size
    }

    set size(size) {
        // Set the size (rows x columns) of the board.
        // And adjust the table size based on the set size.
        //! The stones on the board gets adjusted to the new size. This implies that the game got reset
        this.setState({
            size
        },
            () => this.adjustTable()
        );
    }

    adjustTable() {
        const adjustTableSize = () => {
            // Assign the lowest size between the width and height as width and height size.
            //! This is needed to create a board with only the given rows and columns
            const tableElement = this._ref.current;
            const tableRect = tableElement.getBoundingClientRect();
            const lowestSize = Math.min(tableRect.width, tableRect.height);
            Object.assign(
                tableElement.style,
                {
                    height: lowestSize + "px",
                    width: lowestSize + "px"
                }
            );

            // Set the state to the pixel size for 1 tile.
            // This state gets used to render the board background (each tile),
            // and as prop for the Stone compontent to calculate the stone size
            this.tilePixelSize = lowestSize / (this.size / 2) / 2;
        }
        adjustTableSize();

        const adjustStonesPosition = () => {
            //! This function only works when the rows are divisible by 2 
            const midRow = this.rows / 2;
            const posHasStone = (pos) => {
                // Return if the pos on the board has a stone when initializing
                const [row, col] = pos;
                if (
                    row === midRow ||
                    row === midRow - 1
                )
                    return false

                if (row % 2 === 0)
                    return col % 2 !== 0
                return col % 2 === 0
            }

            // Create and set a dict with every pos that has a stone as key, 
            // and the Stone component ref & which player the stone holds as value
            const board = {};
            for (let row = 0; row < this.size; row++) {
                for (let col = 0; col < this.cols; col++) {
                    const pos = [row, col];
                    if (!posHasStone(pos))
                        continue

                    const player = row < midRow ? 1 : 2;
                    board[pos] = {
                        ref: createRef(null),
                        player
                    };
                }
            }
            this.setBoard(board);
        }
        adjustStonesPosition();
    }

    setBoard = (board) => {
        // Set the board.
        // (dict with every pos that has a stone as key, and the Stone component ref & which player the stone holds as value).
        // And set the movable positions based on the (new) board layout
        this.setState({
            board
        },
            () => this.movablePositions = this.currentPlayerMovablePositions
        );
    }

    get board() {
        // Return a dict with every pos that has a stone as key, 
        // and the Stone component ref & which player the stone holds as value
        const board = this.state.board;
        return board
    }

    set tilePixelSize(tilePixelSize) {
        // Set the pixel size of 1 board tile
        this.setState({
            tilePixelSize
        });
    }

    get tilePixelSize() {
        // Get the pixel size of 1 board tile
        const tilePixelSize = this.state.tilePixelSize;
        return tilePixelSize
    }

    posPlayer = (pos) => {
        // Return an error if the pos is out of bounds
        if (!this.posInBounds(pos))
            throw RangeError(`The given pos (${pos}) is out of bounds.`);

        const board = this.board;
        const posData = board[pos];

        // If there isn't a stone on the given parameter position, return null
        if (!posData)
            return null

        // Return which player is on the given parameter position
        const player = board[pos].player;
        return player
    }

    posInBounds = (pos) => {
        // Return if the given parameter pos is in bounds
        const [row, col] = pos;
        const inBounds = (
            row >= 0 &&
            col >= 0 &&
            row < this.rows &&
            col < this.cols
        )
        return inBounds
    }

    get currentPlayerMovablePositions() {
        // Return a list with every position that the current player can move the stone from.
        //! The possible moves of a stone is calcualated inside the Stone component (possibleMoves getter)
        let movablePositions = [];
        for (const [pos, posData] of Object.entries(this.board)) {
            // If the stone isn't used by the current player, continue
            if (posData.player !== this.props.currentPlayer)
                continue

            // If the stone has no possible moves, continue
            const possibleMoves = posData.ref.current.possibleMoves;
            if (!Object.keys(possibleMoves).length)
                continue

            // Add the stone pos to the movable positions list
            movablePositions.push(pos);
        }
        return movablePositions
    }

    get movablePositions() {
        // Return a list with every stone position that can be moved
        const movablePositions = this.state.movablePositions;
        return movablePositions
    }

    set movablePositions(movablePositions) {
        // Set the list with every stone position that can be moved
        this.setState({
            movablePositions
        });
    }


    get chosenStoneData() {
        // Return a dict with the startPos (stone position that is chosen), and endPos (all position the stone can move to)
        // If the player has chose a stone (clicked 1 time on the stone), or is dragging a stone. Else return null
        const chosenStoneData = this.state.chosenStoneData;
        return chosenStoneData
    }

    setChosenStoneData = (data, moved) => {
        // If the stone is moved (user chose a new position for the stone), switch the current player
        if (moved)
            this.props.switchCurrentPlayer();

        // Set the dict with the startPos (stone position that is chosen), and endPos (all position the stone can move to)
        this.setState({
            chosenStoneData: data
        });
    }

    render() {
        return (
            <div
                ref={this._ref}
                className="position-absolute m-auto top-0 bottom-0 start-0 end-0 border border-dark"
                style={{
                    width: "75%",
                    height: "75%",
                    background: "linear-gradient(to bottom, black 50%, white 50%), linear-gradient(to right, white 50%, black 50%)",
                    backgroundBlendMode: "difference, normal",
                    backgroundSize: this.tilePixelSize * 2 + "px " + this.tilePixelSize * 2 + "px"
                }}
            >
                {Object
                    .entries(this.board)
                    .map(([pos, { ref, player }]) =>
                        <Stone
                            ref={ref}
                            setChosenStoneData={this.setChosenStoneData}
                            chosenStoneData={this.chosenStoneData}
                            posPlayer={this.posPlayer}
                            posInBounds={this.posInBounds}
                            maxSize={this.tilePixelSize}
                            pos={pos.split(',').map((v => Number(v)))}
                            player={player}
                            movablePositions={this.movablePositions}
                            key={pos}
                        />
                    )
                }

                {this.chosenStoneData && this.chosenStoneData.endPositions
                    .map((endPos, key) =>
                        <PossibleMove
                            setBoard={this.setBoard}
                            setChosenStoneData={this.setChosenStoneData}
                            board={this.board}
                            maxSize={this.tilePixelSize}
                            startPos={this.chosenStoneData.startPos}
                            endPos={endPos}
                            key={key}
                        />
                    )}
            </div>
        );
    }
}

export default Board;