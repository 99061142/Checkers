import { Component } from 'react';
import { Form, FormCheck } from 'react-bootstrap';

class BoardSettings extends Component {
    boardSizeChanged = (ev) => {
        // Set the board size to the selected value
        // The updateSettingValue function is found in the Settings component
        const target = ev.target;
        const nestedKeys = target.name;
        const value = Number(target.value);
        this.props.updateSettingValue(nestedKeys, value);
    }

    render() {
        return (
                <Form
                    data-testid="boardSettings"
                >
                    <fieldset>
                        <legend>
                            Board size
                        </legend>
                        {[8, 10, 12]
                            .map((optionalBoardSize, key) =>
                                <FormCheck
                                    onChange={this.boardSizeChanged}
                                    defaultChecked={this.props.settings.boardSize === optionalBoardSize}
                                    type="radio"
                                    id={"_optionalBoardSize-" + key}
                                    name="boardSize"
                                    disabled={this.props.gameDataPresent}
                                    value={optionalBoardSize}
                                    label={optionalBoardSize + "X" + optionalBoardSize}
                                    title={null}
                                    key={key}
                                />
                            )
                        }
                    </fieldset>
            </Form>
        );
    }
}

export default BoardSettings;