import { FC, MouseEvent } from 'react';
import { Button, Col, Container } from 'react-bootstrap';
import { useGameStorageContext } from '../game/gameStorage/gameStorage.tsx';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useUI } from '../ui/uiProvider/useUI.ts';
import styles from './MainMenu.module.scss';

/**
 * Props for the MainMenu component.
 */
export interface MainMenuProps {
    
}

const MainMenu: FC<MainMenuProps> = () => {
    const {
        openRoot,
        navigateTo
    } = useUI();

    const {
        canGameBeLoaded,
        startNewGame,
        deleteGameData
    } = useGameStorageContext();
    
    /**
     * Handles the click event for the "New game" button.
     * - Display the game with new game data.
     * @returns {void}
     */
    const newGameButtonClicked = (): void => {
        startNewGame();
        openRoot('game');
    }

    /**
     * Handles the click event for the "Load game" button.
     * - Displays the game component with the saved game data.
     * @returns {void}
     */
    const loadGameButtonClicked = (): void => {
        openRoot('game');
    }

    /**
     * Handles the click event for the button that deletes the saved game data.
     * - Deletes the saved game data from storage.
     * @param {MouseEvent<HTMLButtonElement>} ev - The click event.
     * @returns {void}
     */
    const deleteSavedGameDataButtonClicked = (ev: MouseEvent<HTMLButtonElement>): void => {
        /// Prevent this button's click event from bubbling up and triggering the "Load game" button's onClick handler which is positioned beneath it.
        // This ensures only this button's click event occurs when clicked
        ev.stopPropagation();

        deleteGameData();
    }

    /**
     * Handles the click event for the "Settings" button.
     * - Displays the settings component.
     */
    const settingsButtonClicked = () => {
        navigateTo('settings');
    }
    
    return (
        <main
            data-testid='mainMenu'
            className='d-flex flex-column justify-content-center align-items-center vh-100 w-100'
        >
            <h1
                className={`fw-bold text-center ${styles.title}`}
            >
                MAIN MENU
            </h1>
            <Container
                className={`d-flex flex-column gap-5 justify-content-center align-items-center ${styles.buttonContainer}`}
            >
                <Col
                    as={Button}
                    className='w-100 rounded-5 py-4'
                    data-testid='newGameButton'
                    onClick={newGameButtonClicked}
                    tabIndex={0}
                >
                    New game
                </Col>
                <Col
                    className='position-relative d-flex flex-column w-100'
                >
                    <Button
                        className='rounded-5 py-4 position-relative'
                        data-testid='loadGameButton'
                        style={{
                            cursor: !canGameBeLoaded ? 'not-allowed' : 'pointer',
                            pointerEvents: !canGameBeLoaded ? 'all' : 'auto'
                        }}
                        disabled={!canGameBeLoaded}
                        onClick={loadGameButtonClicked}
                        tabIndex={1}
                    >
                        Load game
                    </Button>
                    <Button
                        className='position-absolute top-0 end-0 py-3 px-4 bg-transparent border-0'
                        data-testid='deleteSavedGameDataButton'
                        onClick={deleteSavedGameDataButtonClicked}
                        aria-disabled={!canGameBeLoaded}
                        tabIndex={canGameBeLoaded ? 2 : -1}
                        style={{
                            cursor: canGameBeLoaded ? 'pointer' : 'not-allowed',
                            pointerEvents: canGameBeLoaded ? 'all' : 'none'
                        }}
                    >
                        <FontAwesomeIcon
                            icon={faTrashCan}
                            className='text-danger fs-4'
                        />
                    </Button>
                </Col>
                <Col
                    as={Button}
                    className='w-100 rounded-5 py-4'
                    data-testid='settingsButton'
                    onClick={settingsButtonClicked}
                    tabIndex={3}
                >
                    Settings
                </Col>
            </Container>
        </main>
    )
}

export default MainMenu;