import { Component, createRef } from "react";
import Stone from "./Stone";

class Board extends Component {
    constructor() {
        super();
        this.state = {
            tilePixelSize: 0,
            stones: {},
            size: null // Set when mounted
        };
        this._table = createRef(null);
    }

    componentDidMount() {
        //    this.props.setBoardComponentMounted(true); //! NOT YET NEEDED

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
            const tableElement = this._table.current;
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

            // Create and set a dict with every pos that has a stone as key, 
            // and stone data (ref to the component and the player that holds the stone) as value
            const stones = {};
            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    const pos = [row, col];
                    if (!posHasStone(pos))
                        continue

                    stones[pos] = {
                        ref: createRef(null),
                        player: row < midRow ? 1 : 2
                    };
                }
            }
            this.setStones(stones);
        }
        adjustStonesPosition();
    }

    setStones = (stones) => {
        this.setState({
            stones
        });
    }

    get stones() {
        const stones = this.state.stones;
        return stones
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

    render() {
        return (
            <div
                className="position-absolute m-auto top-0 bottom-0 start-0 end-0 border border-dark"
                style={{
                    width: "75%",
                    height: "75%",
                    background: "linear-gradient(to bottom, black 50%, white 50%), linear-gradient(to right, white 50%, black 50%)",
                    backgroundBlendMode: "difference, normal",
                    backgroundSize: this.tilePixelSize * 2 + "px " + this.tilePixelSize * 2 + "px"
                }}
                ref={this._table}
            >
                {Object
                    .entries(this.stones)
                    .map(([pos, data], key) =>
                        <Stone
                            maxSize={this.tilePixelSize}
                            pos={pos.split(',').map((direction => Number(direction)))}
                            player={data.player}
                            ref={data.ref}
                            key={key}
                        />
                    )
                }
            </div>
        );
    }
}

export default Board;