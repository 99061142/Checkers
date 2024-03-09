import { Component } from "react";
import './styling/stone.scss';

class Stone extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isKing: false,
            canMove: false
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

    set canMove(bool) {
        this.setState({
            canMove: bool
        });
    }

    get canMove() {
        const canMove = this.state.canMove;
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
        const left = maxSize * col + removedWidthAndHeightSize
        const top = maxSize * row + removedWidthAndHeightSize

        // Width and height of the stone
        const widthAndHeightSize = maxSize / 100 * sizePercentage;

        const boundingClientRect = {
            width: widthAndHeightSize,
            height: widthAndHeightSize,
            left,
            top
        }
        return boundingClientRect
    }

    get forcedRowDirections() {
        if (this.isKing)
            return [1, -1];

        if (this.props.player === 1)
            return [1]
        return [-1]
    }

    get possibleMoves() {
        // Get the possible directions for the stone
        const directions = []
        for (const forcedRowDirection of this.forcedRowDirections) {
            directions.push(
                [forcedRowDirection, -1],
                [forcedRowDirection, 1]
            );
        }

        const moves = {};
        for (const direction of directions) {
            // Neighbour position
            const neighbour = direction.map((val, i) => {
                return val + this.props.pos[i]
            });

            // If the neighbour position has a stone of the same player, or the position is out of bounds, skip
            if (
                !this.props.posInBounds(neighbour) ||
                this.props.posPlayer(neighbour) === this.props.player
            )
                continue

            // Add the neighbour positon as move
            // The first position the current stone can move to, is the key.
            // The value is used if the stone must move more than the neighbour position. (e.g. capture other stones.)
            moves[neighbour] = [];
        }
        return moves
    }

    render() {
        return (
            <div
                className={
                    "stone position-absolute rounded-circle" +
                    (this.isKing ? " king" : '') +
                    (this.canMove ? " can-move" : '')
                }
                style={{
                    backgroundColor: this.props.player === 1 ? "white" : "red",
                    ...this.boundingClientRect
                }}
            >
            </div >
        )
    }
}

export default Stone;