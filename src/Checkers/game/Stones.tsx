import { FC } from 'react';
import { useGameStorageContext } from './gameStorage/gameStorage.tsx';
import Stone from './Stone.tsx';

const Stones: FC = () => {
    const {
        boardGrid
    } = useGameStorageContext();
    
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