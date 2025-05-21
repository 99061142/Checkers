import { createRoot } from 'react-dom/client';
import { act } from '@testing-library/react';
import GameSettings from '../GameSettings';
import defaultSettings from '../defaultSettings';

let container = null;
beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
});

let root = null;
afterEach(() => {
    if (root) {
        act(() => {
            root.unmount();
        });
        root = null;
    }
    if (container) {
        container.remove();
        container = null;
    }
});

it("Check if the gamemode fieldset is being rendered with the option pvp and pve", () => {
    act(() => {
        root = createRoot(container);
        root.render(<GameSettings
            settings={defaultSettings}
        />);
    });

    // Check if the options pvp and pve for the gamemode are being rendered
    const possibleGamemodes = ["pvp", "pve"];
    for (const [i, possibleGamemode] of possibleGamemodes.entries()) {
        const optionalGamemode = container.querySelector(`#_gamemode-${i}`);
        expect(optionalGamemode).toBeTruthy();
        expect(optionalGamemode.value).toBe(possibleGamemode);
    }
});

it("Check if the game rules fieldset is being rendered with all gamerules which are present in the defaultSettings", () => {
    act(() => {
        root = createRoot(container);
        root.render(<GameSettings
            settings={defaultSettings}
        />);
    });

    // Check if all the game rules which are present in the defaultSettings are being rendered
    const gameRules = Object.keys(defaultSettings.gameRules);
    for (const [i, gameRule] of gameRules.entries()) {
        const optionalGameRule = container.querySelector(`#_gameRule-${i}`);
        expect(optionalGameRule).toBeTruthy();
        expect(optionalGameRule.value).toBe(gameRule);
    }
});

it("Expect the game rules fieldset inputs to be disabled when the gameDataPresent prop is set to true", () => {
    act(() => {
        root = createRoot(container);
        root.render(<GameSettings
            settings={defaultSettings}
            gameDataPresent={true}
        />);
    });

    // Check if the game rules fieldset inputs are disabled
    const gameRules = Object.keys(defaultSettings.gameRules);
    for (let i = 0; i < gameRules.length; i++) {
        const optionalGameRule = container.querySelector(`#_gameRule-${i}`);
        expect(optionalGameRule.disabled).toBe(true);
    }
});

it("Expect the game rules fieldset inputs to be enabled when the gameDataPresent prop is set to false", () => {
    act(() => {
        root = createRoot(container);
        root.render(<GameSettings
            settings={defaultSettings}
            gameDataPresent={false}
        />);
    });

    // Check if the game rules fieldset inputs are enabled
    const gameRules = Object.keys(defaultSettings.gameRules);
    for (let i = 0; i < gameRules.length; i++) {
        const optionalGameRule = container.querySelector(`#_gameRule-${i}`);
        expect(optionalGameRule.disabled).toBe(false);
    }
});

it("Check if the updateSettingValue prop function is called when a game rule is changed to false/true", () => {
    // Mock function to simulate that the updateSettingValue function was called
    const updateSettingValue = jest.fn();
    
    // set all game rules to false for testing purposes
    let settings = defaultSettings;
    for (const gameRule in settings.gameRules)
        settings.gameRules[gameRule] = false;

    act(() => {
        root = createRoot(container);
        root.render(<GameSettings
            settings={settings}
            updateSettingValue={updateSettingValue}
        />);
    });

    // Check if the updateSettingValue function is called when the game rule value is changed from false to true in this instance
    const gameRules = Object.keys(settings.gameRules);
    for (let i = 0; i < gameRules.length; i++) {
        const optionalGameRule = container.querySelector(`#_gameRule-${i}`);
        optionalGameRule.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        
        // Check if the updateSettingValue function is called with gameRules-<gameRule> which indicates the nested setting name,
        // and the value true which indicates that the game rule is enabled
        expect(updateSettingValue).toHaveBeenCalledWith(`gameRules-${gameRules[i]}`, true);
    }
});