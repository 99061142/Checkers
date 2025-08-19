import { FC } from "react";
import { Button } from "react-bootstrap";
import { GameStorageProvider, useGameStorageContext } from "./gameStorage/gameStorage.tsx";

/**
 * Props for the GameOverOverlay component.
 * - `toggleComponent`: A function to toggle the visibility of different components within the application.
 */
interface GameOverOverlayProps {
    toggleComponent: (componentName: string) => void;
}

const GameOverOverlay: FC<GameOverOverlayProps> = ({ toggleComponent }) => {
    const { 
        winner, 
        clearGameData 
    } = useGameStorageContext();

    /**
     * Handles the main menu button click event.
     * - Clears the game data which is stored in the local storage, and state.
     * - Toggles the visibility of the main menu component.
     * @returns {void}
     */
    const mainMenuButtonOnClickHandler = (): void => {
        clearGameData();
        toggleComponent("mainMenu");
    }

    return (
        <div
            data-testid="gameOverOverlay"
            className="position-absolute d-flex flex-column justify-content-center align-items-center game-over-overlay"
            style={{
                width: "100vw",
                height: "100vh",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                backdropFilter: "blur(3px)"
            }}
        >
            <h1
                className="text-center text-white"
                style={{
                    fontSize: "7.5vw",
                    marginBottom: "10vh"
                }}
            >
                PLAYER {winner} WINS!
            </h1>
            <Button
                data-testid="gameOverOverlayMainMenuButton"
                className="rounded-5 py-4"
                style={{
                    backgroundColor: "#000",
                    border: "3px #000 solid",
                    fontSize: "2vw",
                    color: "#fff"
                }}
                onClick={mainMenuButtonOnClickHandler}
            >
                Main Menu
            </Button>
        </div>
    );
}

export default function GameOverOverlayWithGameStorageProvider({ toggleComponent }: GameOverOverlayProps) {
    return (
        <GameStorageProvider>
            <GameOverOverlay 
                toggleComponent={toggleComponent} 
            />
        </GameStorageProvider>
    );
}
