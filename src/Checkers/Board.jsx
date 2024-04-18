import { Component, createRef } from "react";
import Stone from "./Stone";
import { saveGame } from "./dataStorage";

class Board extends Component {
    constructor() {
        super();
        this.state = {
            tilePixelSize: 0,
            stonesData: {},
            movablePositions: []
        };
        this._boardRef = createRef(null);
    }

    componentWillUnmount() {
        // Save the stones data
        saveGame(this.stonesData);
    }

    componentDidMount() {
        // Render the board
        this.mountBoard();

        // Mount the stones
        let stonesData = JSON.parse(localStorage.getItem('stonesData'));
        if (
            stonesData &&
            Object.keys(stonesData).length !== 0
        )
            Object
                .entries(stonesData)
                .map(([_, stoneData]) => stoneData.ref = createRef(null))
        else
            stonesData = this.initializionStonesData;
        this.setStonesData(stonesData);
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

        // The "tilePixelSize" state gets used to render the board background, and to calculate the stones size.
        // The value is the amount of pixels for 1 tile on the board.
        this.tilePixelSize = lowestSize / (this.size / 2) / 2;
    }

    get initializionStonesData() {
        //! This function only works when the rows are divisible by 2
        const midRow = this.size / 2;
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

        // Create a dict with the initialized stone data
        const stonesData = {};
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                const pos = [row, col];
                if (!posHasStone(pos))
                    continue

                stonesData[pos] = {
                    ref: createRef(null),
                    player: row < midRow ? 1 : 2
                };
            }
        }
        return stonesData
    }

    get size() {
        // Return the amount of rows / cols of the board
        const size = this.props.settings.boardSize.value;
        return size;
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

    setStonesData = (data) => {
        this.setState({
            stonesData: data
        });
    }

    get stonesData() {
        const stonesData = this.state.stonesData;
        return stonesData
    }

    get movablePositions() {
        // Return a list with every stone position that can be moved
        const movablePositions = this.state.movablePositions;
        return movablePositions
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
                    .map(([pos, { ref, player }], key) =>
                        <Stone
                            settings={this.props.settings}
                            tilePixelSize={this.tilePixelSize}
                            movablePositions={this.movablePositions}
                            pos={pos.split(',').map((v) => Number(v))}
                            player={player}
                            ref={ref}
                            key={key}
                            gameRules={this.props.gameRules}
                        />
                    )}
            </div>
        )
    }
}

export default Board;