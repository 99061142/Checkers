import { FC, useEffect, useMemo } from 'react';
import { useMovesStorageProvider } from '../../movesStorage/movesStorage.tsx';
import { getDropZonesWithinMoveTree, Position } from '../../movesStorage/movesUtils.ts';
import { useGameStorageContext } from '../../gameStorage/gameStorage.tsx';
import DropZone from './DropZone.tsx';
import '../visualizerStyling.scss';

/**
 * Cache for the drop zones based on selected positions.
 * - `key`: A string representation of the selected position.
 * - `value`: An array of positions representing the drop zones for that selected position.
 */
interface DropZonesCache {
    [position: string]: Position[];
}

let _dropZonesCache: DropZonesCache = {};

const DropZones: FC = () => {
	const {
        currentPlayerMoveTrees,
        selectedPosition
    } = useMovesStorageProvider();

    const {
        currentPlayer
    } = useGameStorageContext();

    
    const dropZonePositions = useMemo(() => {
        // If we don't have a selected position, we can't determine the drop zones.
        // Because of this, we return an empty array.
        if (!selectedPosition) {
            return [];
        }

        // Get the tree which contains all the possible moves for the selected position.
        const selectedPositionString = selectedPosition.toString();
        const selectedPositionMoveTree = currentPlayerMoveTrees[selectedPositionString];

        // Get the drop zones from cache if they exist.
        if (_dropZonesCache[selectedPositionString]) {
            return _dropZonesCache[selectedPositionString];
        }

        // If not, calculate the drop zones within the move tree, and cache them.
        const dropZones = getDropZonesWithinMoveTree(selectedPositionMoveTree);
        _dropZonesCache[selectedPositionString] = dropZones;

        // Return the calculated drop zones.
        return dropZones;
    }, [currentPlayerMoveTrees, selectedPosition]);

    useEffect(() => {
        // Clear the drop zones cache when the current player changes.
        // This is necessary because when the current player changes, it means the board also changed,
        // and therefore the possible drop zones also change.
        _dropZonesCache = {}
    }, [currentPlayer]);

    return (
        <>
            {dropZonePositions.map((position, index) => 
                <DropZone 
                    position={position}
                    key={index}
                />
            )}
        </>
    );
}

export default DropZones;