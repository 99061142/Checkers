import { FC } from 'react';
import { useGameStorageContext } from './gameStorage/gameStorage.tsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCrown } from '@fortawesome/free-solid-svg-icons';

/**
 * Represents the dimensions of the KingIcon.
 * - `width`: The width of the icon in pixels.
 * - `height`: The height of the icon in pixels.
 * - `left`: The left position of the icon in pixels.
 * - `top`: The top position of the icon in pixels.
 */
interface KingIconDimensions {
    width: number;
    height: number;
    left: number;
    top: number;
}

/**
 * Represents the cache for the KingIcon dimensions.
 * - The key is the stone diameter, and the value is the dimensions of the icon.
 */
interface KingIconDimensionsCache {
    [stoneDiameter: number]: KingIconDimensions;
}

// The cache for the KingIcon dimensions.
const _KING_ICON_DIMENSIONS_CACHE: KingIconDimensionsCache = {};

/**
 * Represents the cache for the KingIcon component.
 * - The key is the stone diameter, and the value is the cached KingIcon FontAwesomeIcon component.
 */
interface KingIconCache {
    [stoneDiameter: number]: React.ReactNode;
}

// The cache for the KingIcon component.
const _KING_ICON_CACHE: KingIconCache = {};

const KingIcon: FC = () => {
    const { 
        stoneDiameter 
    } = useGameStorageContext();

    /**
     * Calculates the dimensions of the KingIcon based on the stone diameter.
     * @returns {KingIconDimensions} - An object containing the dimensions of the king icon.
     */
    const calculateDimensions = (): KingIconDimensions => {
        // If the dimensions are already cached for the current stone diameter,
        // return the cached dimensions.
        const cachedDimensions = _KING_ICON_DIMENSIONS_CACHE[stoneDiameter];
        if (cachedDimensions) {
            return cachedDimensions;
        }
        
        const iconSize = Math.round(stoneDiameter * 0.5 * 10) / 10;
        const iconCenterOffset = Math.round((stoneDiameter - iconSize) / 2 * 10) / 10;
        const iconDimensions: KingIconDimensions = {
            width: iconSize,
            height: iconSize,
            left: iconCenterOffset,
            top: iconCenterOffset
        }

        // Cache the dimensions for the current stone diameter.
        _KING_ICON_DIMENSIONS_CACHE[stoneDiameter] = iconDimensions;

        return iconDimensions;
    }
    
    /**
     * Returns the KingIcon component, either from the cache or by creating a new one.
     * @param {() => React.ReactNode} createKingIcon - A function that creates the KingIcon component.
     * @returns {React.ReactNode} - The KingIcon component.
     */
    const getKingIcon = (createKingIcon: () => React.ReactNode): React.ReactNode => {
        // If the KingIcon is already cached for the current stone diameter,
        // return the cached KingIcon component.
        const cachedKingIcon = _KING_ICON_CACHE[stoneDiameter];
        if (cachedKingIcon) {
            return cachedKingIcon;
        }

        // Otherwise, create a new KingIcon component and cache it.
        const kingIcon = createKingIcon();
        _KING_ICON_CACHE[stoneDiameter] = kingIcon;
        
        return kingIcon
    }

    return getKingIcon(
        () => {
            const { width, height, left, top } = calculateDimensions();
            return (
                <FontAwesomeIcon
                    icon={faCrown}
                    className='position-absolute'
                    style={{
                        width: `${width}px`,
                        height: `${height}px`,
                        left: `${left}px`,
                        top: `${top}px`,
                        color: 'gold'
                    }}
                />
            );
        }
    );
}



export default KingIcon;