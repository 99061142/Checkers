import { Component } from "react";
import './styling/stone.scss';

class Stone extends Component {
    constructor() {
        super();
        this.state = {
            isKing: false
        };
    }

    get canMove() {
        const canMove = this.props.movablePositions.includes(this.props.pos);
        return canMove
    }

    get isKing() {
        const isKing = this.state.isKing;
        return isKing
    }

    get rect() {
        // Size of the stone if the sizePercentage is 100
        const maxSize = this.props.tilePixelSize;

        // Size percantage
        const sizePercentage = 75;

        // Get the left and top based on the pos of the stone.
        // The removedWidthAndHeightSize gets used to recenter the stone if the sizePerenctage isn't equal to the maxSize
        const [row, col] = this.props.pos;
        const removedWidthAndHeightSize = maxSize * (100 - sizePercentage) / 2 / 100;
        const left = maxSize * col + removedWidthAndHeightSize;
        const top = maxSize * row + removedWidthAndHeightSize;

        // Width and height of the stone based on the chosen sizePercentage
        const widthAndHeightSize = maxSize / 100 * sizePercentage;

        const rect = {
            width: widthAndHeightSize,
            height: widthAndHeightSize,
            left,
            top
        };
        return rect
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
                    boxShadow: this.canMove ? "0 0 2em #00ff3c" : "none",
                    cursor: this.canMove ? "pointer" : "not-allowed",
                    ...this.rect
                }}
            />
        )
    }
}

export default Stone;