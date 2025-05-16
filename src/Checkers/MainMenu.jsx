import { Component } from 'react';
import { Button } from 'react-bootstrap';
import { getAllGameDataPresent, removeAllGameData } from './game/gameData.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';

class MainMenu extends Component {
    constructor() {
        super();
        this.state = {
            gameDataPresent: getAllGameDataPresent() // Check if there is game data present in the local storage, This is used to determine if the load game button should be enabled or not, which could change when the user clicks the trashcan icon (delete saved game button)
        };
    }

    set gameDataPresent(bool) {
        this.setState({
            gameDataPresent: bool
        });
    }

    get gameDataPresent() {
        const gameDataPresent = this.state.gameDataPresent;
        return gameDataPresent
    }
    
    newGame() {
        // If there is game data present in the local storage, remove it to start a new game
        if (this.gameDataPresent)
            removeAllGameData();

        this.props.toggleComponent("Game");
    }

    deleteSavedGame(e) {
        // Prevent the click event from propagating to the button to load the game
        e.stopPropagation();

        // If the trashcan icon is clicked, remove the game data from local storage
        this.gameDataPresent = false;
        removeAllGameData();
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
                        style={buttonStyling}
                        onClick={() => this.newGame()}
                    >
                        New game
                    </Button>
                    <Button
                        className="rounded-5 py-4 w-100 h-100 position-relative"
                        style={{
                            ...buttonStyling,
                            cursor: !this.gameDataPresent ? "not-allowed" : "pointer",
                            pointerEvents: !this.gameDataPresent ? "all" : "auto" // Setting pointerEvenrts to all is needed to change the cursor to not-allowed, otherwise it won't change to not-allowed because of the disabled attribute
                        }}
                        disabled={!this.gameDataPresent}
                        onClick={() => this.props.toggleComponent("Game")}
                    >
                        Load game
                        <span
                            className="position-absolute top-0 end-0 pe-4"
                            onClick={(e) => this.deleteSavedGame(e)}
                        >
                            <FontAwesomeIcon
                                icon={faTrashCan}
                                className="text-danger"
                            />
                        </span>
                    </Button>
                    <Button
                        className="rounded-5 py-4"
                        style={buttonStyling}
                        onClick={() => this.props.toggleComponent("Settings")}
                    >
                        Settings
                    </Button>
                </div>
            </div>
        );
    }
}

export default MainMenu;