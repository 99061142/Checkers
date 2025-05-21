import { Component } from 'react';
import { FormCheck, Form } from 'react-bootstrap';

class GameSettings extends Component {
    gamemodeChanged = (ev) => {
        // Set the gamemode to the selected value
        // The updateSettingValue function is found in the Settings component
        const target = ev.target;
        const nestedKeys = target.name;
        const value = target.value;
        this.props.updateSettingValue(nestedKeys, value);
    }

    gameRuleChanged = (ev) => {
        // Set the game rule to true or false based on the switch
        // The updateSettingValue function is found in the Settings component
        const target = ev.target;
        const gameRule = target.value;
        const nestedKeys = target.name + "-" + gameRule;
        const value = target.checked;
        this.props.updateSettingValue(nestedKeys, value);
    }
    
    render() { 
        return (
            <Form
                data-testid="gameSettings"
            >
                <fieldset>
                    <legend>
                        Gamemode
                    </legend>
                    {["pvp", "pve"]
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
                                    disabled={this.props.gameDataPresent}
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
        );
    }
}

export default GameSettings;