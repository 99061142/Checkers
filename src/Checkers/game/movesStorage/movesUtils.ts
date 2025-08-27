import { BoardRow, getStoredBoardRowsAmount, getStoredGameRulesValues, Player } from '../../settings/settingsStorage/settingsStorageUtils.ts';
import { BoardGrid, Stone } from '../gameStorage/gameStorageUtils.ts';

/**
 * A position on the board represented as a list of [row, column].
 */
export type Position = [number, number];

/**
 * A node in the move tree.
 * - `position`: The position of the stone after the move.
 * - `capturedPosition`: The position of the captured stone, or null if no stone was captured.
 * - `nodes`: An object containing the child nodes of the current node of the move tree.
 */
export interface MoveTreeNode {
    position: Position;
    capturedPosition: Position | null;
    nodes: MoveTreeNode[];
}

/**
 * An object containing the move trees for each stone.
 * The keys are the stringified positions of the stones, and the values are the corresponding move tree.
 */
export type MoveTrees = {
    [position: string]: MoveTreeNode;
};

/**
 * A direction where the stone can move to.
 * The first element is the row direction (1 for down, -1 for up), 
 * and the second element is the column direction (1 for right, -1 for left).
 */
type Direction = [
    1 | -1,
    1 | -1
];

/**
 * A list of directions where the stone can move to.
 */
type Directions = Direction[];

/**
 * Calculates the move tree for a given stone.
 * @param {BoardGrid} boardGrid - The current state of the board grid.
 * @param {Stone} stone - The stone for which to calculate the move tree for.
 * @returns {MoveTreeNode} - The move tree for the given stone.
 */
function calculateStoneMoveTrees(boardGrid: BoardGrid, stone: Stone): MoveTreeNode {
    //! TEMP RETURN
    return {
        position: stone.position,
        capturedPosition: null,
        nodes: []
    }

}

/**
 * Calculates the move trees for all the stones belonging to the current player.
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
            const stoneMoveTrees = calculateStoneMoveTrees(boardGrid, stone);

            // If the stone has no possible moves, skip it.
            if (!stoneMoveTrees.nodes.length) {
                continue
            }

            // Add the stone`s move tree to the object containing the move tree for each stone.
            const positionString = stone.position.toString();
            currentPlayerMoveTrees[positionString] = stoneMoveTrees;
        }
    }

    // If the game rules require mandatory capture, we filter the move trees to only include the moves that have the most possible amount of captures.
    // We do this after calculating the move trees for all the stones, since we need to know the maximum amount of captures possible for any stone before we can filter the move trees.
    const mandatoryCapture = getStoredGameRulesValues().mandatoryCapture;
    console.log(getStoredGameRulesValues())
    if (mandatoryCapture) {
        //! Implement filter logic for mandatory capture
    }

    return currentPlayerMoveTrees
}

let _currentPlayerCache: Player | null = null;
let _currentPlayerMoveTreesCache: MoveTrees | null = null;

export function getCurrentPlayerMoveTrees(boardGrid: BoardGrid, currentPlayer: Player): MoveTrees {
    // If the current player is the same as the cached current player, and the move trees are already calculated and cached, return the cached move trees.
    // When the `currentPlayer` parameter changes, we recalculate the move trees for the new current player and `boardGrid` parameter.
    if (
        _currentPlayerCache === currentPlayer && 
        _currentPlayerMoveTreesCache
    ) {
        return _currentPlayerMoveTreesCache;
    }

    // Set the cached current player to the current player.
    _currentPlayerCache = currentPlayer;


    // Calculate the move trees for the current player.
    const currentPlayerMoveTrees = calculateCurrentPlayerMoveTrees(boardGrid, currentPlayer);

    // Cache the calculated move trees for the current player.
    _currentPlayerMoveTreesCache = currentPlayerMoveTrees;

    return currentPlayerMoveTrees;
}


/**
 * Checks if a given position is out of the bounds of the board.
 * @param {Position} position - The position to check.
 * @param {BoardRow} [boardRowsAmount=getStoredBoardRowsAmount()] - The number of rows on the board. The default value is set to the local stored board rows amount.
 * @returns {boolean} - `true` if the position is out of bounds, `false` otherwise.
 */
export function isPositionOutOfBounds(position: Position, boardRowsAmount: BoardRow = getStoredBoardRowsAmount()): boolean {
    const [row, col] = position;
    const isPositionOutOfBounds = (
        row < 0 ||
        row >= boardRowsAmount ||
        col < 0 ||
        col >= boardRowsAmount
    )
    return isPositionOutOfBounds;
}