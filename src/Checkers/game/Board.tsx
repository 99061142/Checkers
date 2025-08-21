import { FC, useCallback, useEffect, useMemo } from 'react';
import { useGameStorageContext } from './gameStorage/gameStorage.tsx';
import { getBoardRowAmount } from '../settings/settingsStorage/settingsStorageUtils.ts';
import Stones from './Stones.tsx';

/**
 * Interface for the board dimensions.
 * - `boardSize`: The size of the board in pixels.
 * - `tileSize`: The size of each tile in pixels.
 */
interface BoardDimensions {
    boardSize: number;
    tileSize: number;
}

const _BOARD_CONTAINER_COVERAGE_PERCENTAGE = .8;

const Board: FC = () => {
    const {
        tileSize,
        setTileSize,
        boardSize,
        setBoardSize
    } = useGameStorageContext();

    // Get the number of rows for the board from the settings.
    // We use `useMemo` to ensure that the value is only calculated once and not on every render.
    // Do note that this only works since we will send the user to the main menu if the game is over. 
    // Which means that this component will be unmounted until the game is started again.
    const _BOARD_ROW_AMOUNT = useMemo(() => getBoardRowAmount(), []);

    /**
     * Calculates the sizes of the board and tiles based on the window size.
     * - It ensures that the board is square and fits within the available space.
     * @returns {BoardDimensions} - An object containing the board size and tile size.
     */
    const calculateBoardSizes = useCallback((): BoardDimensions => {
        // Calculate the maximum available space based on window size and the allowed coverage percentage.
        const availableHeight = window.innerHeight * _BOARD_CONTAINER_COVERAGE_PERCENTAGE;
        const availableWidth = window.innerWidth * _BOARD_CONTAINER_COVERAGE_PERCENTAGE;
        
        // Calculate the smallest dimension between the available height and width.
        const availableSize = Math.min(availableHeight, availableWidth);
        
        // Calculate the size of each tile in pixels
        const tileSize = Math.floor(availableSize / _BOARD_ROW_AMOUNT);
        
        // Calculate the final board pixel size.
        // This ensures that the board and tiles are always evenly sized and the board remains a square.
        const boardSize = tileSize * _BOARD_ROW_AMOUNT;

        const boardDimensions: BoardDimensions = {
            boardSize,
            tileSize
        };
        return boardDimensions;
    }, [_BOARD_ROW_AMOUNT]);

    /**
     * Resizes the storage state of the board size and tile size based on the current window size.
     * @returns {void}
     */
    const resizeHandler = useCallback((): void => {
        const { 
            boardSize: newBoardSize, 
            tileSize: newTileSize 
        } = calculateBoardSizes();

        // If the recalculated board size is the same as the current state,
        // we don't need to update the state.
        if (newBoardSize === boardSize) {
            return;
        }

        setBoardSize(newBoardSize);
        setTileSize(newTileSize);
    }, [boardSize, setBoardSize, setTileSize, calculateBoardSizes]);

    // - When the component mounts, it adds a resize event listener to the window.
    // - When the component unmounts, it removes the resize event listener.
    useEffect(() => {
        window.addEventListener('resize', resizeHandler);
        return () => {
            window.removeEventListener('resize', resizeHandler);
        };
    }, [resizeHandler]);

    // Calculate and set the initial board size and tile size when the component mounts.
    useEffect(() => {
        resizeHandler();
    }, [resizeHandler]);

    // Calculate the size of the backgroundSize of the board.
    const boardSquareSize = tileSize * 2;

    return (
        <div
            className='position-absolute m-auto top-0 bottom-0 start-0 end-0 border border-dark'
            data-testid='board'
            style={{
                width: `${boardSize}px`,
                height: `${boardSize}px`,
                background: 'linear-gradient(to bottom, black 50%, white 50%), linear-gradient(to right, white 50%, black 50%)',
                backgroundBlendMode: 'difference, normal',
                backgroundSize: `${boardSquareSize}px ${boardSquareSize}px`
            }}
        >
            <Stones />
        </div>
    );
}

export default Board;