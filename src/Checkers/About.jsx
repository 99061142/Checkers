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
        window.addEventListener('keydown', this.keyPressed);
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.keyPressed);
    }

    render() {
        return (
            <h1>About</h1>
        );
    }
}

export default About;