import { Component } from "react";

class PossibleMove extends Component {
    moveStone() {
        // Update the key for the moved stone data to the new position the user chose (position that holds the rendered element)
        const board = this.props.board;
        board[this.props.endPos] = board[this.props.startPos];
        delete board[this.props.startPos];

        // Update the board to save the new position for the moved stone
        this.props.setBoard(board);

        // Set the "movingStoneData" state to null (first param), and use the second param to return if the stone was moved
        this.props.setChosenStoneData(null, true);
    }

    onClick() {
        // Move the chosen stone to the new position the user chose (position that holds the rendered element)
        this.moveStone();
    }

    dragOver(ev) {
        // Allow the drop
        ev.preventDefault();
    }

    drop() {
        // Move the chosen stone to the new position the user chose (position that holds the rendered element)
        this.moveStone();
    }

    get posBoundingClientRect() {
        // Percentage of the maxSize (prop) usage
        const sizePercentage = 75;

        // Width and height of the stone if the sizePercentage was 100
        const maxSize = this.props.maxSize;

        // Removed size (width / height) to center the stone, even if the sizePercentage isn't 100
        const removedWidthAndHeightSize = maxSize * (100 - sizePercentage) / 2 / 100;

        // Get the left and top based on the row and col of the stone, and the removedWidthAndHeightSize value
        const [row, col] = this.props.endPos;
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

    render() {
        return (
            <div
                className={
                    "stone position-absolute rounded-circle"
                }
                style={{
                    backgroundColor: "#00ff3c",
                    boxShadow: "0 0 2em #00ff3c",
                    cursor: "pointer",
                    ...this.posBoundingClientRect
                }}
                onDrop={() => this.drop()}
                onDragOver={(ev) => this.dragOver(ev)}
                onClick={() => this.moveStone()}
            />
        );
    }
}

export default PossibleMove;