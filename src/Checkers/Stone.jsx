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
        // Return if the current position is inside the movablePositions prop.
        // The movablePositions prop is a list with every position which holds a stone that can be moved
        const stringifiedPos = this.props.pos.join(',');
        const canMove = this.props.movablePositions.includes(stringifiedPos);
        return canMove
    }

    set isChosen(bool) {
        // Set the data for the "chosenStoneData" state based on the parameter bool. 
        // If the player clicks 1 time on the stone, the bool is true. 
        // If the stone was already clicked, and no other stone was clicked after it, the bool is false
        // The second parameter inside the "setChosenStoneData" function is used to return if the stone was moved
        const data = bool ? {
            startPos: this.props.pos,
            endPositions: this.possibleMoves[this.props.pos]
        } : null;
        this.props.setChosenStoneData(
            data,
            false
        );
    }

    get isChosen() {
        // Return if the current stone is being moved
        const chosenStoneData = this.props.chosenStoneData;
        const isChosen = chosenStoneData && chosenStoneData.startPos.every((val, i) => val === this.props.pos[i]);
        return isChosen
    }

    get rowDirections() {
        // If the stone is a king, let the stone move to the top and bottom of the board
        if (this.isKing)
            return [1, -1]

        // If the stone's starting position in on the lower half of the board, let the stone move to the top half of the board.
        // Else, let the stone move to the bottom half of the board
        if (this.props.player === 1)
            return [1]
        return [-1]
    }

    get directions() {
        // Return a list with all the directions the stone can move to.
        //! NOTE: The direction isn't checked if it's a possible move. (E.g. out of bounds, stone already on the position etc.)
        const directions = [];
        for (const rowDirection of this.rowDirections) {
            directions.push(
                [rowDirection, -1],
                [rowDirection, 1]
            );
        }
        return directions
    }

    get possibleMoves() {
        // Return an dict with every possible move.
        // E.g. if this is the dict with possible moves: { 2,1: [3,0, 3,2] }.
        // The key (2,1) represents the starting position of the stone.
        // The value ([3,0 3,2]) represents the position(s) the stone can move to from the key's position
        const moves = {};
        for (const direction of this.directions) {
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
        // Set the stone as being chosen if the stone wasn't already chosen, else set the stone as not chosen
        if (this.canMove)
            this.isChosen = !this.isChosen;
    }

    dragStart() {
        // Set the stone as being moved, 
        // and set the "chosenStoneData" (state inside the Board component) 
        // as the current stone data (current position and possible moves)
        if (this.canMove)
            this.isChosen = true;
    }

    get posBoundingClientRect() {
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
                    ...this.posBoundingClientRect
                }}
                draggable={this.canMove}
                onClick={() => this.onClick()}
                onDragStart={() => this.dragStart()}
            />
        )
    }
}

export default Stone;