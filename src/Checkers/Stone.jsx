import { Component } from "react";
import './styling/stone.scss';

class Stone extends Component {
    constructor() {
        super();
        this.state = {
            isKing: false
        };
    }

    set isKing(bool) {
        this.setState({
            isKing: bool
        });
    }

    get isKing() {
        const isKing = this.state.isKing;
        return isKing
    }

    get canMove() {
        const stringifiedPos = this.props.pos.join(',');
        const canMove = this.props.movablePositions.includes(stringifiedPos);
        return canMove
    }

    get boundingClientRect() {
        // Percentage of the maxSize (prop) usage
        const sizePercentage = 75;

        // Width and height of the stone if the sizePercentage was 100
        const maxSize = this.props.maxSize;

        // Removed size (width / height) to center the stone, even if the sizePercentage isn't 100
        const removedWidthAndHeightSize = maxSize * (100 - sizePercentage) / 2 / 100;

        // Get the left and top based on the row and col of the stone, and the removedWidthAndHeightSize value
        const [row, col] = this.props.pos;
        const left = maxSize * col + removedWidthAndHeightSize;
        const top = maxSize * row + removedWidthAndHeightSize;

        // Width and height of the stone
        const widthAndHeightSize = maxSize / 100 * sizePercentage;

        const boundingClientRect = {
            width: widthAndHeightSize,
            height: widthAndHeightSize,
            left,
            top
        };
        return boundingClientRect
    }

    get forcedRowDirections() {
        // If the stone is a king, let the stone move to the top and bottom of the board
        if (this.isKing)
            return [1, -1]

        // If the stone's starting position in on the lower half of the board, let the stone move to the top half of the board.
        // Else, let the stone move to the bottom half of the board
        if (this.props.player === 1)
            return [1]
        return [-1]
    }

    get forcedDirections() {
        // Return a list with all the directions the stone can move to on the first turn.
        //! NOTE: The direction isn't checked if it's a possible move. (E.g. out of bounds, stone already on the position etc.)
        const forcedDirections = [];
        for (const forcedRowDirection of this.forcedRowDirections) {
            forcedDirections.push(
                [forcedRowDirection, -1],
                [forcedRowDirection, 1]
            );
        }
        return forcedDirections
    }

    get possibleMoves() {
        // Return an dict with every possible move.
        // E.g. if this is the dict with possible moves: { 2,1: [3,0, 3,2] }.
        // The key (2,1) represents the starting position of the stone.
        // The value ([3,0 3,2]) represents the position(s) the stone can move to from the key's position
        const moves = {};
        for (const direction of this.forcedDirections) {
            // Neighbour position
            const neighbour = direction.map((val, i) => {
                return val + this.props.pos[i]
            });

            // If the neighbour position has a stone of the same player, or the position is out of bounds, continue
            if (
                !this.props.posInBounds(neighbour) ||
                this.props.posPlayer(neighbour) === this.props.player
            )
                continue

            // Add the current pos as dict key, and the neighbour position(s) as movable within the value list
            if (this.props.pos in moves) {
                moves[this.props.pos].push(neighbour)
            } else {
                moves[this.props.pos] = [neighbour]
            }
        }
        return moves
    }

    onClick() {
        // If the stone isn't movable, return
        if (!this.canMove)
            return
    }

    render() {
        return (
            <div
                className={
                    "stone position-absolute rounded-circle" +
                    (this.isKing ? " king" : '')
                }
                style={{
                    backgroundColor: this.props.player === 1 ? "white" : "red",
                    boxShadow: (this.canMove) ? "0 0 2em #00ff3c" : "none",
                    ...this.boundingClientRect
                }}
                onClick={() => this.onClick()}
            >
            </div>
        )
    }
}

export default Stone;