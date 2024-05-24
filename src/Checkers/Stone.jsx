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
        // TODO, calculate if the stone can be moved
        return false
    }

    get isKing() {
        const isKing = this.state.isKing;
        return isKing
    }

    onClick() {
        if (!this.canMove)
            return
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
                    ...this.props.boundingRect
                }}
                aria-disabled={!this.canMove}
                onClick={() => this.onClick()}
            />
        )
    }
}

export default Stone;