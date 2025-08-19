import { FC, lazy, Suspense, useEffect } from 'react';
import { useGameStorageContext } from './gameStorage/gameStorage.tsx';
import { ComponentName } from '../Window.tsx';
import LoadingFallback from '../LoadingFallback.tsx';
import Board from './Board.tsx';
const GameOverOverlay = lazy(() => import('./GameOverOverlay.tsx'));

/**
 * Props for the Game component.
 * - `toggleComponent`: Function to toggle the current component.
 */
interface GameProps {
    toggleComponent: (componentName: ComponentName) => void;
}

const Game: FC<GameProps> = (props) => {
    const {
        toggleComponent
    } = props;

    const { 
        isGameOver, 
        winner
    } = useGameStorageContext();

    /**
     * Checks if the game over overlay should be displayed.
     * @returns {boolean} - True if the game is over and there is a winner, false otherwise.
     */
    function shouldDisplayGameOverOverlay(): boolean {
        const shouldDisplayGameOverOverlay = (
            isGameOver &&
            winner !== null
        );
        return shouldDisplayGameOverOverlay;
    }

    /**
     * - When the component mounts, it adds a keydown event listener to the window.
     * - When the component unmounts, it removes the keydown event listener.
     */
    useEffect(() => {
        /**
         * Handles the keydown event.
         * - If the Escape key is pressed, it toggles the escape menu component.
         * @param {KeyboardEvent} ev - The keyboard event.
         * @returns {void}
         */
        const keydownHandler = (ev: KeyboardEvent): void => {
            const pressedKey = ev.key;
            if (pressedKey === 'Escape') {
                toggleComponent('escapeMenu');
            }
        }

        window.addEventListener('keydown', keydownHandler);
        return () => {
            window.removeEventListener('keydown', keydownHandler);
        };
    }, [toggleComponent]);

    return (
        <>
            {shouldDisplayGameOverOverlay() && (
                <Suspense 
                    fallback={<LoadingFallback />}
                >
                    <GameOverOverlay
                        toggleComponent={toggleComponent}
                    />
                </Suspense>
            )}
            <Board />
        </>
    );
}

export default Game;