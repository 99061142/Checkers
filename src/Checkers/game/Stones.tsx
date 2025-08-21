import { FC, useEffect } from 'react';
import { useGameStorageContext } from './gameStorage/gameStorage.tsx';
import Stone from './Stone.tsx';

const Stones: FC = () => {
    const {
        boardGrid,
        setStoneDiameter,
        tileSize
    } = useGameStorageContext();
    
    // Set the `stoneDiameter` storage state based on the `tileSize` storage state.
    // We do this when the component mounts and when the `tileSize` changes.
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