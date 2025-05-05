import { Component } from 'react';
import { Button } from 'react-bootstrap';

class MainMenu extends Component {
    render() {
        return (
            <div>
                <h1>Main Menu</h1>
                <Button variant="primary" onClick={() => this.props.toggleComponent("Game")}>Start Game</Button>
                <Button variant="secondary" onClick={() => this.props.toggleComponent("Settings")}>Settings</Button>
            </div>
        );
    }
}

export default MainMenu;