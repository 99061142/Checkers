import { FC, useCallback, useEffect } from "react";
import { Button } from "react-bootstrap";
import { useUI } from "../../ui/uiProvider/useUI.ts";
import { ReactComponent as HamburgerIcon } from "../../assets/svg/navigation/hamburger-solid.svg";
import styles from "./NavigationMenu.module.scss";
import useGame from "../gameProvider/useGame.ts";

const NavigationMenu: FC = () => {
    const { 
        navigateTo 
    } = useUI();

    const {
        isGamePaused
    } = useGame();

    /**
     * Handles the click event on the hamburger button.
     */
    const hamburgerOnclickHandler = useCallback(() => {
        navigateTo('escapeMenu');
    }, [navigateTo]);

    /**
     * Handles the keydown event.
     */
    const keydownHandler = useCallback((ev: KeyboardEvent) => {
        const pressedKey: string = ev.key;

        // Open the escape menu when the Escape key is pressed and the game is not paused yet
        if (pressedKey === 'Escape' && !isGamePaused) {
            navigateTo('escapeMenu');
        }
    }, [navigateTo, isGamePaused]);

    /**
     * Sets up the keydown event listener.
     */
    useEffect(() => {
        window.addEventListener('keydown', keydownHandler);
        return () => {
            window.removeEventListener('keydown', keydownHandler);
        };
    }, [keydownHandler]);

    // Do not show the navigation menu if the game is paused.
    //! We do this check inside the component itself to avoid remounting it within the Game component.
    if (isGamePaused) {
        return null;
    }

    return (
        <Button
            data-testid="navigation-menu-hamburger-button"
            variant="light"
            onClick={hamburgerOnclickHandler}
            aria-label="Open escape menu"
            className="position-fixed top-0 end-0 mt-5 me-5"
        >
            <HamburgerIcon
                className={`d-flex justify-content-center align-items-center ${styles.hamburgerIcon}`}
            />
        </Button>
    );
};

export default NavigationMenu;