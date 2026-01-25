import { FC, useCallback, useEffect } from "react";
import { useUI } from "../ui/uiProvider/useUI.ts";
import useGame from "./gameProvider/useGame.ts";

/**
 * Props for the Game component.
 */
export interface GameProps {}

const Game: FC<GameProps> = () => {
    const {
        navigateTo
    } = useUI();

    const {
        isGamePaused,
        setIsGamePaused
    } = useGame();

    /**
     * Handles the keydown event.
     */
    const keydownHandler = useCallback((ev: KeyboardEvent) => {
        const pressedKey: string = ev.key;

        // Open the escape menu when the Escape key is pressed and the game is not paused yet
        if (pressedKey === 'Escape' && !isGamePaused) {
            navigateTo('escapeMenu');
            setIsGamePaused(true);
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
    
    return null;
}

export default Game;