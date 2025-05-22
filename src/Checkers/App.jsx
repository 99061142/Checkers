import { Component } from 'react';
import { initializeSettings } from './settings/settingsData'
import Window from './Window';
import './app.scss';

class App extends Component {
    componentDidMount() {
        // Initialize the settings when the app is opened
        // This will check if the settings are already set in local storage, and if not, it will set them to the default settings
        // It will also update the localstorage if any settings are missing, which could happen when an update is made to the defaultSettings.json file, while the user already has the old version of the localstorage settings
        initializeSettings();
    }

    render() {
        return (
            <Window />
        );
    }
}

export default App;