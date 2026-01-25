import { FC, ChangeEvent } from "react";
import { Col, Form, FormCheck, FormGroup, FormLabel, FormSelect, Row } from "react-bootstrap";
import useSettings from "../../settingsProvider/useSettings.tsx";
import { KeysTree, Settings } from "../../settingsProvider/SettingsProviderUtils.ts";
import '../SettingsForm.scss';

/**
 * Props for the GameSettingsForm component.
 */
export interface GameSettingsFormProps {}

/**
 * Type representing the game settings.
 */
type GameSettings = Settings['game'];

const GameSettingsForm: FC<GameSettingsFormProps> = () => {
    const {
        settings,
        updateSetting
    } = useSettings();
    const gameSettings: GameSettings | undefined = settings?.game;

    // If the game settings are not available, return null.
    //! This should never happen, but we type guard it just in case
    if (!gameSettings) {
        console.error("No game settings available.");
        return null;
    }

    /**
     * Handles the change event for the board row setting.
     * @param {ChangeEvent<HTMLSelectElement>} ev - The change event.
     * @returns {void}
     */
    const handleBoardRowChange = (ev: ChangeEvent<HTMLSelectElement>): void => {
        const value: number = parseInt(ev.target.value, 10);
        const keysTree: KeysTree = ['game', 'board', 'rows'];
        updateSetting(keysTree, value);
    };

    /**
     * Handles the change event for the initial player setting.
     * @param {ChangeEvent<HTMLSelectElement>} ev - The change event.
     * @returns {void}
     */
    const handleInitialPlayerChange = (ev: ChangeEvent<HTMLSelectElement>): void => {
        const value: number = parseInt(ev.target.value, 10);
        const keysTree: KeysTree = ['game', 'player', 'initialPlayer'];
        updateSetting(keysTree, value);
    };

    /**
     * Handles the change event for the game mode setting.
     * @param {ChangeEvent<HTMLSelectElement>} ev - The change event.
     * @returns {void}
     */
    const handleGameModeChange = (ev: ChangeEvent<HTMLSelectElement>): void => {
        const value: string = ev.target.value;
        const keysTree: KeysTree = ['game', 'mode', 'gamemode'];
        updateSetting(keysTree, value);
    };

    /**
     * Handles the change event for the game rule setting.
     * @param {ChangeEvent<HTMLInputElement>} ev - The change event.
     * @returns {void}
     */
    const handleGameRuleChange = (ev: ChangeEvent<HTMLInputElement>): void => {
        const target: EventTarget & HTMLInputElement = ev.target;
        const ruleName: string = target.value;
        const isChecked: boolean = target.checked;
        const keysTree: KeysTree = ['game', 'rules', ruleName];
        updateSetting(keysTree, isChecked);
    };

    return (
        <Form
            data-testid="gameSettingsForm"
        >
            <Row 
                className='mb-4'
            >
                <Col 
                    md={6}
                >
                    <fieldset>
                        <legend>
                            Board settings
                        </legend>
                        <div 
                            className='mb-3'
                        >
                            <FormGroup 
                                className='form-group form-group-left'
                            >
                                <FormLabel 
                                    htmlFor='BoardRowSetting'
                                >
                                    Number of rows
                                </FormLabel>
                                <FormSelect
                                    id='BoardRowSetting'
                                    value={gameSettings.board.rows.value}
                                    onChange={handleBoardRowChange}
                                >
                                    {gameSettings.board.rows.options.map((row) => (
                                        <option 
                                            value={row} 
                                            key={row}
                                        >
                                            {row}
                                        </option>
                                    ))}
                                </FormSelect>
                            </FormGroup>
                        </div>
                    </fieldset>
                </Col>
                <Col 
                    md={6}
                >
                    <fieldset>
                        <legend>
                            Player settings
                        </legend>
                        <div 
                            className='mb-3'
                        >
                            <FormGroup 
                                className='form-group form-group-right'
                            >
                                <FormLabel 
                                    htmlFor='initialPlayerSetting'
                                >
                                    Initial player
                                </FormLabel>
                                <FormSelect
                                    id='initialPlayerSetting'
                                    value={gameSettings.player.initialPlayer.value}
                                    onChange={handleInitialPlayerChange}
                                >
                                    {gameSettings.player.initialPlayer.options.map((player) => (
                                        <option 
                                            value={player} 
                                            key={player}
                                        >
                                            Player {player}
                                        </option>
                                    ))}
                                </FormSelect>
                            </FormGroup>
                        </div>
                    </fieldset>
                </Col>
            </Row>
            <Row>
                <Col 
                    md={6}
                >
                    <fieldset>
                        <legend>
                            Mode settings
                        </legend>
                        <div 
                            className='mb-3'
                        >
                            <FormGroup 
                                className='form-group form-group-left'
                            >
                                <FormLabel 
                                    htmlFor='gameModeSetting'
                                >
                                    Game mode
                                </FormLabel>
                                <FormSelect
                                    id='gameModeSetting'
                                    value={gameSettings.mode.gamemode.value}
                                    onChange={handleGameModeChange}
                                >
                                    {gameSettings.mode.gamemode.options.map((gamemode) => (
                                        <option 
                                            value={gamemode} 
                                            key={gamemode}
                                        >
                                            {gamemode.toUpperCase()}
                                        </option>
                                    ))}
                                </FormSelect>
                            </FormGroup>
                        </div>
                    </fieldset>
                </Col>
                <Col 
                    md={6}
                >
                    <fieldset>
                        <legend>
                            Game rules
                        </legend>
                        <div 
                            className='mb-3'
                        >
                            <FormGroup 
                                className='form-group form-group-right checkbox-group'
                            >
                                {Object.keys(gameSettings.rules).map((gameRule) => (
                                    <div 
                                        className='mb-3' 
                                        key={gameRule}
                                    >
                                        <FormCheck
                                            id={`${gameRule}Setting`}
                                            label={gameRule.charAt(0).toUpperCase() + gameRule.slice(1).replace(/([A-Z])/g, ' $1').toLowerCase()}
                                            checked={gameSettings.rules[gameRule as keyof typeof gameSettings.rules].value}
                                            onChange={handleGameRuleChange}
                                            value={gameRule}
                                            className='checkbox-right'
                                        />
                                    </div>
                                ))}
                            </FormGroup>
                        </div>
                    </fieldset>
                </Col>
            </Row>
        </Form>
    );
}

export default GameSettingsForm;