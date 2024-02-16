import { Component } from "react";
import Stone from "./Stone";

class Tile extends Component {
    constructor() {
        super();
        this.state = {
            stone: null
        };
    }

    componentDidMount() {
        // Return if the tile has a stone when initializing
        const hasStone = () => {
            if (
                this.props.row === this.props.board.current.rows / 2 ||
                this.props.row === this.props.board.current.rows / 2 - 1
            ) {
                return false
            }

            if (this.props.row % 2 === 0)
                return this.props.col % 2 !== 0
            return this.props.col % 2 === 0
        }

        // If the tile has no stone when initializing, return
        if (!hasStone())
            return

        // Set the stone
        this.setState({
            stone: <Stone
                pos={[this.props.row, this.props.col]}
                row={this.props.row}
                col={this.props.col}
                board={this.props.board}
                backgroundColor={(this.props.row < this.props.board.current.rows / 2) ? "white" : "red"}
                forcedDirection={(this.props.row < 3) ? 1 : -1}
            />
        });
    }

    get stone() {
        const stone = this.state.stone;
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

    render() {
        return (
            <td
                style={{
                    backgroundColor: this.backgroundColor
                }}
            >
                {this.stone}
            </td>
        )
    }
}

export default Tile;