import { Component } from "react";
import { FormCheck } from 'react-bootstrap';

class BoardSettingsForm extends Component {
    boardSizeChanged(ev) {
        const target = ev.target;
        const id = target.id;
        const value = Number(target.value);
        this.props.updateFormSettings(id, value);
    }

    render() {
        return (
            <>
                <fieldset>
                    <legend>
                        Board size
                    </legend>
                    {this.props.formSettings.boardSize.optionalValues
                        .map((optionalValue, key) =>
                            <FormCheck
                                defaultChecked={this.props.formSettings.boardSize.value === optionalValue}
                                onChange={(ev) => this.boardSizeChanged(ev)}
                                type="radio"
                                id={"boardSize-" + key}
                                name="boardSize"
                                value={optionalValue}
                                label={optionalValue + "X" + optionalValue}
                                title={null}
                                key={key}
                            />
                        )}
                </fieldset>
            </>
        )
    }
}

export default BoardSettingsForm;