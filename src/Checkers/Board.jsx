import { Component, createRef } from "react";
import Stone from "./Stone";

class Board extends Component {
    constructor() {
        super();
        this.state = {
            tilePixelSize: 0,
            board: {},
            size: null, // Set when mounted
            movablePositions: [] // Update every board size change
        };
        this._ref = createRef(null);
    }

    componentDidMount() {
        // Set the size for the board
        this.size = 8;
    }

    get rows() {
        const rows = this.size;
        return rows
    }

    get cols() {
        const cols = this.size;
        return cols
    }

    get size() {
        const size = this.state.size;
        return size
    }

    set size(size) {
        const possibleSizes = [8, 10];
        if (
            !possibleSizes.includes(size)
        ) {
            const errorMessage = "The size of the board can only be one of this numbers (" + possibleSizes.join(', ') + ") the amount given was " + size;
            throw RangeError(errorMessage);
        }

        this.setState({
            size
        },
            () => this.adjustTable(size)
        );
    }


    // Adjust the table size and set the stones where needed.
    //! This function resets every change on the board
    adjustTable(size) {
        let rows, cols;
        rows = cols = size;
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

            // Set the size for each tile
            this.tilePixelSize = lowestSize / (rows / 2) / 2;
        }
        adjustTableSize();

        const adjustStonesPosition = () => {
            const midRow = rows / 2;
            const posHasStone = (pos) => {
                // Return if the pos on the board has a stone when initializing
                const [row, col] = pos;
                if (
                    row === midRow ||
                    row === midRow - 1
                ) {
                    return false
                }
                if (row % 2 === 0)
                    return col % 2 !== 0
                return col % 2 === 0
            }

            // Create and set a dict with every pos that has a stone as key, and which player the stone holds as value
            const board = {};
            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
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
        this.setState({
            board
        },
            () => this.movablePositions = this.currentPlayerMovablePositions
        );
    }

    get board() {
        const board = this.state.board;
        return board
    }

    set tilePixelSize(tilePixelSize) {
        this.setState({
            tilePixelSize
        });
    }

    get tilePixelSize() {
        const tilePixelSize = this.state.tilePixelSize;
        return tilePixelSize
    }

    posPlayer = (pos) => {
        // Return a RangeError if the pos is out of bounds
        if (!this.posInBounds(pos))
            throw RangeError(`The given pos (${pos}) is out of bounds.`);

        // Return which player is on the current position
        const board = this.board;
        const posData = board[pos];

        if (!posData)
            return null

        const player = board[pos].player;
        return player
    }

    posInBounds = (pos) => {
        const [row, col] = pos;
        if (
            row < 0 ||
            col < 0 ||
            row >= this.size ||
            col >= this.size
        ) {
            return false
        }
        return true
    }

    get currentPlayerMovablePositions() {
        let movablePositions = [];
        for (const [pos, posData] of Object.entries(this.board)) {
            // If the stone isn't used by the current player, continue
            if (posData.player !== this.props.currentPlayer)
                continue

            // If there are no possible moves, continue
            const possibleMoves = posData.ref.current.possibleMoves;

            if (!Object.keys(possibleMoves).length)
                continue

            // Add the stone pos to the movable positions list
            movablePositions.push(pos);
        }
        return movablePositions
    }

    get movablePositions() {
        const movablePositions = this.state.movablePositions;
        return movablePositions
    }

    set movablePositions(movablePositions) {
        this.setState({
            movablePositions
        });
    }

    componentDidUpdate(prevProps) {
        // If the player's turn is over, update the movable positions
        if (prevProps.currentPlayer !== this.props.currentPlayer)
            this.movablePositions = this.currentPlayerMovablePositions;
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
            </div>
        );
    }
}

export default Board;