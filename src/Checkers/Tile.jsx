import { Component, createRef } from "react";
import Stone from "./Stone";

class Tile extends Component {
    constructor() {
        super();
        this.state = {
            hasStone: false
        };
        this._stoneRef = createRef(null);
    }

    componentDidMount() {
        // Return if the tile has a stone when initializing
        const hasStone = () => {
            const rows = this.props.board.current.rows;
            const midRow = rows / 2;
            if (
                this.props.row === midRow ||
                this.props.row === midRow - 1
            ) {
                return false
            }

            if (this.props.row % 2 === 0)
                return this.props.col % 2 !== 0
            return this.props.col % 2 === 0
        }

        // Add the stone to the tile if the tile has a stone when initializing
        if (hasStone()) {
            this.setState({
                hasStone: true
            });
        }
    }

    get stone() {
        const stone = this._stoneRef.current;
        return stone
    }

    get backgroundColor() {
        // Return the background color of the tile
        if (this.props.row % 2 === 0) {
            if (this.props.col % 2 === 0)
                return "white"
            return "black"
        }
        if (this.props.col % 2 === 0)
            return "black"
        return "white"
    }

    get hasStone() {
        const hasStone = this.state.hasStone;
        return hasStone
    }

    render() {
        return (
            <td
                style={{
                    backgroundColor: this.backgroundColor
                }}
            >
                {this.hasStone &&
                    <Stone
                        ref={this._stoneRef}
                        pos={[this.props.row, this.props.col]}
                        row={this.props.row}
                        col={this.props.col}
                        board={this.props.board}
                        backgroundColor={(this.props.row < this.props.board.current.rows / 2) ? "white" : "red"}
                        player={(this.props.row < this.props.board.current.rows / 2) ? 1 : 2}
                        jumpDirection={(this.props.row < 3) ? 1 : -1}

                        {...this.props} //! TEST FASE
                    />
                }
            </td>
        )
    }
}

export default Tile;