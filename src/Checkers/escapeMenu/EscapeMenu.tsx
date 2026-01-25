import { FC, useCallback, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import useUI from '../ui/uiProvider/useUI.ts';
import styles from './EscapeMenu.module.scss';

/**
 * Props for the EscapeMenu component.
 */
export interface EscapeMenuProps {}

const EscapeMenu: FC<EscapeMenuProps> = () => {
    const {
        goBack,
        navigateTo,
        openRoot
    } = useUI();

    /**
     * Handler for the "Resume Game" button click event.
     * @returns {void}
     */
    const resumeButtonOnclickHandler = useCallback((): void => {
        goBack();
    }, [goBack]);

    /**
     * Handler for the "Main Menu" button click event.
     * @returns {void}
     */
    const mainMenuButtonOnclickHandler = useCallback((): void => {
        openRoot('mainMenu');
    }, [openRoot]);

    /**
     * Handler for the "Settings" button click event.
     * @returns {void}
     */
    const settingsButtonOnclickHandler = useCallback((): void => {
        navigateTo('settings');
    }, [navigateTo]);

    /**
     * Handler for the keydown event.
     * - If the Escape key is pressed, we resume the game.
     * @param {KeyboardEvent} ev - The keyboard event.
     */
    const keydownHandler = useCallback((ev: KeyboardEvent): void => {
        const pressedKey: string = ev.key;
        if (pressedKey === 'Escape') {
            resumeButtonOnclickHandler();
        }
    }, [resumeButtonOnclickHandler]);

    /**
     * Handles adding and removing the keydown event listener.
     */
    useEffect(() => {
        window.addEventListener('keydown', keydownHandler);
        return () => {
            window.removeEventListener('keydown', keydownHandler);
        };
    }, [keydownHandler]);

    return (
        <div
            data-testid='escapeMenu'
            className={`d-flex flex-column justify-content-center align-items-center ${styles.escapeMenuContainer}`}
        >
            <h1
                className={`text-center ${styles.title}`}
            >
                Escape Menu
            </h1>
            <div
                className={`d-flex gap-5 flex-column ${styles.buttonsContainer}`}
            >
                <Button
                    className='rounded-5 py-4'
                    data-testid='resumeGameButton'
                    onClick={resumeButtonOnclickHandler}
                >
                    Resume Game
                </Button>
                <Button
                    className='rounded-5 py-4'
                    data-testid='settingsButton'
                    onClick={settingsButtonOnclickHandler}
                >
                    Settings
                </Button>
                <Button
                    className='rounded-5 py-4'
                    data-testid='mainMenuButton'
                    onClick={mainMenuButtonOnclickHandler}
                >
                    Main Menu
                </Button>
            </div>
        </div>
    );
}

export default EscapeMenu;