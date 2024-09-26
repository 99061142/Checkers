import { Component } from "react";
import { Button } from "react-bootstrap";

class MainMenu extends Component {
    render() {
        return (
            <div
                className="position-absolute start-50 top-50 d-flex gap-5 flex-column"
                style={{
                    width: "30%",
                    WebkitTansform: "translate(-50%, -50%)",
                    transform: "translate(-50%, -50%)"
                }}
            >
                <Button
                    onClick={() => this.props.setCurrentComponent("Game")}
                >
                    Start
                </Button>
                <Button
                    onClick={() => this.props.setCurrentComponent("Settings")}
                >
                    Settings
                </Button>
                <Button
                    onClick={() => this.props.setCurrentComponent("About")}
                >
                    About
                </Button>
            </div>
        )
    }
}

export default MainMenu;