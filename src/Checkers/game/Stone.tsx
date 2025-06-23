import { Component, DragEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCrown } from '@fortawesome/free-solid-svg-icons';
import { allowedDropPositions, Position, StoneMoves } from './calculateMoves.ts';
import StoneMovesVisualizer from './StoneMovesVisualizer.jsx';
import { CurrentPlayer } from './gameData.ts';


/**
 * Represents the dimensions of a stone.
 * - stonePixelSize: The size of the stone in pixels.
 * - x: The X coordinate of the stone on the board.
 * - y: The Y coordinate of the stone on the board.
 */
interface stoneDimensions {
    stonePixelSize: number;
    x: number;
    y: number;
}

/**
 * Represents a drop zone for a stone.
 * - startingX: The starting width of the drop zone in pixels.
 * - startingY: The starting height of the drop zone in pixels.
 * - endingX: The ending width of the drop zone in pixels.
 * - endingY: The ending height of the drop zone in pixels.
 */
interface DropZone {
    startingX: number;
    startingY: number;
    endingX: number;
    endingY: number;
}

/**
 * Represents the positions of the drop zones.
 * This is an array of positions where the stone can be dropped.
 */
type DropZonePositions = Position[];

/**
 * Props for the Stone component:
 * - player: The player of the stone (1 or 2).
 * - currentPlayer: The current player (1 or 2).
 * - stoneMoves: An array which contains objects with the possible moves for the stone.
 * - position: The position of the stone on the board, represented as an array [row, col].
 * - tileSize: The size of the tile on the board, represented as an number.
 * - stoneChosen: A boolean value indicating whether the stone is chosen or not.
 * - isKing: A boolean value indicating whether the stone is a king or not.
 * - setChosenPosition: A function to set the chosen position of the stone.
 * - moveChosenStone: A function to move the chosen stone to a new position.
 * - setChosenStoneIsBeingDragged: A function to set the position of the stone that is being dragged.
 * - chosenStoneIsBeingDragged: A boolean value indicating whether the chosen stone is being dragged or not.
 */
interface StoneProps {
    player: CurrentPlayer;
    currentPlayer: CurrentPlayer;
    stoneMoves: StoneMoves;
    position: Position;
    tileSize: number;
    stoneChosen: boolean;
    isKing: boolean;
    setChosenPosition: (position: Position) => void;
    moveChosenStone: (position: Position, chosenMoveIndex: number) => void;
    setChosenStoneIsBeingDragged: (flag: boolean) => void;
    chosenStoneIsBeingDragged: boolean
}

class Stone extends Component<StoneProps> {
    /**
     * Returns whether the stone can be moved or not.
     * @returns {boolean} True if the stone can be moved, false otherwise.
     */
    get canMove(): boolean {
        // If the stone is already chosen, return true
        if (this.props.stoneChosen) {
            return true
        }

        // If the player of the stone is not the current player, return false
        if (this.props.player !== this.props.currentPlayer) {
            return false
        }

        // If the stone doesn't have any moves, return false
        if (this.props.stoneMoves.length === 0) {
            return false
        }

        // If the stone has any moves, return true
        return true
    }

    /**
     * Returns the allowed drop positions for the stone.
     * This is an array of board positions ([row, col]) where the stone can be dropped.
     * @throws {Error} If the stone has no moves, an error is thrown. This is because this function should only be called when the stone has moves.
     * @returns {DropZonePositions | void} An array of positions where the stone can be dropped, or undefined if the stone can't be moved.
     */
    get dropZonePositions(): DropZonePositions | void {
        // If the stone can't be moved, return
        // Since this getter will also be called when the stone is being dragged,
        // we need to ensure that the stone can be moved before calculating the drop positions.
        if (!this.canMove) {
            return
        }

        // Get the allowed drop positions, which is an array of board positions where the stone can be dropped
        const dropZonePositions = allowedDropPositions(this.props.stoneMoves) as Position[];
        return dropZonePositions
    }

    /**
     * Returns the possible drop zones coordinates for the stone.
     * This will be an array containing the starting and ending coordinates of the drop zones.
     * @returns {DropZone[]} An array of objects representing the coordinates of the drop zones.
     */
    get dropZonesRects(): DropZone[] { 
        // Calculate and return the coordinates of the possible drop zones based on the drop zone positions.
        const possibleDropZones = (this.dropZonePositions as DropZonePositions).map(([possibleDropPositionRow, possibleDropPositionCol]) => {
            const startingX = this.props.tileSize * possibleDropPositionCol;
            const startingY = this.props.tileSize * possibleDropPositionRow;
            const endingX = startingX + this.props.tileSize;
            const endingY = startingY + this.props.tileSize;
            const possibleDropZone = {
                startingX,
                startingY,
                endingX,
                endingY
            };
            return possibleDropZone
        });
        return possibleDropZones
    }


    /**
     * Returns the dimensions of the stone.
     * @returns {stoneDimensions} An object containing the size and coordinates of the stone.
     */
    get stoneDimensions(): stoneDimensions {
        // Set the size of the stone to 80% of the tile size.
        // This is to ensure that the stone fits inside the tile
        const stonePixelSize = this.props.tileSize * 0.8;

        // Return the dimensions to center the stone in the tile.
        // This is done by calculating the left and top position of the stone based on the tile size
        const [row, col] = this.props.position;
        const x = col * this.props.tileSize + (this.props.tileSize - stonePixelSize) / 2;
        const y = row * this.props.tileSize + (this.props.tileSize - stonePixelSize) / 2;
        const dimensions = {
            stonePixelSize,
            x,
            y
        };
        return dimensions
    }

    /**
     * Onclick handler for the stone.
     * @returns {void}
     */
    onClick = (): void => {
        // If the stone can't be moved, return
        if (!this.canMove) {
            return
        }

        // Set the chosen position to the position of the stone.
        this.props.setChosenPosition(this.props.position);
    }

    /**
     * On drag start handler for the stone.
     * @returns {void}
     */
    onDragStart = (): void => {
        // If the stone can't be moved, return
        if (!this.canMove) {
            return
        }

        // Set the chosen position to the position of the stone.
        this.props.setChosenPosition(this.props.position);

        // Set the dragged position to true, indicating that the stone is being dragged
        this.props.setChosenStoneIsBeingDragged(true);
    }

    /**
     * Handler for when the stone is dropped.
     * - If the user drags the stone and drops it on a valid drop zone,
     * the stone will be moved to the position of the drop zone where the drag ended.
     * - If the user drags the stone and drops it outside of a valid drop zone,
     * the stone will not be moved, and it will stay in its original position.
     * @param {DragEvent<HTMLDivElement>} e - The drag event which is triggered when the user drops the stone.
     * @returns {void}
     */
    onDragEnd = (e: DragEvent<HTMLDivElement>): void => {
        // If the stone can't be moved, return
        if (!this.canMove) {
            return
        }

        // If the stone doesn't have a parent element, return.
        // This should only happen if we call this Component exclusively for testing purposes.
        // Because of this exclusive case, we throw an error to indicate that the stone must be inside a board element to be dragged.
        const board = (e.target as HTMLElement).parentElement;
        if (!board) {
            throw new Error("The stone must be inside a board element to be dragged.");
        }

        // Calculate the X and Y coordinates of the mouse when the drag ends. 
        // This will be calculated based on the board element, with the top left corner as (0, 0).
        // This will be done to ensure that wherever the board is on the screen, the coordinates will be relative to the board element.
        const boardElementRect = board.getBoundingClientRect();
        const clientX = e.clientX - boardElementRect.left;
        const clientY = e.clientY - boardElementRect.top;

        // Loop through the possible drop zones, and check if the mouse coordinates are one of the possible drop zones.
        // If the mouse coordinates are inside one of the possible drop zones,
        // move the stone to the position of the drop zone where the drag ended.
        // We calculate if the mouse coordinates are inside the drop zone,
        // based on the start and ending coordinates of the drop zone.
        // If the mouse coordinates are within the drop zone, move the stone to the position of the drop zone.
        for (const [i, possibleDropZone] of this.dropZonesRects.entries()) {
            if (
                clientX >= possibleDropZone.startingX &&
                clientX <= possibleDropZone.endingX &&
                clientY >= possibleDropZone.startingY &&
                clientY <= possibleDropZone.endingY
            ) {
                const chosenPosition = this.dropZonePositions[i];
                this.props.moveChosenStone(chosenPosition, i);
                return
            }
        }

        // Set the dragged position to null, indicating that the chosen stone is no longer being dragged
        this.props.setChosenStoneIsBeingDragged(false);
    }

    render() {
        const { x, y, stonePixelSize } = this.stoneDimensions;
        const stoneColor = this.props.player === 1 ? "black" : "white";
        return (
            <>
                <div
                    className="position-absolute rounded-circle border border-dark stone"
                    style={{
                        backgroundColor: this.props.stoneChosen ? "green" : stoneColor,
                        width: `${stonePixelSize}px`,
                        height: `${stonePixelSize}px`,
                        left: `${x}px`,
                        top: `${y}px`,
                        boxShadow: this.canMove ? "0 0 1vw #00ff3c" : `0 0 1px ${stoneColor}`,
                        cursor: this.canMove ? "pointer" : "not-allowed"
                    }}
                    draggable={this.canMove}
                    onClick={this.onClick}
                    onDragStart={this.onDragStart}
                    onDragEnd={this.onDragEnd}
                >
                    {this.props.isKing &&
                        <FontAwesomeIcon 
                            icon={faCrown}
                            className="position-absolute"
                            style={{
                                width: `${stonePixelSize * 0.5}px`,
                                height: `${stonePixelSize * 0.5}px`,
                                left: `${(stonePixelSize - stonePixelSize * 0.5) / 2}px`,
                                top: `${(stonePixelSize - stonePixelSize * 0.5) / 2}px`,
                                color: "gold"
                            }}
                        />
                    }
                </div>
                {this.props.stoneChosen &&
                    <StoneMovesVisualizer
                        tileSize={this.props.tileSize}
                        initialPosition={this.props.position}
                        stoneMoves={this.props.stoneMoves}
                        allowedDropPositions={this.dropZonePositions}
                        moveChosenStone={this.props.moveChosenStone}
                        chosenStoneIsBeingDragged={this.props.chosenStoneIsBeingDragged}
                    />
                }
            </>
        )
    }
}

export default Stone;