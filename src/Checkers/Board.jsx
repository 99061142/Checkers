import { Component, createRef } from "react";
import Stone from "./Stone";

class Board extends Component {
    constructor() {
        super();
        this.state = {
            tilePixelSize: 0,
            stones: {},
            size: [8, 8]
        };
        this._table = createRef(null);
    }

    componentDidMount() {
        this.props.setBoardComponentMounted(true);
        this.adjustTable(this.size);
    }

    get rows() {
        const rows = this.size[0];
        return rows
    }

    get cols() {
        const cols = this.cols[0];
        return cols
    }

    get size() {
        const size = this.state.size;
        return size
    }

    set size(size) {
        this.setState({
            size
        }, () => this.adjustTable(size));
    }


    adjustTable(size) {
        const [rows, cols] = size
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
                const [row, col] = pos
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