import { Component, createRef } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";

class NavigateWarning extends Component {
    constructor() {
        super();
        this._ref = createRef(null);
    }

    componentDidMount() {
        // Center the component
        this.centerComponent();
    }

    centerComponent() {
        // Center the component
        const ref = this._ref.current;
        const startHeight = ref.getBoundingClientRect().top;
        const height = Math.floor(window.innerHeight - startHeight);
        Object.assign(
            ref.style,
            {
                height: height + "px",
            }
        );
    }

    async continue() {
        // Remwove the changes made
        const settings = JSON.parse(JSON.stringify(this.props.settings));
        this.props.setFormSettings(settings);

        // Remove the names of the settings that were changed
        await this.props.setUpdatedFormSettingsNames([]);

        // Navigate to the form, or component (if the user left the settings page) the user chose
        this.props.navigate(this.props.navigateTo);
    }

    back() {
        // Navigate to the form before the user navigated to another form, or component (if the user left the settings page)
        this.props.setNavigateTo(null);
    }

    render() {
        const options = [
            "continue",
            "back"
        ];
        return (
            <div
                ref={this._ref}
                className="position-relative"
            >
                <div
                    className="text-center position-absolute start-50 top-50"
                    style={{
                        WebkitTransform: "translate(-50%, -200%)",
                        transform: "translate(-50%, -200%)"
                    }}
                >
                    <h2
                        className="mb-4"
                    >
                        The settings aren't saved, continue?
                    </h2>
                    <Container>
                        <Row
                            className="gap-4"
                        >
                            {options
                                .map((option, key) =>
                                    <Col
                                        key={key}
                                    >
                                        <Button
                                            onClick={() => this[option]()}
                                            className="text-capitalize w-100"
                                        >
                                            {option}
                                        </Button>
                                    </Col>
                                )}
                        </Row>
                    </Container>
                </div>
            </div>
        )
    }
}

export default NavigateWarning;