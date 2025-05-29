import { Component } from "react";
import { Button } from "react-bootstrap";
import { deleteGameData } from "./gameData";

class GameOverOverlay extends Component {
    mainMenuButtonClicked = () => {
        // Remove all game data from the local storage
        deleteGameData();

        // Show the main menu
        this.props.toggleComponent("MainMenu");
    }
    
    render() {
        return (
            <div
                data-testid="gameOverOverlay"
                className="position-absolute d-flex flex-column justify-content-center align-items-center"
                style={{
                    width: "100vw",
                    height: "100vh",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    backdropFilter: "blur(3px)",
                    zIndex: 9999
                }}
            >
                <h1
                    className="text-center text-white"
                    style={{
                        fontSize: "7.5vw",
                        marginBottom: "10vh"
                    }}
                >
                    PLAYER {this.props.winner} WINS!
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
                    onClick={this.mainMenuButtonClicked}
                >
                    Main Menu
                </Button>
            </div>
        );
    }
}

export default GameOverOverlay;