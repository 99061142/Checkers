import { Component } from 'react';
import { FormCheck, Form } from 'react-bootstrap';
import './settingsStyling.scss';

class GameSettings extends Component {
    gamemodeChanged = (ev) => {
        // Update the gamemode based on the selected value
        const settingName = ev.target.name;
        const settingValue = ev.target.value;
        this.props.updateSettingValue(settingName, settingValue);
    }

    gameRuleChanged = (ev) => {
        // Update the game rule (true/false) based on the selected value
        // This is used to enable/disable the game rule
        const settingName = ev.target.name + "-" + ev.target.value;
        const settingValue = ev.target.checked;
        this.props.updateSettingValue(settingName, settingValue);
    }
    
    render() { 
        return (
            <>
            <Form>
                <fieldset>
                    <legend>
                        Gamemode
                    </legend>
                    {["pvp"]
                        .map((optionalGamemode, key) =>
                            <FormCheck
                                onChange={this.gamemodeChanged}
                                defaultChecked={this.props.settings.gamemode === optionalGamemode}
                                type="radio"
                                className="text-uppercase"
                                id={"_gamemode-" + key}
                                name="gamemode"
                                value={optionalGamemode}
                                label={optionalGamemode}
                                title={null}
                                key={key}
                            />
                        )}
                </fieldset>
            </Form>
            <Form>
                <fieldset>
                    <legend>
                        Game rules
                    </legend>
                        {Object
                            .entries(this.props.settings.gameRules)
                            .map(([gameRule], key) =>
                                <FormCheck
                                    onChange={this.gameRuleChanged}
                                    defaultChecked={this.props.settings.gameRules[gameRule]}
                                    type="switch"
                                    disabled={this.props.settings.gameRunning}
                                    id={"_gameRule-" + key}
                                    name="gameRules"
                                    value={gameRule}
                                    label={gameRule.charAt(0).toUpperCase() + gameRule.slice(1).replace(/([A-Z])/g, ' $1').toLowerCase()}
                                    title={null}
                                    draggable={false}
                                    key={key}
                                />
                            )}
                </fieldset>
            </Form>
        </>
        );
    }
}

export default GameSettings;