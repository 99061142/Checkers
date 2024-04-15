import { Component, Suspense, lazy } from "react";
import { Button, Container, Row, Col } from 'react-bootstrap';
import LoadingFallback from "../LoadingFallback";

const BoardSettingsForm = lazy(() => import('./BoardSettingsForm'));
const GameSettingsForm = lazy(() => import('./GameSettingsForm'));

class SettingsForm extends Component {
    render() {
        const formProps = {
            updateFormSettings: this.props.updateFormSettings,
            formSettings: this.props.formSettings
        };
        return (
            <form
                className="col-md-9"
                onSubmit={(ev) => this.props.handleSubmit(ev)}
            >
                <Container
                    className="p-3"
                >
                    <Row
                        className="justify-content-between"
                    >
                        <Col>
                            <h2
                                className="text-capitalize"
                            >
                                {this.props.formName}
                            </h2>
                        </Col>
                        <Col
                            className="d-flex justify-content-end"
                        >
                            <Button
                                className="d-flex flex-row-reverse btn btn-success px-4"
                                type="submit"
                                value="Submit"
                            >
                                Save
                            </Button>
                        </Col>
                    </Row>
                </Container>
                <hr />
                <Suspense
                    fallback={<LoadingFallback />}
                >
                    {(() => {
                        switch (this.props.formName) {
                            case "board":
                                return <BoardSettingsForm
                                    {...formProps}
                                />
                            case "game":
                                return <GameSettingsForm
                                    {...formProps}
                                />
                            default:
                                throw RangeError("The form named \"" + this.props.formName + "\" couldn't be found")
                        }
                    })()}
                </Suspense>
            </form>
        )
    }
}

export default SettingsForm;