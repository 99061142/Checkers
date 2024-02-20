import { Component } from "react";
import './styling/stone.scss';

class Stone extends Component {
    constructor() {
        super();
        this.state = {
            isKing: false,
            canMove: false
        };
    }

    set isKing(bool) {
        this.setState({
            isKing: bool
        });
    }

    get isKing() {
        const isKing = this.state.isKing;
        return isKing
    }

    onClick() {

    }

    get backgroundColor() {
        const backgroundColor = this.props.backgroundColor;
        return backgroundColor
    }

    set canMove(bool) {
        this.setState({
            canMove: bool
        });
    }

    get canMove() {
        const canMove = this.state.canMove;
        return canMove
    }

    render() {
        return (
            <div
                className={
                    "stone" +
                    (this.isKing ? " king" : '') +
                    (this.canMove ? " can-move" : '')
                }
                style={{
                    backgroundColor: this.backgroundColor,
                    borderRadius: "50%"
                }}
                onClick={() => this.onClick()}
            >
            </div>
        )
    }
}

export default Stone;