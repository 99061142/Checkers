import { Component } from 'react';
import { initializeSettings } from './settings/settingsData.ts'
import Window from './Window.tsx';
import './app.scss';

class App extends Component {
    componentDidMount() {
        // Initialize the settings when the application starts
        initializeSettings();
    }

    render() {
        return (
            <Window />
        );
    }
}

export default App;