import { BoardRow, getStoredBoardRowsAmount, getStoredGameRulesValues, Player } from '../../settings/settingsStorage/settingsStorageUtils.ts';
import { BoardGrid, Stone } from '../gameStorage/gameStorageUtils.ts';

/**
 * A position on the board represented as a list, where:
 * - The first element is the row index.
 * - The second element is the column index.
 */
export type Position = [number, number];

/**
 * A node in the move tree, where:
 * - `position`: The position of the stone after the move.
 * - `capturedPosition`: The position of the captured stone, or null if no stone was captured.
 * - `nodes`: An array of move tree nodes representing the possible subsequent moves from this position.
 */
export interface MoveTreeNode {
    position: Position;
    capturedPosition: Position | null;
    nodes: MoveTreeNode[];
}

/**
 * The move tree for a single stone, where:
 * - `position`: The starting position of the stone.
 * - `nodes`: An array of move tree nodes representing the possible moves from the starting position.
 */
interface MoveTree {
    position: Position;
    nodes: MoveTreeNode[];
}

/**
 * An object containing the move trees for all stones which can be moved by the current player, where:
 * - The key is the string representation of the stone's position.
 * - The value is the move tree for that stone.
 */
export type MoveTrees = {
    [position: string]: MoveTree;
};

/**
 * A direction where the stone can move to, where:
 * - The first element is the row direction (1 for down, -1 for up),
 * - The second element is the column direction (1 for right, -1 for left).
 */
type Direction = [
    1 | -1,
    1 | -1
];

/**
 * An array of directions where the stone can move to.
 */
type Directions = Direction[];

/**
 * All possible directions a stone can move to, where:
 * - index 0: Down-Right
 * - index 1: Down-Left
 * - index 2: Up-Right
 * - index 3: Up-Left
 */
const _DIRECTIONS: Directions = [
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1]
];

/**
 * Filters out the mirrored direction from the given directions array.
 * For example, if the directions array contains [1, 1] (down-right) and the previous direction is [-1, -1] (up-left),
 * the function will remove [1, 1] from the directions array.
 * This needs to be done to prevent a stone from moving back to the position it just came from in a multi-capture move.
 * @param {Directions} directions - The array of directions to filter.
 * @param {Direction | null} previousDirection - The previous direction taken, or null if there is no previous direction.
 * @returns {Directions} - The filtered array of directions without the mirrored direction.
 */
function filteredOutMirroredDirection(directions: Directions, previousDirection: Direction | null): Directions {
    // If there is no previous direction, return the original directions array.
    if (!previousDirection) {
        return directions;
    }

    // Get the mirrored direction by negating both elements of the previous direction.
    const mirroredDirection: Direction = [
        -previousDirection[0] as 1 | -1,
        -previousDirection[1] as 1 | -1
    ];

    // Remove the mirrored direction from the directions array, and return the array without it.
    for (let i = 0; i < directions.length; i++) {
        if (
            directions[i][0] === mirroredDirection[0] && 
            directions[i][1] === mirroredDirection[1]
        ) {
            directions.splice(i, 1);
            return directions;
        }
    }

    // If the mirrored direction was not found in the directions array, throw an error.
    // This should never happen, except when the `directions` array is empty or incorrectly updated without our knowledge.
    throw new Error(`The mirrored direction we want to filter out (${mirroredDirection}) was not found in the directions array.`);
}

/**
 * Gets the valid directions a stone can move to based on its properties and the game rules.
 * @param {Stone} stone - The stone for which to get the valid directions for. 
 * @param {Direction | null} previousDirection - The previous direction taken, or null if there is no previous direction.
 * @param {boolean} canMoveBackwards - Whether the stone can move backwards based on the game rules. This does not take into account if the stone is a king, or if this is a multi-capture move (which could be seen if `previousDirection` is not null).
 * @returns {Directions} - The valid directions the stone can move to.
 */
function getDirections(stone: Stone, previousDirection: Direction | null = null, canMoveBackwards: boolean = getStoredGameRulesValues().canMoveBackwards): Directions {
    // Let the starting and ending index for slicing the _DIRECTIONS array be the full array by default. This means we consider all directions before changing these values based on the stone properties and game rules.
    let startingIndex: number = 0;
    let endingIndex: number = _DIRECTIONS.length;

    // If the stone is not a king, the game rules do not allow moving backwards, or if this is not a recursive call (meaning this isn't a multi-capture move yet)
    if (
        !stone.isKing && 
        !canMoveBackwards && 
        !previousDirection
    ) {
        // If the stone belongs to player 2, it can only move upwards, so we set the starting index to 2 to only consider the upward directions.
        if (stone.player === 2) {
            startingIndex = 2;
        }
        // If the stone belongs to player 1, it can only move downwards, so we set the ending index to 2 to only consider the downward directions.
        else {
            endingIndex = 2;
        }
    }

    // Get the directions based on the starting and ending index.
    const slicedDirections = _DIRECTIONS.slice(startingIndex, endingIndex);

    // Get the directions based on the sliced directions, and filter out the mirrored direction if there is a previous direction.
    const directions = filteredOutMirroredDirection(slicedDirections, previousDirection);

    // Return the sliced and filtered directions.
    return directions;
}


/**
 * Gets the neighbouring position based on the given position and direction.
 * @param {Position} position - The current position of the stone. 
 * @param {Direction} direction - The direction to move in.
 * @returns {Position} - The neighbouring position. Which is the result of adding the direction to the current position.
 */
function getNeighbourPosition(position: Position, direction: Direction): Position {
    const [row, col] = position;
    const [directionRow, directionCol] = direction;
    const neighbourPosition: Position = [
        row + directionRow,
        col + directionCol
    ];
    return neighbourPosition;
}

/**
 * Gets the stone data at the given position on the board.
 * @param {BoardGrid} boardGrid - The current state of the board grid.
 * @param {Position} position - The position to get the stone data for.
 * @returns {Stone | null} - The stone at the given position, or null if the position is empty.
 */
function positionData(boardGrid: BoardGrid, position: Position): Stone | null {
    const [row, col] = position;
    const positionData = boardGrid[row][col];
    return positionData;
}

/**
 * Return whether the given row is a promotion row for the given player.
 * @param {number} row - The row to check.
 * @param {Player} player - The player to check for.
 * @param {BoardRow} [boardRowsAmount=getStoredBoardRowsAmount()] - The number of rows on the board. The default value is set to the current stored board rows amount. (Which is the current board size).
 * @returns {boolean} - `true` if the row is a promotion row for the player, `false` otherwise.
 */
function isPromotionRow(row: number, player: Player, boardRowsAmount: BoardRow = getStoredBoardRowsAmount()): boolean {
    // If the player is 1, and the row is 0, it is a promotion row.
    // If the player is 2, and the row is the last row, it is a promotion row.
    if (
        (
            player === 1 && 
            row === 0
        ) ||
        (
            player === 2 && 
            row === boardRowsAmount - 1
        )
    ) {
        return true;
    }

    // In all other cases, it is not a promotion row.
    return false;
}

/**
 * Calculates the move trees for all the stones belonging to the current player, which can be moved based on the current board state and game rules.
 * @param {BoardGrid} boardGrid - The current state of the board grid.
 * @param {Player} currentPlayer - The current player which turn it currently is.
 * @returns {MoveTrees} - An object containing the moves tree for each stone belonging to the current player, which has possible moves based on the current board and game rules.
 */
export function calculateCurrentPlayerMoveTrees(boardGrid: BoardGrid, currentPlayer: Player): MoveTrees {
    const boardRowsAmount = boardGrid.length;
    const currentPlayerMoveTrees: MoveTrees = {};

    for (let row = 0; row < boardRowsAmount; row++) {
        for (let col = 0; col < boardRowsAmount; col++) {
            const stone = boardGrid[row][col];
            
            // If the cell is empty, or the stone does not belong to the current player, skip it.
            if (stone?.player !== currentPlayer) {
                continue
            }

            // Get the move tree for the stone.
            const stoneMoveTrees = calculateStoneMovesTree(boardGrid, stone, stone.position, currentPlayer);

            // If the stone has no possible moves, skip it.
            if (!stoneMoveTrees.nodes.length) {
                continue
            }

            // Add the stone move tree to the object containing the move tree for each stone.
            const positionString = stone.position.toString();
            currentPlayerMoveTrees[positionString] = stoneMoveTrees;
        }
    }

    // If the game rules require mandatory capture, we filter the move trees to only include the moves that have the most possible amount of captures.
    // ! We do this after calculating the move trees for all the stones, since we need to know the maximum amount of captures possible for any stone before we can filter the move trees.
    const mandatoryCapture = getStoredGameRulesValues().mandatoryCapture;
    if (mandatoryCapture) {
        //! Implement filter logic for mandatory capture
    }

    return currentPlayerMoveTrees
}

/**
 * Checks if a given position is out of the bounds of the board.
 * @param {Position} position - The position to check.
 * @param {BoardRow} [boardRowsAmount=getStoredBoardRowsAmount()] - The number of rows on the board. The default value is set to the current stored board rows amount. (Which is the current board size).
 * @returns {boolean} - `true` if the position is out of bounds, `false` otherwise.
 */
export function isPositionOutOfBounds(position: Position, boardRowsAmount: BoardRow = getStoredBoardRowsAmount()): boolean {
    const [row, col] = position;
    if (
        row < 0 ||
        col < 0 ||
        row >= boardRowsAmount ||
        col >= boardRowsAmount
    ) {
        return true;
    }
    return false;
}

/**
 * Gets the drop zones within a move tree.
 * @param {MoveTree} moveTree - The move tree to get the drop zones from. 
 * @returns {Position[]} - An array of unique drop zone positions.
 */
export function getDropZonesWithinMoveTree(moveTree: MoveTree): Position[] {
    // A map which stores all the unique drop zones found within the move tree.
    // We use a map to avoid duplicate drop zones, since a map is O(1) instead of O(n) like an array.
    const dropZonesMap: Map<string, Position> = new Map();

    // Traverse through the move tree recursively to find and add all the unique drop zones to the map.
    function traverseTree(node: MoveTree) {
        if (
            node.nodes.length === 0 &&
            !dropZonesMap.has(node.position.toString())
        ) {
            dropZonesMap.set(node.position.toString(), node.position);
        }

        for (const childNode of node.nodes) {
            traverseTree(childNode);
        }
    }
    traverseTree(moveTree);

    // Convert the map values to an array of positions.
    const dropZones: Position[] = Array.from(dropZonesMap.values());

    return dropZones;
}

/**
 * Applies a simulated capture on the board grid.
 * @param {BoardGrid} boardGrid - The current state of the board grid.
 * @param {Position} position - The position of the stone making the capture.
 * @param {Position} jumpPosition - The position the stone will jump to.
 * @param {Position} neighbourPosition - The position of the stone being captured.
 * @returns {Stone} - The stone that was captured.
 */
function applySimulatedCapture(boardGrid: BoardGrid, position: Position, jumpPosition: Position, neighbourPosition: Position): Stone {
    const [row, col] = position;
    const stone = boardGrid[row][col] as Stone;
    
    const [neighbourRow, neighbourCol] = neighbourPosition;
    const capturedStone = boardGrid[neighbourRow][neighbourCol] as Stone;

    // Remove the captured stone from the grid
    boardGrid[neighbourRow][neighbourCol] = null;

    // Remove the stone from its original position
    boardGrid[row][col] = null;

    // Place the stone at its new position after the capture
    const [jumpRow, jumpCol] = jumpPosition;
    boardGrid[jumpRow][jumpCol] = stone;

    return capturedStone;
}

/**
 * Reverts a simulated capture on the board grid.
 * @param {BoardGrid} boardGrid - The current state of the board grid.
 * @param {Position} position - The position of the stone making the capture.
 * @param {Position} jumpPosition - The position the stone jumped to.
 * @param {Position} neighbourPosition - The position of the stone being captured.
 * @param {Stone} capturedStone - The stone that was captured.
 * @returns {void}
 */
function revertSimulatedCapture(boardGrid: BoardGrid, position: Position, jumpPosition: Position, neighbourPosition: Position, capturedStone: Stone): void {
    const [jumpRow, jumpCol] = jumpPosition;

    // Get the stone that is currently at the new position
    const stone = boardGrid[jumpRow][jumpCol];

    // Remove the stone from the new position
    boardGrid[jumpRow][jumpCol] = null;

    // Place the stone back to its original position
    const [row, col] = position;
    boardGrid[row][col] = stone;

    // Place the captured stone back to its original position
    const [neighbourRow, neighbourCol] = neighbourPosition;
    boardGrid[neighbourRow][neighbourCol] = capturedStone;
}

/**
 * Creates the move tree for a given stone based on the current board state and game rules.
 * @param {BoardGrid} boardGrid - The current state of the board grid.
 * @param {Stone} stone - The stone for which to calculate the move tree for.
 * @param {Position} position - The current position of the stone.
 * @param {Player} currentPlayer - The current player which turn it currently is.
 * @param {Direction | null} previousDirection - The previous direction taken, or null if there is no previous direction.
 * @param {boolean} [turnEndsOnPromotion=getStoredGameRulesValues().turnEndsOnPromotion] - Whether the turn ends when a stone is promoted based on the game rules. (The default value is set to the current stored `turnEndsOnPromotion` game rule value).
 * @returns {MoveTreeNode} - The move tree for the given stone.
 */
function calculateStoneMovesTree(boardGrid: BoardGrid, stone: Stone, position: Position, currentPlayer: Player, previousDirection: Direction | null = null, turnEndsOnPromotion: boolean = getStoredGameRulesValues().turnEndsOnPromotion): MoveTree {
    const moveTree: MoveTree = {
        position,
        nodes: []
    };

    const directions: Directions = getDirections(stone, previousDirection);
    for (const direction of directions) {
        const neighbourPosition = getNeighbourPosition(position, direction);

        if (isPositionOutOfBounds(neighbourPosition)) {
            continue;
        }

        const neighbourPositionData = positionData(boardGrid, neighbourPosition);

        // If the neighbour position is empty, we can move there directly.
        // In that case, we add the neighbour position as a move tree node and continue to the next iteration.
        if (
            !previousDirection &&
            !neighbourPositionData
        ) {
            moveTree.nodes.push({
                position: neighbourPosition,
                capturedPosition: null,
                nodes: []
            });
            continue;
        }

        // If the neighbour position is occupied by one of the current player's stones, we cannot move there.
        // In that case, we skip to the next iteration.
        if ((neighbourPositionData as Stone).player === currentPlayer) {
            continue;
        }

        // If the neighbour position is occupied by an opponent`s stone, we check if we can jump over it by checking the position behind it in the same direction.
        const jumpPosition = getNeighbourPosition(neighbourPosition, direction);
        
        // If the jump position is out of bounds, we cannot jump there.
        // In that case, we skip to the next iteration.
        if (isPositionOutOfBounds(jumpPosition)) {
            continue;
        }

        // If the jump position is occupied, we cannot jump there.
        // In that case, we skip to the next iteration.
        if (positionData(boardGrid, jumpPosition)) {
            continue;
        }

        // Simulate the capture on the board grid, by updating the board grid state accordingly.
        // Simutaneously, we store the captured stone data to be able to revert the simulated capture later.
        const capturedStone = applySimulatedCapture(boardGrid, position, jumpPosition, neighbourPosition);

        // If the `turnEndsOnPromotion` game rule is enabled, and the jump position is a promotion row for the stone, we add the jump position as a move tree node, 
        // revert the simulated capture on the board grid to restore the original board state, 
        // and continue to the next iteration.
        const nextPositionRow = jumpPosition[0];
        if (
            turnEndsOnPromotion && 
            isPromotionRow(nextPositionRow, stone.player)
        ) {
            moveTree.nodes.push({
                position: jumpPosition,
                capturedPosition: neighbourPosition,
                nodes: []
            });
            revertSimulatedCapture(boardGrid, position, jumpPosition, neighbourPosition, capturedStone);
            continue;
        }
        
        // If the `turnEndsOnPromotion` game rule is disabled, or the jump position is not a promotion row for the stone, we recursively calculate the move tree for the stone from the jump position.
        // Afterwards, we revert the simulated capture on the board grid to restore the original board state,
        // and add the jump position as a move tree node with the recursively calculated move tree nodes as its children.
        const treeNode = calculateStoneMovesTree(boardGrid, stone, jumpPosition, currentPlayer, direction);
        revertSimulatedCapture(boardGrid, position, jumpPosition, neighbourPosition, capturedStone);
        moveTree.nodes.push({
            position: jumpPosition,
            capturedPosition: neighbourPosition,
            nodes: treeNode.nodes
        });
    }

    return moveTree;
}