import { Component } from "react";
import './styling/settings.scss';

class Settings extends Component {
    constructor() {
        super();
        this.keyPressed = this.keyPressed.bind(this);
    }

    keyPressed(ev) {
        if (ev.key === "Escape")
            this.props.setCurrentComponent(this.props.previousComponent);
    }

    componentDidMount() {
        window.addEventListener('keydown', this.keyPressed, false);
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.keyPressed, false);
    }


    render() {
        return (
            <></>
        )
    }
}

export default Settings;