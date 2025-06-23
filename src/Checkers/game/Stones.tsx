import { Component } from 'react';
import { currentPlayerMoves, stoneIsPromotedDuringTheMove, CurrentPlayerMoves, Position, StoneData } from './calculateMoves.ts'; 
import { CurrentPlayer, GameData, IndexedStoneGrid } from './gameData.ts';
import Stone from './Stone.tsx';

/**
 * Props for the Stones component.
 * - tileSize: The size of the tiles in the board.
 * - setWinner: Function to set the winner of the game.
 * - gameDataPresent: A boolean value indicating whether the game data is present in the local storage.
 * - gameData: The game data object containing the current player and board state.
 * - setGameData: Function to set the game data.
 */
interface StonesProps {
    tileSize: number,
    setWinner: (player: CurrentPlayer) => void;
    gameDataPresent: boolean;
    gameData: GameData;
    setGameData: (gameData: GameData) => void;
}

/**
 * State for the Stones component.
 * - chosenPosition: Position of the stone that is chosen. Used to highlight the stone and show the possible moves.
 * - currentPlayerMoves: List with objects containing the possible moves for the current player.
 * - chosenStoneIsBeingDragged: flag to indicate if the chosen stone is being dragged.
 */
interface StonesState {
    chosenPosition: Position | null;
    currentPlayerMoves: CurrentPlayerMoves;
    chosenStoneIsBeingDragged: boolean;
}

class Stones extends Component<StonesProps, StonesState> {
    playerOneStonesAmount = 0; // Amount of stones for player one
    playerTwoStonesAmount = 0; // Amount of stones for player two

    constructor(props: StonesProps) {
        super(props);
        this.state = {
            chosenPosition: null,
            currentPlayerMoves: {},
            chosenStoneIsBeingDragged: false
        };
    }

    /**
     * Lifecycle method that is called when the component is mounted.
     * In this method, we set the stones amount for each player (playerOneStonesAmount and playerTwoStonesAmount),
     * and set the current player moves based on the initial board grid and current player.
     * @return {void}
     */
    componentDidMount(): void {
        // Reset the stone counts for both players to 0 each time the component mounts.
        // This prevents incorrect doubling of the counts, which can happen in development mode when using <React.StrictMode> at the root of the application.
        // React intentionally mounts components twice to help catch side effects. Which is why we need to reset the counts here.
        this.playerOneStonesAmount = 0;
        this.playerTwoStonesAmount = 0;

        // Count the amount of stones for each player on the board
        this.props.gameData.board.forEach((row) => {
            row.forEach((stone) => {
                if (!stone) {
                    return
                }
                if (stone.player === 1) {
                    this.playerOneStonesAmount += 1;
                } else {
                    this.playerTwoStonesAmount += 1;
                }
            })
        });

        // Set the current player moves based on the current board grid and current player
        this.currentPlayerMoves = currentPlayerMoves(this.props.gameData.board, this.props.gameData.currentPlayer);
    }

    /**
     * Lifecycle method that is called when the component is updated.
     * This method is used to update the current player moves based on the updated board and current player.
     * @param {Readonly<StonesProps>} prevProps - The previous props of the component.
     * @return {void}
     */
    componentDidUpdate(prevProps: Readonly<StonesProps>): void {
        // If the current player has been changed, which also indicates that the board has been updated,
        // change the current player moves based on the new board gameData and current player.
        if (this.props.gameData.currentPlayer !== prevProps.gameData.currentPlayer) {
            this.currentPlayerMoves = currentPlayerMoves(this.props.gameData.board, this.props.gameData.currentPlayer);
        }
    }

    /**
     * Set the flag indicating if the chosen stone is being dragged.
     * @param {boolean} flag - The flag to set, true if the stone is being dragged, false otherwise.
     * @return {void}
     */
    setChosenStoneIsBeingDragged = (flag: boolean): void => {
        this.setState({
            chosenStoneIsBeingDragged: flag
        });
    }

    /**
     * Set the moves for the current player based on the current board grid.
     * This function is called when the component is mounted or when the board grid changes.
     * @param {CurrentPlayerMoves} moves - The current player moves object containing the possible moves for the current player.
     */
    set currentPlayerMoves(moves: CurrentPlayerMoves) {
        this.setState({
            currentPlayerMoves: moves
        });
    }

    /**
     * Set the chosen position of the stone.
     * This function is called when a stone is clicked, which sets the chosen position to highlight the stone and show the possible moves for that stone.
     * @param {Position | null} position - The position of the stone that is chosen
     * @return {void}
     */
    setChosenPosition = (position: Position | null): void => {
        this.setState({
            chosenPosition: position
        });
    }

    /**
     * Move the chosen stone to the chosen position which was highlighted on the board.
     * @param {Position} dropPosition - The position where the stone has been dropped.
     * @param {number} chosenMoveIndex - The index of the move in the moves of the chosen stone.
     * @returns {void}
     */
    moveChosenStone = (dropPosition: Position, chosenMoveIndex: number): void => {
        const board = this.props.gameData.board as IndexedStoneGrid;

        // Move the stone to the new position
        const [row, col] = this.state.chosenPosition as Position;
        const stone = board[row][col] as StoneData;
        const [dropRow, dropCol] = dropPosition;

        // Set the stone to the new position
        board[dropRow][dropCol] = stone;

        // Remove the stone from the original position
        board[row][col] = null;

        // Remove the captured stones if one or more stones were captured during the move
        const chosenStoneMove = this.state.currentPlayerMoves[(this.state.chosenPosition as Position).toString()][chosenMoveIndex];
        const capturedPositions = chosenStoneMove.capturedPositions as Array<Position>;
        capturedPositions.forEach(capturedPosition => {
            const [capturedRow, capturedCol] = capturedPosition;
            const capturedStone = board[capturedRow][capturedCol] as StoneData;

            // Decrease the stone count of the enemy player
            if (capturedStone.player === 1) {
                this.playerOneStonesAmount -= 1;
            } else {
                this.playerTwoStonesAmount -= 1;
            }

            // Remove the captured stone from the board
            board[capturedRow][capturedCol] = null;
        });

        // If the stone is promoted during the move, promote the stone to a king
        if (stoneIsPromotedDuringTheMove(chosenStoneMove, stone)) {
            stone.isKing = true;
        }

        // Update the game data with the updated board and switch the current player
        const switchedPlayer = this.props.gameData.currentPlayer === 1 ? 2 : 1;
        this.props.setGameData({
            board: board,
            currentPlayer: switchedPlayer
        });

        // Unset the chosen position.
        // This removes the highlight from the chosen stone which was moved
        this.setChosenPosition(null);

        // If one of the players has no stones left, set the winner and end the game
        if (
            this.playerOneStonesAmount === 0 || 
            this.playerTwoStonesAmount === 0
        ) {
            const winner = this.playerOneStonesAmount === 0 ? 2 : 1;
            this.props.setWinner(winner);
            return
        }

        // Set the current player moves based on the new board grid, and the switched player
        this.currentPlayerMoves = currentPlayerMoves(board, switchedPlayer);
    }

    render() {
        return (
            <>
                {this.props.gameData.board.flatMap((boardGridRow, row) =>
                    boardGridRow.map((stone, col) => {
                        const positionString = `${row},${col}`;
                        return (
                            stone && <Stone
                                currentPlayer={this.props.gameData.currentPlayer}
                                player={stone.player}
                                isKing={stone.isKing}
                                stoneMoves={this.state.currentPlayerMoves[positionString] ?? []}
                                stoneChosen={this.state.chosenPosition?.toString() === positionString}
                                setChosenPosition={this.setChosenPosition}
                                position={[row, col]}
                                tileSize={this.props.tileSize}
                                moveChosenStone={this.moveChosenStone}
                                setChosenStoneIsBeingDragged={this.setChosenStoneIsBeingDragged}
                                chosenStoneIsBeingDragged={this.state.chosenStoneIsBeingDragged}
                                key={stone.index}
                            />
                        )
                    })
                )}
            </>
        )
    }
}

export default Stones;