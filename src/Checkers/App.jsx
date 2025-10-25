import { GameStorageProvider } from './game/gameStorage/gameStorage.tsx';
import { SettingsStorageProvider } from './settings/settingsStorage/settingsStorage.tsx';
import Window from './window/Window.tsx';
import './zIndexStyles.scss';
import './app.scss';

const App = () => {
    return (
        <GameStorageProvider>
            <SettingsStorageProvider>
                <Window />
            </SettingsStorageProvider>
        </GameStorageProvider>
    );
}

export default App;