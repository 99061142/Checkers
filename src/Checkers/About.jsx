import { Component } from "react";

class About extends Component {
    constructor() {
        super();
        this.keyPressed = this.keyPressed.bind(this);
    }

    keyPressed(ev) {
        if (ev.key === "Escape")
            this.props.setCurrentComponent("MainMenu");
    }

    componentDidMount() {
        window.addEventListener('keydown', this.keyPressed, false);
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.keyPressed, false);
    }

    render() {
        return (
            <h1>About</h1>
        );
    }
}

export default About;