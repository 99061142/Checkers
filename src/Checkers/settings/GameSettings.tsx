import { Component, ChangeEvent } from 'react';
import { FormCheck, Form } from 'react-bootstrap';
import { getGamemode, getGameRules, GameRules, Gamemode, setGamemode, setGameRule, GAMEMODES } from './settingsData.ts';

/**
 * Props for the GameSettings component.
 * - gameDataPresent: A boolean value indicating whether the game data is present in the local storage.
 */
interface GameSettingsProps {
    gameDataPresent: boolean;
}

/**
 * State for the GameSettings component.
 * - gamemode: A string representing the selected game mode.
 * - gameRules: An object representing the game rules with boolean values.
 *   Each key corresponds to a game rule, and the value indicates whether the rule is enabled or not.
 */
interface GameSettingsState {
    gamemode: Gamemode
    gameRules: GameRules;
}

class GameSettings extends Component<GameSettingsProps, GameSettingsState> {
    // The initial gamemode which is retrieved from the local storage
    initialGamemode = getGamemode();

    // The initial game rules which are retrieved from the local storage
    initialGameRules = getGameRules();

    constructor(props: GameSettingsProps) {
        super(props);
        this.state = {
            gamemode: this.initialGamemode,
            gameRules: this.initialGameRules
        };
    }

    componentDidMount() {
        window.addEventListener('beforeunload', this.beforeUnloadHandler);
    }

    componentWillUnmount() {
        window.removeEventListener('beforeunload', this.beforeUnloadHandler);

        // Save the game form settings to the local storage before the component is unmounted
        this.saveGameSettings()
    }

    /**
     * Handles the change event for the gamemode radio buttons.
     * @param {ChangeEvent} ev - The change event triggered by the gamemode radio buttons.
     * @returns {void}
     */
    gamemodeChanged = (ev: ChangeEvent<HTMLInputElement>): void => {
        const gamemode = ev.target.value as Gamemode;
        this.setState({
            gamemode
        });
    }

    /**
     * Handles the change event for the game rule switches.
     * @param {ChangeEvent} ev - The change event triggered by the game rule switches.
     * @returns {void}
     */
    gameRuleChanged = (ev: ChangeEvent<HTMLInputElement>): void => {
        const target = ev.target;
        const gameRule = target.value as keyof GameRules;
        const value = target.checked;
        this.setState((prevState) => ({
            gameRules: {
                ...prevState.gameRules,
                [gameRule]: value
            }
        }));
    }

    /**
     * Handles the beforeunload event when the user exits the form.
     * @returns {void}
     */
    beforeUnloadHandler = (): void => {
        // Save the game form settings to the local storage before the component is unmounted
        this.saveGameSettings();
    }

    /**
     * Save the game form settings to the local storage before the component is unmounted
     * @returns {void}
     */
    saveGameSettings(): void {
        // If the gamemode have been changed, save it to the local storage
        if (this.state.gamemode !== this.initialGamemode) {
            setGamemode(this.state.gamemode);
        }

        // Iterate over the game rules, and if any of them have been changed, save them to the local storage
        Object.entries(this.state.gameRules).forEach(([gameRule, value]) => {
            if (value !== this.initialGameRules[gameRule as keyof GameRules]) {
                setGameRule(gameRule as keyof GameRules, value);
            }
        });
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
                    {GAMEMODES
                        .map((optionalGamemode, key) =>
                            <FormCheck
                                onChange={this.gamemodeChanged}
                                checked={this.state.gamemode === optionalGamemode}
                                type="radio"
                                className="text-uppercase"
                                id={"_gamemode-" + key}
                                name="gamemode"
                                value={optionalGamemode}
                                label={optionalGamemode}
                                key={optionalGamemode}
                            />
                        )}
                </fieldset>
                <fieldset>
                    <legend>
                        Game rules
                    </legend>
                        {Object
                            .entries(this.state.gameRules)
                            .map(([gameRule], key) =>
                                <FormCheck
                                    onChange={this.gameRuleChanged}
                                    checked={this.state.gameRules[gameRule as keyof GameRules]}
                                    type="switch"
                                    disabled={this.props.gameDataPresent}
                                    id={"_gameRule-" + key}
                                    name="gameRules"
                                    value={gameRule}
                                    label={gameRule.charAt(0).toUpperCase() + gameRule.slice(1).replace(/([A-Z])/g, ' $1').toLowerCase()}
                                    draggable={false}
                                    key={gameRule}
                                />
                            )}
                </fieldset>
            </Form>
        )
    }
}

export default GameSettings;