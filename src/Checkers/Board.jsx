import { Component, createRef } from "react";
import Stone from "./Stone";

class Board extends Component {
    constructor() {
        super();
        this.state = {
            tilePixelSize: 0,
            stonesData: {},
        };
        this._boardRef = createRef(null);
    }

    async componentDidMount() {
        this.mountBoard();
        this.mountStones();
    }

    mountStones() {
        // Return if the pos has an stone when mounting
        const midRow = this.size / 2;
        function initPosHasStone(row, col) {
            if (
                row === midRow ||
                row === midRow - 1
            )
                return false

            if (row % 2 === 0)
                return col % 2 !== 0
            return col % 2 === 0
        }

        // Create a dict with data of the stones that gets mounted
        const stonesData = {}
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                // If the pos hasn't a stone when mounting, continue
                if (!initPosHasStone(row, col))
                    continue

                // Save the stone data
                const stoneDataKey = row + "," + col;
                stonesData[stoneDataKey] = createRef(null);
            }
        }
        this.setStonesData(stonesData);
    }

    setStonesData = (stonesData) => {
        this.setState({
            stonesData
        });
    }

    get stonesData() {
        const stonesData = this.state.stonesData;
        return stonesData
    }

    mountBoard() {
        // Assign the lowest size between the width and height as with and height size.
        // E.g. if the window width is 500, and height is 900, the width gets chosen as width & height.
        //! This is needed to create an even board
        const boardRef = this._boardRef.current;
        const tableRect = boardRef.getBoundingClientRect();
        const lowestSize = Math.min(tableRect.width, tableRect.height);
        Object.assign(
            boardRef.style,
            {
                height: lowestSize + "px",
                width: lowestSize + "px"
            }
        );

        // tilePixelSize = amount of pixels for 1 board tile.
        // The "tilePixelSize" state gets used to render the board background, 
        // and to calculate the boundingRect for elements on the board.
        this.tilePixelSize = lowestSize / (this.size / 2) / 2;
    }

    set tilePixelSize(pixels) {
        this.setState({
            tilePixelSize: pixels
        });
    }

    get tilePixelSize() {
        const tilePixelSize = this.state.tilePixelSize;
        return tilePixelSize
    }

    get size() {
        const size = this.props.settings.boardSize.value;
        return size;
    }

    getBoundingRectByPos = (pos, sizePercentage = 100) => {
        // Get the left and top based on the "pos" param.
        // The removedWidthAndHeightSize gets used to recenter the stone if the sizePerenctage isn't 100
        const [row, col] = pos;
        const removedWidthAndHeightSize = this.tilePixelSize * (100 - sizePercentage) / 2 / 100;
        const left = this.tilePixelSize * col + removedWidthAndHeightSize;
        const top = this.tilePixelSize * row + removedWidthAndHeightSize;

        // Width / height of the element based on the chosen sizePercentage
        const widthAndHeightSize = this.tilePixelSize / 100 * sizePercentage;

        // Return the boundingRect of the element
        const boundingRect = {
            width: widthAndHeightSize,
            height: widthAndHeightSize,
            left,
            top
        };
        return boundingRect
    }

    render() {
        return (
            <div
                ref={this._boardRef}
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
                    .entries(this.stonesData)
                    .map(([pos, ref], key) =>
                        <Stone
                            ref={ref}
                            boundingRect={this.getBoundingRectByPos(
                                pos.split(',').map((v) => Number(v)),
                                75
                            )}
                            pos={pos.split(',').map((v) => Number(v))}
                            player={Number(pos[0]) < this.size / 2 ? 1 : 2}
                            key={key}
                        />
                    )
                }
            </div>
        );
    }
}

export default Board;