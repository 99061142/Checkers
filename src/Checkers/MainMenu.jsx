import { Component } from "react";

class MainMenu extends Component {
    render() {
        return (
            <div
                className="d-flex flex-column gap-5"
            >
                <button
                    onClick={() => this.props.setCurrentComponent("Game")}
                    className="btn btn-primary px-5 py-1"
                >
                    start
                </button>
                <button
                    onClick={() => this.props.setCurrentComponent("Settings")}
                    className="btn btn-primary px-5 py-1"
                >
                    settings
                </button>
                <button
                    onClick={() => this.props.setCurrentComponent("About")}
                    className="btn btn-primary px-5 py-1"
                >
                    about
                </button>
            </div>
        )
    }
}

export default MainMenu;