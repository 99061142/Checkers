import { Component } from "react";
import { getGameRules } from "../settings/settingsData";

class Stone extends Component {
    get stoneChosen() {
        // If the stoneChosenData is null, which means no stone is chosen, return false
        const chosenStoneData = this.props.stoneChosenData;
        if (chosenStoneData === null)
            return false

        // If the stoneChosen position is the same as the stone position, return true
        const [chosenStoneRow, chosenStoneCol] = chosenStoneData.position;
        const [row, col] = this.props.position;
        if (
            chosenStoneRow === row &&
            chosenStoneCol === col
        )
            return true
        return false
    }

    get isKing() {
        // Return if the stone is a king
        const isKing = this.props.isKing;
        return isKing
    }
    
    get stonePlayer() {
        // Return the player of the stone
        const player = this.props.player;
        return player
    }

    get stoneIsCurrentPlayer() {
        // Return if the current player is the same as the player of the stone
        const currentPlayer = this.props.currentPlayer;
        const stonePlayer = this.stonePlayer;
        if (currentPlayer === stonePlayer)
            return true
        return false
    }

    get stoneCanMove() {
        // If the stone is not the current player, return false
        if (!this.stoneIsCurrentPlayer)
            return false


        // If the stone has more than 1 possible moves, return true, 
        // If not, return false
        if (this.possibleMoves.length > 0)
            return true
        return false
    }

    get possibleMoves() {
        const gameRules = getGameRules(); // Get the game rules from the settings
        const possibleDirections = () => {
            // If the player is 1, the stone must move downwards on the board, if the player is 2, the stone must move upwards on the board,
            // With an exception is if the stone is a king, or if the game rules allow the player to move backwards
            const possibleDirections = [];
            const canMoveBackwards = gameRules.canMoveBackwards || this.isKing;
            if (
                this.stonePlayer === 1 || 
                canMoveBackwards
            ) {
                possibleDirections.push(
                    [1, -1], // Upwards left
                    [1, 1], // Upwards right
                );
            }
            if (
                this.stonePlayer === 2 || 
                canMoveBackwards
            ) {
                possibleDirections.push(
                    [-1, -1], // Downwards left
                    [-1, 1], // Downwards right
                );
            }
            return possibleDirections
        }
        
        const possibleNeighbours = () => {
            // Get the possible neighbours of the stone based on the possible directions
            // This would delete all neighbours out of bounds of the board, and the neighbours that have a stone on the position of the same player
            //! NOTE: It won't delete the neighbours that have a enemy stone on the position, this function isn't finished yet.
            const [row, col] = this.props.position;
            const possibleNeighbours = possibleDirections().map(direction => {
                const [rowDirection, colDirection] = direction;
                const neighbourPosition = [row + rowDirection, col + colDirection];
                return neighbourPosition
            }).filter(neighbourPosition => {
                const [neighbourRow, neighbourCol] = neighbourPosition;
                return (
                    neighbourRow >= 0 &&
                    neighbourRow < this.props.tilesPerRow &&
                    neighbourCol >= 0 &&
                    neighbourCol < this.props.tilesPerRow &&
                    this.props.stonesInformation[neighbourPosition] !== this.stonePlayer
                )
            });
            return possibleNeighbours
        }
        return possibleNeighbours()

        //! TODO: check if the neighbour position has a enemy stone on it, and act accordingly to the game rules
        //! This will be done in later updates
    }

    get possibleDropZones() {
        // Calculate the X and Y coordinates of the tile where the stone can be dropped
        // This will be done based on the tileDimensions, and the possibleDropPositions,
        // When done, it will return an array of objects with the coordinates of the possible tiles where the stone can be dropped
        const tileDimensions = this.props.tileDimensions;
        const possibleDropPositions = this.props.stoneChosenData.possibleMoves;
        const possibleDropZones = possibleDropPositions.map(([possibleDropPositionRow, possibleDropPositionCol]) => {
            const startingHeight = tileDimensions.height * possibleDropPositionRow;
            const startingWidth = tileDimensions.width * possibleDropPositionCol;
            const possibleDropZone = {
                startingHeight: startingHeight,
                startingWidth: startingWidth
            };
            return possibleDropZone
        });
        return possibleDropZones
    }

    get stoneDimensions() {
        const tileDimensions = this.props.tileDimensions;
        const stoneSize = tileDimensions.width * 0.8; // The stone size is 80% of the tile size. (the width and height of the tile are the same, so it doesn't matter which one to use, which is why we use tileDimensions.width)
        const [row, col] = this.props.position;

        // Return the dimensions to center the stone in the tile on the position of the stone, 
        // By calculating the left and top position of the stone based on the tile size,
        // Based on the position of the stone, and the size of the tile on the board
        const tileWidth = tileDimensions.width;
        const x = col * tileWidth + (tileWidth - stoneSize) / 2;
        const tileHeight = tileDimensions.height;
        const y = row * tileHeight + (tileHeight - stoneSize) / 2;
        const dimensions = {
            width: stoneSize,
            height: stoneSize,
            left: x,
            top: y
        };
        return dimensions
    }

    stoneClicked = () => {
        // If the stone can't move, return
        if (!this.stoneCanMove)
            return

        // If the stone is already chosen, return
        if (this.stoneChosen)
            return

        // Set the clicked stone as the chosen stone, and allow the player to move it
        this.props.setStoneChosenData({
            position: this.props.position,
            possibleMoves: this.possibleMoves
        });
    }

    onDragEnd = (e) => {
        // Get the X and Y coordinates of the mouse when the drag ends, 
        // Calculate the coordinates based on the board element, with the top left corner as (0, 0)
        // If the user goes out of the board element, it will return a negative value
        const boardElementRect = e.target.parentElement.getBoundingClientRect();
        const clientX = e.clientX - boardElementRect.left;
        const clientY = e.clientY - boardElementRect.top;

        // Loop through the possible drop zones, and check if the mouse coordinates are inside the drop zone
        // If the mouse coordinates are inside one of the possible drop zones,
        // Move the stone to the position of the drop zone where the drag ended.
        // If the mouse coordinates are not inside any of the possible drop zones,
        // Do nothing
        for (const [key, possibleDropZone] of this.possibleDropZones.entries()) {
            const startingWidth = possibleDropZone.startingWidth;
            const startingHeight = possibleDropZone.startingHeight;
            if (
                clientX > startingWidth && 
                clientX < startingWidth + this.props.tileDimensions.width &&
                clientY > startingHeight && 
                clientY < startingHeight + this.props.tileDimensions.height
            ) {
                const chosenPosition = this.props.stoneChosenData.possibleMoves[key];
                this.props.moveChosenStone(chosenPosition);
            }
        }
    }

    render() {
        const stoneDimensions = this.stoneDimensions;
        const stoneColor = this.stonePlayer === 1 ? "black" : "white"
        return (
            <div
                className="position-absolute rounded-circle border border-dark"
                style={{
                    backgroundColor: this.stoneChosen ? "green" : stoneColor,
                    width: `${stoneDimensions.width}px`,
                    height: `${stoneDimensions.height}px`,
                    left: `${stoneDimensions.left}px`,
                    top: `${stoneDimensions.top}px`,
                    boxShadow: this.stoneCanMove ? "0 0 1vw #00ff3c" : `0 0 1px ${stoneColor}`,
                    cursor: this.stoneCanMove ? "pointer" : "not-allowed"
                }}
                draggable={this.stoneCanMove}
                onClick={this.stoneClicked}
                onDragStart={this.stoneClicked}
                onDragEnd={this.onDragEnd}
            >
            </div>
        )
    }
}

export default Stone;