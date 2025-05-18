import { Component } from 'react';
import { getGameRules } from '../settings/settingsData';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCrown } from '@fortawesome/free-solid-svg-icons';

class Stone extends Component {
    get stoneChosen() {
        // Return if the current stone is chosen
        const chosenPosition = this.props.chosenPosition;
        if (chosenPosition === null)
            return false

        const [chosenRow, chosenCol] = chosenPosition;
        const [row, col] = this.position;
        return (
            chosenRow === row &&
            chosenCol === col
        )
    }

    componentDidMount() {
        // Add the possible moves of the stone to the allStonesMoves object if the stone has any possible moves.
        // The allStonesMoves object has all the moves of all the stones on the board.
        // The object could be found in the Stones.jsx file as a state, and is passed as a prop to the Stone component
        const possibleMoves = this.stoneMoves;
        if (possibleMoves.length > 0)
            this.props.addStoneMoves(this.position, possibleMoves);
    }

    componentDidUpdate(prevProps) {
        // If the positition has changed, remove the stone moves of the previous position
        const [prevRow, prevCol] = prevProps.position;
        const [row, col] = this.position;
        const positionHasChanged = (
            prevRow !== row ||
            prevCol !== col
        );

        // If 1 of the stone on the board has moved, set all stone moves to the new possible moves
        //! THIS IS A TEMPORARY FIX, AND SHOULD BE REPLACED WITH A BETTER SOLUTION
        //! E.G. only check if the stone can move when the stone is chosen, and not save all the possible moves for all the stones on the board
        // TODO - Change the code to a better solution
        const stoneMoves = this.stoneMoves;
        if (
            prevProps.stonesInformation !== this.props.stonesInformation &&
            stoneMoves.length > 0
        )
            this.props.addStoneMoves(this.position, stoneMoves);

        // If the position has changed, remove the stone moves of the previous position
        // Also check if the stone has moved to the last row of the board, to set the stone as a king if the stone isn't already a king
        if (positionHasChanged) {
            this.props.removeStoneMoves(prevProps.position);

            // If the stone is not a king, and the stone has reached the last row of the board (based on the player),
            // Set the stone as a king
            const endRow = this.player === 1 ? this.props.tilesPerRow - 1 : 0;
            if (
                !this.isKing && 
                row === endRow
            )
                this.props.setStoneAsKing(this.position)
        }
    }

    get isKing() {
        // Return if the stone is a king
        const isKing = this.props.isKing;
        return isKing
    }
    
    get player() {
        // Return the player of the stone
        const player = this.props.player;
        return player
    }

    get position() {
        // Return the position of the stone
        const position = this.props.position;
        return position
    }

    get isCurrentPlayer() {
        // Return if the current player is the same as the player of the stone
        const currentPlayer = this.props.currentPlayer;
        const player = this.player;
        if (currentPlayer === player)
            return true
        return false
    }

    get canMove() {
        // If the stone is not the current player, return false
        if (!this.isCurrentPlayer)
            return false

        // If the stone has no possible moves, return false
        const stoneMoves = this.stoneMoves;
        if (stoneMoves.length === 0)
            return false

        // If the mandatory capture is disabled, and the stone has moves, return true
        const mandatoryCapture = getGameRules().mandatoryCapture;
        if (
            !mandatoryCapture &&
            stoneMoves.length > 0
        )
            return true

        // If the allStonesMoves object doesn't have the current stone position, return false
        // This only happens when the state changes and the stone moves are updated,
        // Which will result in an error if the position is not found in the allStonesMoves object, since the position is not set yet
        const allStonesMoves = this.props.allStonesMoves;
        if (allStonesMoves[this.position] === undefined)
            return false

        // If the mandatory capture is enabled, and the stone has moves where it can capture a stone, return true
        const currentPositionCanCapture = allStonesMoves[this.position].filter((possibleMove) => possibleMove.capturedPosition !== null);
        if (
            mandatoryCapture &&
            currentPositionCanCapture.length > 0
        )
            return true

        // Loop through all the stone moves of the current player, and check if any of them can capture a stone
        // If any of the stones can capture a stone, return false
        // This is because the current stone where this function is being called from, has no capture moves,
        // While one or more of the other stones can capture a stone
        // This will force the player to capture a stone of the opponent if possible
        for (const [key, value] of Object.entries(allStonesMoves)) {
            // If the stone is not of the current player, continue
            if (
                !this.props.stonesInformation.hasOwnProperty(key) ||
                this.props.stonesInformation[key].player !== this.player
            )
                continue
            
            // If one of the other stones can capture a stone, return false
            const otherPlayerStoneCanCapture = value.some(possibleMove => possibleMove.capturedPosition !== null);
            if (otherPlayerStoneCanCapture)
                return false
        }

        // Return true if the stone has possible moves, and the player isn't forced to use another stone to capture a stone
        return true
    }

    get stoneMoves() {
        const directions = [
            [-1, -1], // Up left
            [-1, 1], // Up right
            [1, -1], // Down left
            [1, 1] // Down right
        ];

        let stoneMoves = []
        const filteredMoves = () => {
            // If the stone has no possible moves, return an empty array
            if (stoneMoves.length === 0)
                return []

            const isMoveBackwards = (endPosition) => {
                // Return if the stone neighbour position is backwards based on the current position of the stone
                const endRow = endPosition[0];
                const row = this.position[0];
                return (
                    (
                        this.player === 1 && 
                        endRow < row
                    ) ||
                    (
                        this.player === 2 && 
                        endRow > row
                    )
                )
            }

            // Get the game rules, which function is imported from the settingsData.js file.
            // This function reads the local storage, and return the game rules object which was set in the settingsData.js file.
            // The game rules will be used to filter the possible moves of the stone
            const gameRules = getGameRules();
            const mandatoryCapture = gameRules.mandatoryCapture;
            const canCaptureBackwards = gameRules.canCaptureBackwards || this.isKing;
            const canMoveBackwards = gameRules.canMoveBackwards || this.isKing;
            let moves = []; // List which will store the possible moves of the stone, ignoring the capture moves
            const movesCaptures = []; // List which will store the capture moves of the stone, excluding the moves that don't capture a stone
            for (const possibleMove of stoneMoves) {
                const endPosition = possibleMove.endPosition;
                const capturedPosition = possibleMove.capturedPosition;

                // If the move captures a stone, check the conditions
                if (capturedPosition !== null) {
                    // If the move is backwards and the player can't capture backwards, continue.
                    if (
                        isMoveBackwards(endPosition) && 
                        !canCaptureBackwards
                    )
                        continue

                    // If the move is backwards, and the player can capture backwards, 
                    // Add the move to the movesCaptures array, and continue
                    movesCaptures.push(possibleMove);
                    continue
                }

                // If the move is backwards and the player can't move backwards, continue.
                if (
                    isMoveBackwards(endPosition) && 
                    !canMoveBackwards
                )
                    continue

                // If the move is not backwards, or if the player can move backwards,
                // Add the move to the moves array
                moves.push(possibleMove)
            }

            // If the mandatory capture is enabled, and the stone has moves which include captures,
            // Return the movesCaptures array, which contains only the moves that capture a stone
            if (
                mandatoryCapture && 
                movesCaptures.length > 0
            )
                return movesCaptures

            // If the mandatory capture is not enabled, and the movesCaptures array isn't empty, 
            // Concatenate the movesCaptures array to the moves array, and return the moves array.
            // If the movesCaptures array is empty, return the moves array, without concatenating the movesCaptures array, since it is empty anyway
            if (
                !mandatoryCapture && 
                movesCaptures.length > 0
            )
                moves = moves.concat(movesCaptures)
            return moves
        }

        const outOfBounds = (position) => {
            // Return if the position is out of bounds
            const [row, col] = position;
            return (
                row < 0 ||
                col < 0 ||
                row >= this.props.tilesPerRow ||
                col >= this.props.tilesPerRow
            )
        }

        function addPossibleMove(endPosition, capturedPosition) {
            stoneMoves.push({
                endPosition,
                capturedPosition
            });
        }

        const [row, col] = this.position
        for (const direction of directions) {
            const [rowDirection, colDirection] = direction;
            const neighbourRow = row + rowDirection;
            const neighbourCol = col + colDirection;
            const neighbourPos = [neighbourRow, neighbourCol];

            // If the neighbour position is out of bounds, continue
            if (outOfBounds(neighbourPos))
                continue

            // If the neighbour position is empty, add the neighbour position to the possible moves, and continue
            const stonesInformation = this.props.stonesInformation;
            if (stonesInformation[neighbourPos] === undefined) {
                addPossibleMove(neighbourPos, null);
                continue
            }

            // If the neighbour position already has a stone of the same player, continue
            if (stonesInformation[neighbourPos].player === this.player)
                continue

            // If the neighbour position already has a stone, but it is not the same player, 
            // Calculate if the player can jump over the stone to capture it
            const jumpRow = neighbourRow + rowDirection;
            const jumpCol = neighbourCol + colDirection;
            const jumpPos = [jumpRow, jumpCol];
            
            // If the jump position is out of bounds, continue
            if (outOfBounds(jumpPos))
                continue

            // If the jump position is empty, which means the player can jump over the stone to capture it,
            // Add the jump position to the possible moves, and continue
            if (stonesInformation[jumpPos] === undefined)
                addPossibleMove(jumpPos, neighbourPos);
        }

        // Filter the possible moves based on the game rules, and return the filtered moves
        stoneMoves = filteredMoves();
        return stoneMoves
    }

    get possibleDropZones() {
        // Calculate the X and Y coordinates of the tile where the stone can be dropped
        // This will be done based on the tileDimensions, and the possibleDropPositions,
        // When done, it will return an array of objects with the coordinates of the possible tiles where the stone can be dropped
        const tileDimensions = this.props.tileDimensions;
        const possibleDropPositions = this.props.allStonesMoves[this.position].map((possibleMove) => possibleMove.endPosition);
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
        const [row, col] = this.position;

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
        if (!this.canMove)
            return

        // If the stone is already chosen, return
        if (this.stoneChosen)
            return

        // Set the chosen position to the position of the stone
        this.props.setChosenPosition(this.position);
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
        // If the mouse coordinates are not inside any of the possible drop zones, Do nothing
        for (const [key, possibleDropZone] of this.possibleDropZones.entries()) {
            const startingWidth = possibleDropZone.startingWidth;
            const startingHeight = possibleDropZone.startingHeight;
            if (
                clientX < startingWidth ||
                clientX > startingWidth + this.props.tileDimensions.width ||
                clientY < startingHeight ||
                clientY > startingHeight + this.props.tileDimensions.height
            )
                continue

            // Move the stone to the position of the drop zone, and remove the captured stone if a stone has been captured
            const chosenStoneMove = this.props.allStonesMoves[this.position][key]
            const chosenPosition = chosenStoneMove.endPosition;
            const capturedPosition = chosenStoneMove.capturedPosition;
            this.props.moveChosenStone(chosenPosition, capturedPosition);
        }
    }

    render() {
        const stoneDimensions = this.stoneDimensions;
        const stoneColor = this.player === 1 ? "black" : "white";
        const canMove = this.canMove;
        return (
            <div
                className="position-absolute rounded-circle border border-dark"
                style={{
                    backgroundColor: this.stoneChosen ? "green" : stoneColor,
                    width: `${stoneDimensions.width}px`,
                    height: `${stoneDimensions.height}px`,
                    left: `${stoneDimensions.left}px`,
                    top: `${stoneDimensions.top}px`,
                    boxShadow: canMove ? "0 0 1vw #00ff3c" : `0 0 1px ${stoneColor}`,
                    cursor: canMove ? "pointer" : "not-allowed"
                }}
                draggable={canMove}
                onClick={this.stoneClicked}
                onDragStart={this.stoneClicked}
                onDragEnd={this.onDragEnd}
            >
                {this.isKing &&
                    <FontAwesomeIcon 
                        icon={faCrown}
                        className="position-absolute"
                        style={{
                            width: `${stoneDimensions.width * 0.5}px`,
                            height: `${stoneDimensions.height * 0.5}px`,
                            left: `${(stoneDimensions.width - stoneDimensions.width * 0.5) / 2}px`,
                            top: `${(stoneDimensions.height - stoneDimensions.height * 0.5) / 2}px`,
                            color: "gold"
                        }}
                    />
                }
            </div>
        );
    }
}

export default Stone;