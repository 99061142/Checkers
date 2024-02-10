import { Component, createRef } from "react";
import Tile from "./Tile";

class Board extends Component {
    constructor() {
        super();
        this.state = {
            tiles: []
        };
        this._rows = 8;
        this._cols = 8;
        this._table = createRef(null);
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

    componentDidMount() {
        // Calculate the maximum width and height for the board.
        // First the current width and height of the board gets rounded DOWN to the nearest number
        // The lowest number between the rounded width and height gets chosen as maximum width and height for the board.
        //! The culcalation is needed to make an even square for each tile.
        const tableElement = this._table.current;
        const tableRect = tableElement.getBoundingClientRect();
        const roundedWidth = Math.floor(tableRect.width / 100) * 100;
        const roundedHeight = Math.floor(tableRect.height / 100) * 100;
        const lowestRounded = Math.min(roundedWidth, roundedHeight);

        // Set the height and width
        Object.assign(
            tableElement.style,
            {
                height: lowestRounded + "px",
                width: lowestRounded + "px"
            }
        );

        // Create references for each tile on the board.
        // The references gets saved in a 2d list as a state named "tiles"
        const tiles = [];
        for (let row = 0; row < this._rows; row++) {
            const tilesRow = [];
            for (let col = 0; col < this._cols; col++) {
                tilesRow.push(createRef(null));
            }
            tiles.push(tilesRow);
        }
        this.tiles = tiles;
    }

    render() {
        return (
            <table
                ref={this._table}
                className="position-absolute m-auto top-0 bottom-0 start-0 end-0"
                style={{
                    width: "100%",
                    height: "100%"
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
                                            row={row}
                                            col={col}
                                            key={col}
                                            ref={ref}
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