// empty class for the game
import { Component } from 'react';

class Game extends Component {
    constructor() {
        super();
        this.state = {
            board: null,
            player: null,
            gameOver: false,
            winner: null,
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

        if (ev.key === "Escape") {
            this.props.toggleComponent("EscapeMenu");
            return
        }
    }


    render() {
        return (
            <div>
                <h1>Game</h1>
                <p>Game is not implemented yet</p>
            </div>
        );
    }
}

export default Game;