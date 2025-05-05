// empty class of escape menu
import { Component } from 'react';

class EscapeMenu extends Component {
    constructor() {
        super();
        this.state = {
            // state variables can be added here if needed
        };
        this.keyPressed = this.keyPressed.bind(this);
    }

    componentDidMount() {
        window.addEventListener('keydown', this.keyPressed);
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.keyPressed);
    }

    async keyPressed(ev) {
        // await function to not overload the event loop
        await new Promise(resolve => setTimeout(resolve, 0));

        // If the key pressed is not in the keyEvents object, return
        const keyEvents = this.props.keyEvents;
        const keyEvent = keyEvents[ev.key];
        if (keyEvent === undefined) 
            return

        if (keyEvent === "Back") {
            this.props.toggleComponent("Game");
        }
    }

    render() {
        return (
            <div>
                <button onClick={() => this.props.toggleComponent("Game")}>Resume Game</button>
                <button onClick={() => this.props.toggleComponent("Settings")}>Settings</button>
                <button onClick={() => this.props.toggleComponent("MainMenu")}>Main Menu</button>
            </div>
        );
    }
}

export default EscapeMenu;