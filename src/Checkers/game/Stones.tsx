import { FC, useEffect } from 'react';
import { useGameStorageContext } from './gameStorage/gameStorage.tsx';
import Stone from './stone/Stone.tsx';

const Stones: FC = () => {
    const {
        boardGrid,
        setStoneDiameter,
        tileSize
    } = useGameStorageContext();
    
    // We set the `stoneDiameter` storage state based on the `tileSize` storage state.
    // We do this when the component mounts and when the `tileSize` changes.
    // This is used within the `Stone` component.
    // We set the `stoneDiameter` in this component since if we do it within the `Stone` component,
    // it would be set multiple times (once for each stone).
    useEffect(() => {
        const newStoneDiameter = tileSize * .75;
        setStoneDiameter(newStoneDiameter);
    }, [tileSize, setStoneDiameter]);

    return (
        <>
            {boardGrid.flatMap(row => 
                row.map(stone => {
                    if (!stone) {
                        return null;
                    }

                    const {
                        position,
                        player, 
                        isKing, 
                        id 
                    } = stone;

                    return (
                        <Stone
                            position={position}
                            player={player}
                            isKing={isKing}
                            key={id}
                        />
                    );
                })
            )}
        </>
    );
}

export default Stones;