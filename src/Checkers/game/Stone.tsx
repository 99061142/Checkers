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
        tileSize
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
        const diameter = tileSize * 0.75;
        const centeringOffset = Math.round((tileSize - diameter) / 2 * 10) / 10;
        const left = Math.round((col * tileSize + centeringOffset) * 10) / 10;
        const top = Math.round((row * tileSize + centeringOffset) * 10) / 10;
        const stoneDimensions: StoneDimensions = {
            diameter,
            left,
            top
        };

        // Cache the stone dimensions based on the current tile size and position.
        if (!_STONE_DIMENSIONS_CACHE[tileSize]) {
            _STONE_DIMENSIONS_CACHE[tileSize] = {};
        }
        _STONE_DIMENSIONS_CACHE[tileSize][positionString] = stoneDimensions;

        return stoneDimensions;
    }, [position, tileSize]);

    // Update the `canMove` state based on the result of `getCanMove` when the component mounts.
    useEffect(() => {
        const canMoveValue = getCanMove();
        setCanMove(canMoveValue);
    }, [getCanMove]);

    // Update the stone dimensions when the component mounts or when the tile size changes.
    useEffect(() => {
        const dimensions = getStoneDimensions();
        setStoneDimensions(dimensions);
    }, [getStoneDimensions]);

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



/*
interface StoneProps {
    position: Position;
    player: CurrentPlayer;
    isKing: boolean;
    stoneMoves: StoneMoves | null;
}

interface StoneDimensions {
    diameter: number;
    left: number;
    top: number;
}

interface StoneDimensionsCache {
    [tileSize: string]: {
        [position: string]: StoneDimensions;
    }
}
const stoneDimensionsCache: StoneDimensionsCache = {};



const Stone: FC<StoneProps> = (props) => {
    const { position, player, isKing, stoneMoves } = props;
    
    const { 
        tileSize,
        currentPlayer,
        stoneDiameter
    } = useGameStorageContext();

    const {
        selectedPosition,
        updateSelectedPosition
    } = useMovesVisualizerStorageProviderContext();

    const [dimensions, setDimensions] = useState<StoneDimensions>({
        diameter: 0,
        left: 0,
        top: 0
    });
    const [canMove, setCanMove] = useState<boolean>(true);

    const isSelected = (
        selectedPosition !== null && 
        position[0] === selectedPosition[0] && 
        position[1] === selectedPosition[1]
    );

    const calculateDimensions = () => {
        const tileSizeString = tileSize.toString();
        const positionString = position.toString();

        // If the dimensions are already cached, return the cached dimensions.
        const cachedDimensions = stoneDimensionsCache[tileSizeString]?.[positionString];
        if (cachedDimensions) {
            return cachedDimensions;
        }

        const [row, col] = position;
        const centeringOffset = Math.round(((tileSize - stoneDiameter) / 2) * 10) / 10;
        const left = Math.round((col * tileSize + centeringOffset) * 10) / 10;
        const top = Math.round((row * tileSize + centeringOffset) * 10) / 10;
        const stoneDimensions: StoneDimensions = {
            diameter: stoneDiameter,
            left,
            top
        };

        // Cache the dimensions based on the tile size and position.
        if (!stoneDimensionsCache[tileSizeString]) {
            stoneDimensionsCache[tileSizeString] = {};
        }
        stoneDimensionsCache[tileSizeString][positionString] = stoneDimensions;

        return stoneDimensions;
    }

    useEffect(() => {
        const dimensions = calculateDimensions();
        setDimensions(dimensions);
    }, [stoneDiameter]);

    const getCanMove = () => {
        if (player !== currentPlayer) {
            return false;
        }

        if (!stoneMoves) {
            //return false;
        }

        return true;
    }

    useEffect(() => {
        const canMoveValue = getCanMove();

        
        setCanMove(canMoveValue);
    }, [stoneMoves]);


    const dragstartHandler = (ev: DragEvent<HTMLDivElement>): void => {
        // We don't allow the stone to be dragged if it can't be moved.
        if (!canMove) {
            return;
        }

        // If the stone can be moved, we set the data transfer id to 'stone'.
        // This will allow the drop zone to accept the stone when it is dropped,
        // since we will check if the data transfer id is 'stone' in the ondropHandler of the drop zone component.
        ev.dataTransfer.setData('text/plain', 'stone');
    }

    const onmousedownHandler = (): void => {
        if (!canMove) {
            return
        }

        if (!isSelected) {
            updateSelectedPosition(position);
        }
    }

    const { diameter, left, top } = dimensions;
    const color = player === 1 ? 'black' : 'white';
    return (
        <div
            className={
                'position-absolute rounded-circle border border-dark stone' +
                (isSelected ? ' selected' : '')
            }
            style={{
                backgroundColor: isSelected ? 'green' : color,
                width: `${diameter}px`,
                height: `${diameter}px`,
                left: `${left}px`,
                top: `${top}px`,
                boxShadow: canMove ? '0 0 1vw #00ff3c' : `0 0 1px ${color}`,
                cursor: canMove ? 'pointer' : 'not-allowed'
            }}
            draggable={canMove}
            onDragStart={dragstartHandler}
            onMouseDown={onmousedownHandler}
        >
            {isKing && 
                <KingIcon />
            }
        </div>
    )
}

export default Stone;*/