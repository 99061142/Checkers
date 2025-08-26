import { FC, MouseEvent, useMemo, DragEvent } from 'react';
import { Position } from '../movesStorage/movesUtils.ts';
import { Player } from '../../settings/settingsStorage/settingsStorageUtils.ts';
import { useGameStorageContext } from '../gameStorage/gameStorage.tsx';
import { useMovesStorageProvider } from '../movesStorage/movesStorage.tsx';
import KingIcon from './KingIcon.tsx';
import './stoneStyles.scss';

/**
 * Represents the properties of a stone in the game.
 * - `position`: The position of the stone on the board.
 * - `player`: The player who owns the stone.
 * - `isKing`: Indicates whether the stone is a king.
 */
interface StoneProps {
    position: Position;
    player: Player;
    isKing: boolean;
}

/**
 * Represents the dimensions of a stone on the board.
 * - `diameter`: The diameter of the stone in pixels.
 * - `left`: The left position of the stone in pixels.
 * - `top`: The top position of the stone in pixels.
 */
interface StoneDimensions {
    diameter: number;
    left: number;
    top: number;
}

const Stone: FC<StoneProps> = (props) => {
    const {
        position,
        player,
        isKing
    } = props;

    const {
        tileSize,
        stoneDiameter,
        currentPlayer
    } = useGameStorageContext();

    const {
        selectedPosition,
        setSelectedPosition,
        currentPlayerMoveTrees
    } = useMovesStorageProvider();

    /**
     * Returns the dimensions of the stone based on its position, size of the tiles on the board, and the stone diameter.
     * @returns {StoneDimensions} - The dimensions of the stone.
     */
    const stoneDimensions = useMemo<StoneDimensions>(() => {
        const [row, col] = position;
        const centeringOffset = Math.round((tileSize - stoneDiameter) / 2 * 10) / 10;
        const left = Math.round((col * tileSize + centeringOffset) * 10) / 10;
        const top = Math.round((row * tileSize + centeringOffset) * 10) / 10;
        const stoneDimensions: StoneDimensions = {
            diameter: stoneDiameter,
            left,
            top
        };
        
        return stoneDimensions;
    }, [position, tileSize, stoneDiameter]);

    /**
     * Returns whether the stone can be moved or not.
     * - A stone can be moved if:
     *   * It belongs to the current player.
     *   * There are possible moves from its position.
     * @returns {boolean} - True if the stone can be moved, false otherwise.
     */
    const canMove = useMemo(() => {
        if (player !== currentPlayer) {
            return false;
        }

        const positionString = position.toString();
        if (!currentPlayerMoveTrees[positionString]) {
            return false;
        }

        return true;
    }, [currentPlayer, player, currentPlayerMoveTrees, position]);

    /**
     * Returns whether the stone is selected or not.
     * @returns {boolean} - True if the stone is selected, false otherwise.
     */
    const isSelected = useMemo(() => {
        if (!selectedPosition) {
            return false;
        }

        const isCurrentStoneSelected  = (
            selectedPosition[0] === position[0] &&
            selectedPosition[1] === position[1]
        );

        return isCurrentStoneSelected;
    }, [selectedPosition, position]);

    /**
     * Handles the mouse down event on the stone.
     * If the stone can be moved and is not already selected, it sets the stone as the selected position.
     * @param {MouseEvent<HTMLDivElement>} ev - The mouse event.
     * @returns {void}
     */
    const onmousedownHandler = (ev: MouseEvent<HTMLDivElement>): void => {
        if (!canMove) {
            ev.preventDefault();
            return;
        }

        if (!isSelected) {
            setSelectedPosition(position);
        }
    }

    /**
     * Handles the drag over event on the stone.
     * If the stone that is being dragged is being dragged over itself, it prevents the default behavior.
     * (Which is this use case removes the cursor "not-allowed" icon when dragging over itself).
     * @param {DragEvent<HTMLDivElement>} ev - The drag event.
     * @returns {void}
     */
    const ondragoverHandler = (ev: DragEvent<HTMLDivElement>): void => {
        if (isSelected) {
            ev.preventDefault();
        }
    }

    const { diameter, left, top } = stoneDimensions;
    return (
        <div
            className={
                'stone' +
                (isSelected ? ' selected-stone' : '')
            }
            style={{
                width: `${diameter}px`,
                height: `${diameter}px`,
                left: `${left}px`,
                top: `${top}px`,
                backgroundColor: `var(--player-${player}-stone-color)`
            }}
            draggable={canMove}
            onMouseDown={onmousedownHandler}
            onDragOver={ondragoverHandler}
        >
            {isKing &&
                <KingIcon />
            }
        </div>
    );
}

export default Stone;