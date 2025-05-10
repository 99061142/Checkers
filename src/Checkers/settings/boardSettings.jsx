import { Component } from 'react';
import { Form, FormCheck } from 'react-bootstrap';
import './settingsStyling.scss';

class BoardSettings extends Component {
    boardSizeChanged = (ev) => {
        // Update the board size based on the selected value
        const settingName = ev.target.name;
        const settingValue = Number(ev.target.value);
        this.props.updateSettingValue(settingName, settingValue);
    }

    render() {
        return (
            <>
                <Form>
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
                                disabled={this.props.settings.gameRunning}
                                id={"_optionalBoardSize-" + key}
                                name="boardSize"
                                value={optionalBoardSize}
                                label={optionalBoardSize + "X" + optionalBoardSize}
                                title={null}
                                key={key}
                            />
                        )
                    }
                </fieldset>
            </Form>
            </>
        );
    }
}

export default BoardSettings;