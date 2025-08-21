import { ChangeEvent, FC } from 'react';
import { FormCheck, Form, FormSelect, FormGroup, FormLabel, Row, Col } from 'react-bootstrap';
import { useGameStorageContext } from '../game/gameStorage/gameStorage.tsx';
import { useSettingsStorageContext } from './settingsStorage/settingsStorage.tsx';
import { GAME_RULES, GameMode, BoardRows, Player, GameRule } from './settingsStorage/settingsStorageUtils.ts';
import './settingsStyling.scss';

const GameSettings: FC = () => {
    const {
        isGameDataPresent
    } = useGameStorageContext();

    const {
        gameSettings,
        gameSettingOptions,
        setGameSettings
    } = useSettingsStorageContext();

    /**
     * Sets the game mode in the game settings.
     * @param {ChangeEvent<HTMLSelectElement>} ev - The change event from the select element.
     * @returns {void}
     */
    const setGameMode = (ev: ChangeEvent<HTMLSelectElement>): void => {
        const gamemode = ev.target.value as GameMode;

        setGameSettings((prevSettings) => ({
            ...prevSettings,
            mode: {
                ...prevSettings.mode,
                gamemode: gamemode
            }
        }));
    };

    /**
     * Sets the flag for the game rule in the game settings.
     * @param {ChangeEvent<HTMLInputElement>} ev - The change event from the input element.
     * @returns {void}
     */
    const setGameRule = (ev: ChangeEvent<HTMLInputElement>): void => {
        const gameRule = ev.target.value as GameRule;
        const value = ev.target.checked;

        setGameSettings((prevSettings) => ({
            ...prevSettings,
            rules: {
                ...prevSettings.rules,
                [gameRule]: value
            }
        }));
    };
    
    /**
     * Sets the number of rows in the game board. 
     * (This is also the number of columns, since the board is a square.)
     * @param {ChangeEvent<HTMLSelectElement>} ev - The change event from the select element.
     * @returns {void}
     */
    const setBoardRows = (ev: ChangeEvent<HTMLSelectElement>): void => {
        const rows = Number(ev.target.value) as BoardRows;

        setGameSettings((prevSettings) => ({
            ...prevSettings,
            board: {
                ...prevSettings.board,
                rows
            }
        }));
    };
    
    /**
     * Sets the initial player in the game settings.
     * @param {ChangeEvent<HTMLSelectElement>} ev - The change event from the select element.
     * @returns {void}
     */
    const setInitialPlayer = (ev: ChangeEvent<HTMLSelectElement>): void => {
        const initialPlayer = Number(ev.target.value) as Player;

        setGameSettings((prevSettings) => ({
            ...prevSettings,
            player: {
                ...prevSettings.player,
                initialPlayer
            }
        }));
    };

    return (
        <Form>
            <Row>
                <Col
                    md={6}
                    className='left-settings-column'
                >
                    <fieldset 
                        className='settings-group'
                    >
                        <legend 
                            className='settings-group-title'
                        >
                            Board settings
                        </legend>
                        <div 
                            className='mb-3 form-groups'
                        >
                            <FormGroup 
                                className='auto-width-form-group form-group'
                            >
                                <FormLabel 
                                    htmlFor='boardRowsSetting'
                                >
                                    Number of rows
                                </FormLabel>
                                <FormSelect
                                    id='boardRowsSetting'
                                    value={gameSettings.board.rows}
                                    onChange={setBoardRows}
                                    disabled={isGameDataPresent}
                                >
                                    {gameSettingOptions.board.rows.map((row) => (
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
                    <fieldset
                        className='settings-group'
                    >
                        <legend 
                            className='settings-group-title'
                        >
                            Player settings
                        </legend>
                        <div 
                            className='mb-3 form-groups'
                        >
                            <FormGroup
                                className='auto-width-form-group form-group'
                            >
                                <FormLabel
                                    htmlFor='initialPlayerSetting'
                                >
                                    Initial player
                                </FormLabel>
                                <FormSelect
                                    id='initialPlayerSetting'
                                    className='form-select'
                                    value={gameSettings.player.initialPlayer}
                                    onChange={setInitialPlayer}
                                    disabled={isGameDataPresent}
                                >
                                    {gameSettingOptions.player.initialPlayer.map((player) => (
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
                <Col
                    md={6}
                >
                    <fieldset 
                        className='settings-group'
                    >
                        <legend 
                            className='settings-group-title'
                        >
                            Mode settings
                        </legend>
                        <div
                            className='mb-3'
                        >
                            <FormGroup 
                                className='auto-width-form-group'
                            >
                                <FormLabel 
                                    htmlFor='gameModeSetting'
                                >
                                    Game mode
                                </FormLabel>
                                <FormSelect
                                    id='gameModeSetting'
                                    className='form-select'
                                    value={gameSettings.mode.gamemode}
                                    onChange={setGameMode}
                                    disabled={isGameDataPresent}
                                >
                                    {gameSettingOptions.mode.gamemode.map((gamemode) => (
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
                    <fieldset 
                        className='settings-group'
                    >
                        <legend 
                            className='settings-group-title'
                        >
                            Game rules
                        </legend>
                        {GAME_RULES.map((gameRule) => (
                            <div 
                                className='mb-3'
                                key={gameRule}
                            >
                                <FormCheck
                                    type='checkbox'
                                    id={`${gameRule}Setting`}
                                    label={gameRule.charAt(0).toUpperCase() + gameRule.slice(1).replace(/([A-Z])/g, ' $1').toLowerCase()}
                                    checked={gameSettings.rules[gameRule]}
                                    onChange={setGameRule}
                                    value={gameRule}
                                    disabled={isGameDataPresent}
                                    className='checkbox-right'
                                />
                            </div>
                        ))}
                    </fieldset>
                </Col>
            </Row>
        </Form>
    );
}

export default GameSettings;