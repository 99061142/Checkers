import settings from '../settings/settingsData.json';

let jsonSettings = settings;
function updateSettings(keys, values) {
        function newSettingValueIsSameType(key, newValue, currentValue) {
            // Return if the value of the newValue and currentValue are the same types
            // If not return a TypeError
            const newValueType = typeof newValue;
            const currentValueType = typeof currentValue;
            if (newValueType === currentValueType)
                return true
            throw TypeError(`The new value (${newValue} (${newValueType})) for the ${key} setting must be the same type as the old value (${currentValue} (${currentValueType}))`)
        }

        // Set the keys and values parameter to a list if they aren't
        if (keys.constructor !== Array)
            keys = [keys];
        if (values.constructor !== Array)
            values = [values];

        // Update the global settings based on the keys and values parameter
        // e.g.
        // keys = ["gameRunning", "gameRules-canCaptureBackwards"] values = [true, false]
        // Changes the gameRunning -> value to true, and the gameRules -> canCaptureBackwards -> value to false.
        const updatedSettings = JSON.parse(JSON.stringify(jsonSettings));
        for (const key of keys) {
            const recurseKeys = key.split('-');
            const newSettingValue = values.shift();
            let settingValueChanged = false;
            let setting = updatedSettings;
            for (const recurseKey of recurseKeys) {
                // If the currentSettingValue is an child object, set the setting to currentSettingValue and continue
                const currentSettingValue = setting[recurseKey]
                if (typeof currentSettingValue === "object") {
                    setting = currentSettingValue;
                    continue
                }

                // If the value of the currentSettingValue is undefined, return a TypeError
                if (currentSettingValue === undefined)
                    throw TypeError(`The setting ${key} couldn't be found`);

                // Set the new setting value if the value of the current setting value and new setting value is the same type,
                // else throw a TypeError
                if (newSettingValueIsSameType(key, newSettingValue, currentSettingValue)) {
                    setting[recurseKey] = newSettingValue;
                    settingValueChanged = true;
                    continue
                }
            }
            // If the setting was already changed, continue
            if(settingValueChanged)
                continue

            // Set the new setting value if the value of the current setting value and new setting value is the same type,
            // else throw a TypeError
            const currentSettingValue = setting.value;
            if (newSettingValueIsSameType(key, newSettingValue, currentSettingValue))
                setting.value = newSettingValue;
        }
        // Set the changed settings
        jsonSettings = updatedSettings;
    }

it("Change a single setting value", () => {
    updateSettings("gameRunning", true);
    expect(jsonSettings.gameRunning).toBe(true);

    updateSettings("gameRules-canCaptureBackwards", false);
    expect(jsonSettings.gameRules.canCaptureBackwards.value).toBe(false);
});

it("Change multiple setting values", () => {
    updateSettings(["gameRunning", "gameRules-canCaptureBackwards"], [true, false]);
    expect(jsonSettings.gameRunning).toBe(true);
});

it("Throw an TypeError if the changed setting value isn't the same type as the current setting value", () => {
    // Setting that needs to be changed
    let key = "gameRules-canCaptureBackwards";
    
    // Default values of the setting
    let currentValue = jsonSettings.gameRules.canCaptureBackwards.value;
    let currentValueType = typeof currentValue;
    
    // new values of the setting
    //! Set the new value to a type that isn't the same as the currentValueType
    let newValue = 'false';
    let newValueType = typeof newValue;
    
    // Test if the error message is given
    let expectedError = `The new value (${newValue} (${newValueType})) for the ${key} setting must be the same type as the old value (${currentValue} (${currentValueType}))`
    expect(() => updateSettings([key], [newValue])).toThrow(expectedError);
});

it("Throw an TypeError if the setting key couldn't be found", () => {
    // Setting that needs to be changed 
    let key = "gameRules-canCaptureBack";

    // Test if the error message is given
    let expectedError = `The setting ${key} couldn't be found`
    expect(() => updateSettings([key], [false])).toThrow(expectedError);
});