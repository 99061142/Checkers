import { GameStorageProvider } from '../game/gameStorage/gameStorage.tsx';
import { SettingsStorageProvider } from '../settings/settingsStorage/settingsStorage.tsx';
import { UIProvider } from '../ui/uiProvider/UIProvider.tsx';
import UIRoot  from '../ui/UIRoot.tsx';
import '../zIndexStyles.scss';
import './app.scss';

const App = () => {
    return (
        <GameStorageProvider>
            <SettingsStorageProvider>
                <UIProvider>
                    <UIRoot />
                </UIProvider>
            </SettingsStorageProvider>
        </GameStorageProvider>
    );
}

export default App;