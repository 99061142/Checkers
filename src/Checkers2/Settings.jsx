import { Component } from 'react';
import { Button } from 'react-bootstrap';

class Settings extends Component {
    constructor() {
        super();
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

        // If the pressed key is not in the keyEvents object, return
        // This is used to check if the key pressed is a key event that we want to handle
        const keyEvents = this.props.keyEvents;
        const keyEvent = keyEvents[ev.key];
        if (keyEvent === undefined) 
            return

        if (keyEvent === "Back") {
            // If the previous component was the main menu, switch back to the main menu
            if (this.props.previousComponentStr === "MainMenu") {
                this.props.toggleComponent("MainMenu");
                return
            }

            // If the previous component was the escape menu, switch back to the escape menu
            if (this.props.previousComponentStr === "EscapeMenu") {
                this.props.toggleComponent("EscapeMenu");
                return
            }
        }
    }

    render() {
        return (
            <div>
                <h1>Settings</h1>
                <Button variant="primary" onClick={() => this.props.toggleComponent("MainMenu")}>Main Menu</Button>
            </div>
        );
    }
}

export default Settings;