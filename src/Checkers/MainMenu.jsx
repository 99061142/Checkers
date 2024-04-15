import { Component } from "react";

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
                <button
                    onClick={() => this.props.setCurrentComponent("Game")}
                    className="btn btn-primary px-4 py-2"
                >
                    Start
                </button>
                <button
                    onClick={() => this.props.setCurrentComponent("Settings")}
                    className="btn btn-primary px-4 py-2"
                >
                    Settings
                </button>
                <button
                    onClick={() => this.props.setCurrentComponent("About")}
                    className="btn btn-primary px-4 py-2"
                >
                    About
                </button>
            </div>
        )
    }
}

export default MainMenu;