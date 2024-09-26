import Window from './Window';

class App extends Window {
    constructor() {
        super();
        this.state = {
            ...this.state,
            settings: require('./settings/settingsData.json')
        };
    }

    get settings() {
        return this.state.settings
    }

    setSettings = (settings) => {
        this.setState({
            settings
        });
    }

    updateSettings = (keys, values) => {
        const updatedSettings = JSON.parse(JSON.stringify(this.settings));    
        for(const [i, key] of keys.entries()) {
            const newValue = values[i];
            if (updatedSettings[key].constructor === Object)
                updatedSettings[key].value = newValue;
            else
                updatedSettings[key] = newValue;
        }
        this.setSettings(updatedSettings);
    }
}

export default App;