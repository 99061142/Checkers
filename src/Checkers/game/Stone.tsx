import { FC, useCallback, useEffect, useState } from 'react';
import { Position } from './calculateMoves';
import { Player } from '../settings/settingsStorage/settingsStorageUtils.ts';
import { useGameStorageContext } from './gameStorage/gameStorage.tsx';
import KingIcon from './KingIcon.tsx';

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

/**
 * Cache for stone dimensions based on tile size and position.
 * We use this cache to avoid recalculating the dimensions of the stone for the same tile size and position.
 * The first depth is the tile size, and the second depth is the position of the stone.
 * This allows us to quickly retrieve the dimensions of the stone when the board gets resized, or when the stone is moved to a position that has already been calculated.
 */
interface StoneDimensionsCache {
    [tileSize: number]: {
        [position: string]: StoneDimensions;
    };
}

// The cache for the stone dimensions.
const _STONE_DIMENSIONS_CACHE: StoneDimensionsCache = {};

const Stone: FC<StoneProps> = (props) => {
    const {
        position,
        player,
        isKing
    } = props;

    const {
        tileSize,
        stoneDiameter
    } = useGameStorageContext();

    const [canMove, setCanMove] = useState<boolean>(true);
    const [stoneDimensions, setStoneDimensions] = useState<StoneDimensions>({
        diameter: 0,
        left: 0,
        top: 0
    });

    /**
     * Returns whether the stone can be moved or not.
     * @returns {boolean} - True if the stone can be moved, false otherwise.
     */
    const getCanMove = useCallback((): boolean => {
        //! Placeholder for actual logic to determine if the stone can be moved.
        return false;
    }, []);

    /**
     * Calculates the dimensions of the stone based on its position and the tile size.
     * @returns {StoneDimensions} - The dimensions of the stone.
     */
    const getStoneDimensions = useCallback((): StoneDimensions => {
        const positionString = position.toString();
        
        // If the stone dimensions are already cached for the current tile size and position,
        // return the cached dimensions.
        const cachedStoneDimensions = _STONE_DIMENSIONS_CACHE[tileSize]?.[positionString];
        if (cachedStoneDimensions) {
            return cachedStoneDimensions;
        }

        const [row, col] = position;
        const centeringOffset = Math.round((tileSize - stoneDiameter) / 2 * 10) / 10;
        const left = Math.round((col * tileSize + centeringOffset) * 10) / 10;
        const top = Math.round((row * tileSize + centeringOffset) * 10) / 10;
        const stoneDimensions: StoneDimensions = {
            diameter: stoneDiameter,
            left,
            top
        };

        // Cache the stone dimensions based on the current tile size and position.
        if (!_STONE_DIMENSIONS_CACHE[tileSize]) {
            _STONE_DIMENSIONS_CACHE[tileSize] = {};
        }
        _STONE_DIMENSIONS_CACHE[tileSize][positionString] = stoneDimensions;

        return stoneDimensions;
    }, [position, tileSize, stoneDiameter]);

    // Update the `canMove` state based on the result of `getCanMove` when the component mounts.
    useEffect(() => {
        const canMoveValue = getCanMove();
        setCanMove(canMoveValue);
    }, [getCanMove]);

    // Update the stone dimensions when the component mounts or when the tile size changes.
    useEffect(() => {
        if (!stoneDiameter) {
            return;
        }

        const dimensions = getStoneDimensions();
        setStoneDimensions(dimensions);
    }, [getStoneDimensions, stoneDiameter]);

    const color = player === 1 ? 'black' : 'white';
    return (
        <div
            className='position-absolute rounded-circle border border-dark stone'
            style={{
                backgroundColor: color,
                width: `${stoneDimensions.diameter}px`,
                height: `${stoneDimensions.diameter}px`,
                left: `${stoneDimensions.left}px`,
                top: `${stoneDimensions.top}px`,
                boxShadow: canMove ? '0 0 1vw #00ff3c' : `0 0 1px ${color}`,
                cursor: canMove ? 'pointer' : 'not-allowed'
            }}
            draggable={canMove}
        >
            {isKing &&
                <KingIcon />
            }
        </div>
    );
}

export default Stone;