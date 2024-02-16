import { Component, createRef } from "react";
import Tile from "./Tile";

class Board extends Component {
    constructor() {
        super();
        this.state = {
            tiles: []
        };
        this.rows = 8; //! The value can only be 8 or 10
        this.cols = 8; //! The value can only be 8 or 10
        this._table = createRef(null);

        // Board size error handling
        if (
            this.rows !== 8 &&
            this.rows !== 10
        ) {
            throw RangeError("The board can only have 8 or 10 rows. The amount of rows given was " + this.rows);
        }
        if (
            this.cols !== 8 &&
            this.cols !== 10
        ) {
            throw RangeError("The board can only have 8 or 10 cols. The amount of cols given was " + this.cols);
        }
    }

    componentDidMount() {
        const adjustTableSize = () => {
            // Assign the lowest size between the width and height as width and height size.
            //! The culcalation is needed to make an even square for each tile
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
        }
        adjustTableSize();

        const renderTiles = () => {
            // Create references for each tile on the board.
            // The references gets saved in a 2d list as a state named "tiles"
            const tiles = [];
            for (let row = 0; row < this.rows; row++) {
                const tilesRow = [];
                for (let col = 0; col < this.cols; col++) {
                    tilesRow.push(createRef(null));
                }
                tiles.push(tilesRow);
            }
            this.tiles = tiles;
        }
        renderTiles();
    }

    set tiles(tiles) {
        this.setState({
            tiles
        });
    }

    get tiles() {
        const tiles = this.state.tiles;
        return tiles
    }

    render() {
        return (
            <table
                ref={this._table}
                className="position-absolute m-auto top-0 bottom-0 start-0 end-0"
                style={{
                    width: "75%",
                    height: "75%"
                }}
            >
                <tbody>
                    {this.tiles
                        .map((rowTiles, row) =>
                            <tr
                                key={row}
                            >
                                {rowTiles
                                    .map((ref, col) =>
                                        <Tile
                                            board={this.props.board}
                                            row={row}
                                            col={col}
                                            ref={ref}
                                            key={col}
                                        />
                                    )}
                            </tr>
                        )}
                </tbody>
            </table >
        );
    }
}

export default Board;