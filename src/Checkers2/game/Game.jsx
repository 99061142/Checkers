// empty class for the game
import { Component } from 'react';
import Board from './Board.jsx';

class Game extends Component {
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

        if (ev.key === "Escape") {
            this.props.toggleComponent("EscapeMenu");
            return
        }
    }


    render() {
        return (
            <Board />
        );
    }
}

export default Game;