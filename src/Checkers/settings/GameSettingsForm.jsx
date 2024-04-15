import { Component, Fragment } from "react";
import { FormCheck, OverlayTrigger, Tooltip } from 'react-bootstrap';

class GameSettingsForm extends Component {
    gamemodeChanged(ev) {
        const target = ev.target;
        const id = target.id;
        const value = target.value;
        this.props.updateFormSettings(id, value);
    }

    gameRuleChanged(ev, i) {
        const target = ev.target;
        const id = target.id;
        const value = target.checked;
        this.props.updateFormSettings(id, value);
    }

    render() {
        return (
            <>
                <fieldset>
                    <legend>
                        Gamemode
                    </legend>
                    {this.props.formSettings.gamemode.optionalValues
                        .map((optionalValue, key) =>
                            <FormCheck
                                defaultChecked={this.props.formSettings.gamemode.value === optionalValue}
                                onChange={(ev) => this.gamemodeChanged(ev)}
                                type="radio"
                                className="text-uppercase"
                                id={"gamemode-" + key}
                                name="gamemode"
                                value={optionalValue}
                                label={optionalValue}
                                title={null}
                                key={key}
                            />
                        )}
                </fieldset>
                <fieldset>
                    <legend>
                        Game rules
                        <span
                            className="text-danger d-block"
                            style={{
                                fontSize: "14px"
                            }}
                        >
                            Note: Hover over the button (click on mobile) to see an explanation.
                        </span>
                    </legend>
                    {Object
                        .entries(this.props.formSettings.gameRules)
                        .map(([key, gameRule]) =>
                            <OverlayTrigger
                                key={key}
                                className="d-inline-block"
                                overlay={
                                    <Tooltip
                                        style={{
                                            fontSize: "18px",
                                        }}
                                        id="tooltip"
                                    >
                                        {gameRule.explanation}
                                    </Tooltip>
                                }
                            >
                                <FormCheck
                                    className="text-capitalize"
                                    defaultChecked={gameRule.value}
                                    onChange={(ev) => this.gameRuleChanged(ev, key)}
                                    id={"gameRules-" + key}
                                    type="switch"
                                    label={gameRule.rule}
                                    title={null}
                                />
                            </OverlayTrigger>
                        )
                    }
                </fieldset>
            </>
        )
    }
}

export default GameSettingsForm;
