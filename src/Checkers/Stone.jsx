import { Component } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCrown } from '@fortawesome/free-solid-svg-icons'

class Stone extends Component {
    constructor() {
        super();
        this.state = {
            isKing: false
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

    render() {
        return (
            <div
                className={
                    "m-auto w-75 h-75" +
                    (this.isKing ? " d-flex align-items-center justify-content-center" : '')
                }
                style={{
                    backgroundColor: this.props.backgroundColor,
                    borderRadius: "50%"
                }}
            >
                {this.isKing &&
                    <FontAwesomeIcon
                        icon={faCrown}
                    />
                }
            </div>
        )
    }
}

export default Stone;