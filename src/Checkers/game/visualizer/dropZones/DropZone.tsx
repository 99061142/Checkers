import { FC, useMemo, DragEvent } from 'react';
import { Position } from '../../movesStorage/movesUtils.ts';
import { useGameStorageContext } from '../../gameStorage/gameStorage.tsx';
import { useMovesStorageProvider } from '../../movesStorage/movesStorage.tsx';
import '../visualizerStyling.scss';

/**
 * Represents the dimensions of a drop zone on the board.
 * - `width`: The width of the drop zone in pixels.
 * - `height`: The height of the drop zone in pixels.
 * - `top`: The top position of the drop zone in pixels.
 * - `left`: The left position of the drop zone in pixels.
 */
interface DropZoneDimensions {
    width: number;
    height: number;
    top: number;
    left: number;
}

/**
 * Represents the properties of a drop zone in the game.
 * - `position`: The position of the drop zone on the board.
 */
interface DropZoneProps {
    position: Position;
}

const DropZone: FC<DropZoneProps> = (props) => {
    const {
        position
    } = props;
    
    const {
        tileSize
    } = useGameStorageContext();

    /**
     * Calculates the dimensions of the drop zone based on its position and the size of the tiles on the board.
     * @returns {DropZoneDimensions} - An object containing the dimensions of the drop zone.
     */
    const dropZoneDimensions = useMemo((): DropZoneDimensions => {
        const [row, col] = position;
        const top = row * tileSize;
        const left = col * tileSize;
        const dropZoneDimensions: DropZoneDimensions = {
            width: tileSize,
            height: tileSize,
            top,
            left
        };
        return dropZoneDimensions;
    }, [position, tileSize]);


    /**
     * Handles the click event on the drop zone.
     * Currently, this is a no-op function.
     */
    const onclickHandler = (): void => {
        return;
    }

    /**
     * Handles the drag over event on the drop zone.
     * This lets the user drop items on the drop zone by preventing the default behavior of the event.
     * @param {DragEvent<HTMLDivElement>} ev - The drag event.
     * @returns {void}
     */
    const ondragoverHandler = (ev: DragEvent<HTMLDivElement>): void => {
        ev.preventDefault();
    }

    /**
     * Handles the drop event on the drop zone.
     * * Log an warning if the dropped data is not 'stone'.
     * * Otherwise, in a later stage, handle the drop action for the stone to the drop zone position.
     * @param {DragEvent<HTMLDivElement>} ev - The drop event.
     * @returns {void}
     */
    const ondropHandler = (ev: DragEvent<HTMLDivElement>): void => {
        const droppedData = ev.dataTransfer.getData('text/plain');
        if (droppedData !== 'stone') {
            console.warn('The data that was dropped on the drop zone is not a stone.');
            return;
        }

        console.log("TO DO: handle the drop action for the stone to the drop zone at position:", position);
    }

    const { width, height, top, left } = dropZoneDimensions;
    return (
        <div
            className='drop-zone position-absolute'
            style={{
                width: `${width}px`,
                height: `${height}px`,
                top: `${top}px`,
                left: `${left}px`,
                cursor: 'pointer'
                // z-Index gets set in the zIndexStyles.scss file
            }}
            onClick={onclickHandler}
            onDragOver={ondragoverHandler}
            onDrop={ondropHandler}
        />
    )
}

export default DropZone;