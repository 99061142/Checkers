import settings from '../settings/settingsData.json';

let jsonSettings = settings;
function updateSettings(keys, values) {
    // Change the settings based on the given parameters
    const updatedSettings = JSON.parse(JSON.stringify(settings));    
    for(const [i, key] of keys.entries()) {
        const newValue = values[i];
        if (updatedSettings[key].constructor === Object)
            updatedSettings[key].value = newValue;
        else
            updatedSettings[key] = newValue;
    }
    jsonSettings = updatedSettings;
}

it("Change the json settings based on the given parameters", () => {
    updateSettings(["gameRunning", "gamemode"], [true, "pvp"]);
    expect(jsonSettings.gameRunning).toBe(true);
    expect(jsonSettings.gamemode.value).toBe("pvp");
});