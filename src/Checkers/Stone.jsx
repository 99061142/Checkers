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