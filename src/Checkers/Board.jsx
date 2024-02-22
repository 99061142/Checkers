import { Component, createRef } from "react";
import Stone from "./Stone";

class Board extends Component {
    constructor() {
        super();
        this.state = {
            tilePixelSize: 0,
            stones: []
        };
        this._table = createRef(null);

        //! Use the same value [8, 10] for the "rows" and "cols" var
        this._rows = 8;
        this._cols = 8;
    }

    componentDidMount() {
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
            this.tilePixelSize = lowestSize / (this._rows / 2) / 2;
        }
        adjustTableSize();


        const midRow = this._rows / 2;
        const posHasStone = (row, col) => {
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

        const stones = []
        for (let row = 0; row < this._rows; row++) {
            const stonesRow = [];
            for (let col = 0; col < this._cols; col++) {
                const stoneData = posHasStone(row, col) ? {
                    ref: createRef(null),
                    player: row < midRow ? 1 : 2
                } : null
                stonesRow.push(stoneData)
            }
            stones.push(stonesRow)
        }
        this.setStones(stones);
    }

    setStones = (stones) => {
        this.setState({
            stones
        })
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
                {this.stones
                    .map((stonesRow, row) =>
                        stonesRow
                            .map((stoneData, col) =>
                                stoneData !== null &&
                                <Stone
                                    pos={[row, col]}
                                    maxSize={this.tilePixelSize}
                                    player={stoneData.player}
                                    ref={stoneData.ref}
                                    key={col}
                                />
                            )
                    )
                }
            </div>
        );
    }
}

export default Board;