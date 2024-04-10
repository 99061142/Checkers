import { Component } from "react";
import './styling/stone.scss';

class Stone extends Component {
    constructor() {
        super();
        this.state = {
            isKing: false
        };
    }

    get canMove() {
        const canMove = this.props.movablePositions.includes(this.props.pos);
        return canMove
    }

    get isKing() {
        const isKing = this.state.isKing;
        return isKing
    }

    render() {
        return (
            <div
                className={
                    "stone position-absolute rounded-circle" +
                    (this.isKing ? " king" : '')
                }
                style={{
                    backgroundColor: this.props.player === 1 ? "white" : "red",
                    boxShadow: this.canMove ? "0 0 2em #00ff3c" : "none",
                    cursor: this.canMove ? "pointer" : "not-allowed",
                    ...this.props.rect
                }}
            />
        )
    }
}

export default Stone;