import { FC, useCallback, useEffect } from 'react';
import { useGameStorageContext } from './gameStorage/gameStorage.tsx';
import { useSettingsStorageContext } from '../settings/settingsStorage/settingsStorage.tsx';
import Stones from './Stones.tsx';
import DropZones from './visualizer/dropZones/DropZones.tsx';

/**
 * Interface for the board dimensions.
 * - `boardSize`: The size of the board in pixels.
 * - `tileSize`: The size of each tile in pixels.
 */
interface BoardDimensions {
    boardSize: number;
    tileSize: number;
}

/**
 * Percentage of the board's container that the board can cover.
 */
const _BOARD_CONTAINER_COVERAGE_PERCENTAGE = .8;

const Board: FC = () => {
    const {
        tileSize,
        setTileSize,
        boardSize,
        setBoardSize
    } = useGameStorageContext();

    const {
        boardRowsAmount
    } = useSettingsStorageContext();

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
        const newTileSize = Math.floor(availableSize / boardRowsAmount);
        
        // Calculate the final board pixel size.
        // This ensures that the board and tiles are always evenly sized and the board remains a square.
        const newBoardSize = newTileSize * boardRowsAmount;

        const boardDimensions: BoardDimensions = {
            boardSize: newBoardSize,
            tileSize: newTileSize
        };
        return boardDimensions;
    }, [boardRowsAmount]);

    /**
     * Resizes the storage state of the board and tile size based on the current window size.
     * @returns {void}
     */
    const resizeHandler = useCallback((): void => {
        const {
            boardSize: newBoardSize,
            tileSize: newTileSize
        } = calculateBoardSizes();

        // If the recalculated tile size is the same as the current state,
        // we don't need to update the state.
        // We only check the tile size since if that changes, the board size also changes since the board size is dependent on the tile size.
        //! Do note that we check the tile size instead of the board size since the board size stays the same if the rows amount changes, while the tile size changes accordingly (since we do availableSize / rowsAmount).
        if (newTileSize === tileSize) {
            return;
        }
        
        setBoardSize(newBoardSize);
        setTileSize(newTileSize);
    }, [tileSize, setBoardSize, setTileSize, calculateBoardSizes]);

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

    // Gets the size of the backgroundSize on the board. 
    // We do this here so that we don't have to calculate it twice within the style object.
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
            <DropZones />
        </div>
    );
}

export default Board;