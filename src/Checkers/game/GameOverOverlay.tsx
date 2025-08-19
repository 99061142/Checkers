import { FC } from 'react';
import { Button } from 'react-bootstrap';
import { useGameStorageContext } from './gameStorage/gameStorage.tsx';
import { ComponentName } from '../Window.tsx';

/**
 * Props for the GameOverOverlay component.
 * - `toggleComponent`: Function to toggle the current component.
 */
interface GameOverOverlayProps {
    toggleComponent: (componentName: ComponentName) => void;
}

const GameOverOverlay: FC<GameOverOverlayProps> = (props) => {
    const {
        toggleComponent
    } = props;

    const { 
        winner, 
        deleteGameData
    } = useGameStorageContext();

    /**
     * Handles the main menu button click event.
     * - Clears the game data from the local storage, and corresponding state.
     * - Toggles the visibility of the main menu component.
     * @returns {void}
     */
    const mainMenuButtonOnClickHandler = (): void => {
        deleteGameData();
        toggleComponent('mainMenu');
    }

    return (
        <div
            data-testid='gameOverOverlay'
            className='position-absolute d-flex flex-column justify-content-center align-items-center game-over-overlay'
            style={{
                width: '100vw',
                height: '100vh',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                backdropFilter: 'blur(3px)'
            }}
        >
            <h1
                className='text-center text-white'
                style={{
                    fontSize: '7.5vw',
                    marginBottom: '10vh'
                }}
            >
                PLAYER {winner} WINS!
            </h1>
            <Button
                data-testid='gameOverOverlayMainMenuButton'
                className='rounded-5 py-4'
                style={{
                    backgroundColor: '#000',
                    border: '3px #000 solid',
                    fontSize: '2vw',
                    color: '#fff'
                }}
                onClick={mainMenuButtonOnClickHandler}
            >
                Main Menu
            </Button>
        </div>
    );
}

export default GameOverOverlay;
