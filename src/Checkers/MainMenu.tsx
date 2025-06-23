import { Component, MouseEvent } from 'react';
import { Button } from 'react-bootstrap';
import { clearGameData } from './game/gameData.ts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';

/**
 * Props for the MainMenu component.
 * - toggleComponent: Function to toggle the current component.
 * - setGameDataPresent: Function to mark whether the game data is present or not.
 * - gameDataPresent: A boolean value indicating whether the game data is present in the local storage.
 */
interface MainMenuProps {
    toggleComponent: (componentName: string) => void;
    setGameDataPresent: (flag: boolean) => void;
    gameDataPresent: boolean;
}

class MainMenu extends Component<MainMenuProps> {
    /**
     * Starts a new game by toggling the Game component.
     * - If there is game data present in the local storage, it will be deleted before starting a new game.
     * @returns {void}
     */
    newGame(): void {
        // If there is game data present in the local storage, delete it before starting a new game
        if (this.props.gameDataPresent) {
            this.deleteSavedGame();
        }

        // Toggle the Game component to start a new game
        this.props.toggleComponent("game");
    }

    /**
     * Handles the click event for the delete button.
     * @param {MouseEvent<HTMLButtonElement>} e - The mouse event triggered by the user.
     * @returns {void}
     */
    deleteButton(e: MouseEvent<HTMLButtonElement>): void {
        // Prevent the click event from propagating to the 'load game' button
        e.stopPropagation();

        // Delete the saved game data
        this.deleteSavedGame();
    }

    /**
     * Deletes the saved game data from the local storage and set the gameDataPresent state to false.
     * @returns {void}
     */
    deleteSavedGame(): void {
        clearGameData();
        this.props.setGameDataPresent(false);
    }

    render() {
        const buttonStyling = {
            background: "linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), linear-gradient(135deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000)",
            border: "3px #000 solid",
            fontSize: "2vw",
            color: "black"
        };

        return (
            <div
                data-testid="mainMenu"
                className="d-flex flex-column justify-content-center align-items-center"
                style={{
                    height: "100vh",
                    width: "100vw",
                    background: "linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), linear-gradient(135deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000)"
                }}
            >
                <h1
                    className="text-center"
                    style={{
                        fontSize: "7.5vw",
                        marginBottom: "10vh"
                    }}
                >
                    MAIN MENU
                </h1>
                <div
                    className="d-flex gap-5 flex-column"
                    style={{
                        width: "40vw"
                    }}
                >
                    <Button
                        className="rounded-5 py-4"
                        data-testid="mainMenuStartButton"
                        style={buttonStyling}
                        onClick={() => this.newGame()}
                        tabIndex={0}
                    >
                        New game
                    </Button>
                    <div
                        className="position-relative d-flex flex-column"
                        style={{
                            width: "100%",
                            height: "100%"
                        }}
                    >
                        <Button
                            className="rounded-5 py-4 w-100 h-100 position-relative text-center"
                            data-testid="mainMenuLoadButton"
                            style={{
                                ...buttonStyling,
                                cursor: !this.props.gameDataPresent ? "not-allowed" : "pointer",
                                pointerEvents: !this.props.gameDataPresent ? "all" : "auto" // Set the pointer events to all if there is no game data present. This is to allow the cursor styling to be applied when the button is disabled
                            }}
                            disabled={!this.props.gameDataPresent}
                            onClick={() => this.props.toggleComponent("game")}
                            tabIndex={1}
                        >
                            Load game
                        </Button>
                        <Button
                            className="position-absolute top-0 end-0 bg-transparent border-0"
                            data-testid="mainMenuDeleteSavedGameButton"
                            onClick={(e) => this.deleteButton(e)}
                            aria-disabled={!this.props.gameDataPresent}
                            tabIndex={this.props.gameDataPresent ? 2 : -1}
                            style={{
                                marginTop: "1vh",
                                marginRight: "1vw",
                                fontSize: "1.5vw",
                                cursor: this.props.gameDataPresent ? "pointer" : "not-allowed",
                                pointerEvents: this.props.gameDataPresent ? "all" : "none" // Set the pointer events to all if there is no game data present. This is to allow the cursor styling to be applied when the button is disabled
                            }}
                        >
                            <FontAwesomeIcon
                                icon={faTrashCan}
                                className="text-danger m-0"
                            />
                        </Button>
                    </div>
                    <Button
                        className="rounded-5 py-4"
                        data-testid="mainMenuSettingsButton"
                        style={buttonStyling}
                        onClick={() => this.props.toggleComponent("settings")}
                        tabIndex={3}
                    >
                        Settings
                    </Button>
                </div>
            </div>
        );
    }
}

export default MainMenu;