import { FC, MouseEvent } from 'react';
import { Button } from 'react-bootstrap';
import { useGameStorageContext } from './game/gameStorage/gameStorage.tsx';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ComponentName } from './window/Window.tsx';

/**
 * Props for the MainMenu component.
 * - `toggleComponent`: Function to toggle the current component.
 */
interface MainMenuProps {
    toggleComponent: (componentName: ComponentName) => void;
}

const MainMenu: FC<MainMenuProps> = (props) => {
    const { 
        toggleComponent 
    } = props;

    const {
        canGameBeLoaded,
        startNewGame,
        deleteGameData
    } = useGameStorageContext();
    
    /**
     * Handles the click event for the "New game" button.
     * - Starts a new game and toggles the component to `game`.
     * @returns {void}
     */
    const newGameButtonClicked = (): void => {
        startNewGame();
        toggleComponent('game');
    }

    /**
     * Handles the click event for the "Load game" button.
     * - Toggles the component to `game`.
     * @returns {void}
     */
    const loadGameButtonClicked = (): void => {
        toggleComponent('game');
    }

    /**
     * Handles the click event for the trash can button.
     * It deleted the saved game data from the local storage, and update the game state correspondingly.
     * @param {MouseEvent<HTMLButtonElement>} ev - The click event.
     * @returns {void}
     */
    const deleteSavedGameButtonClicked = (ev: MouseEvent<HTMLButtonElement>): void => {
        // Prevent that the click also triggers the button click event for any button below this button, which in this case is the "Load game" button.
        // This is to ensure that the game data is cleared, and the "load game" button event is not triggered.
        ev.stopPropagation();

        deleteGameData();
    }

    /**
     * Handles the click event for the "Settings" button.
     * - Toggles the component to `settings`.
     */
    const settingsButtonClicked = () => {
        toggleComponent('settings');
    }
    
    const buttonStyling = {
        background: 'linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), linear-gradient(135deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000)',
        border: '3px #000 solid',
        fontSize: '2vw',
        color: 'black'
    };
    return (
            <div
                data-testid='mainMenu'
                className='d-flex flex-column justify-content-center align-items-center'
                style={{
                    height: '100vh',
                    width: '100vw',
                    background: 'linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), linear-gradient(135deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000)'
                }}
            >
                <h1
                    className='text-center'
                    style={{
                        fontSize: '7.5vw',
                        marginBottom: '10vh'
                    }}
                >
                    MAIN MENU
                </h1>
                <div
                    className='d-flex gap-5 flex-column'
                    style={{
                        width: '40vw'
                    }}
                >
                    <Button
                        className='rounded-5 py-4'
                        data-testid='mainMenuNewGameButton'
                        style={buttonStyling}
                        onClick={newGameButtonClicked}
                        tabIndex={0}
                    >
                        New game
                    </Button>
                    <div
                        className='position-relative d-flex flex-column'
                        style={{
                            width: '100%',
                            height: '100%'
                        }}
                    >
                        <Button
                            className='rounded-5 py-4 w-100 h-100 position-relative text-center'
                            data-testid='mainMenuLoadGameButton'
                            style={{
                                ...buttonStyling,
                                cursor: !canGameBeLoaded ? 'not-allowed' : 'pointer',
                                pointerEvents: !canGameBeLoaded ? 'all' : 'auto' // Set the pointer events to "all" if there is no game data present. This is to allow the cursor styling to be applied when the button is disabled.
                            }}
                            disabled={!canGameBeLoaded}
                            onClick={loadGameButtonClicked}
                            tabIndex={1}
                        >
                            Load game
                        </Button>
                        <Button
                            className='position-absolute top-0 end-0 bg-transparent border-0'
                            data-testid='mainMenuDeleteSavedGameButton'
                            onClick={deleteSavedGameButtonClicked}
                            aria-disabled={!canGameBeLoaded}
                            tabIndex={canGameBeLoaded ? 2 : -1}
                            style={{
                                marginTop: '1vh',
                                marginRight: '1vw',
                                fontSize: '1.5vw',
                                cursor: canGameBeLoaded ? 'pointer' : 'not-allowed',
                                pointerEvents: canGameBeLoaded ? 'all' : 'none' // Set the pointer events to "all" if there is no game data present. This is to allow the cursor styling to be applied when the button is disabled.
                            }}
                        >
                            <FontAwesomeIcon
                                icon={faTrashCan}
                                className='text-danger m-0'
                            />
                        </Button>
                    </div>
                    <Button
                        className='rounded-5 py-4'
                        data-testid='mainMenuSettingsButton'
                        style={buttonStyling}
                        onClick={settingsButtonClicked}
                        tabIndex={3}
                    >
                        Settings
                    </Button>
                </div>
            </div>
    )
}

export default MainMenu;