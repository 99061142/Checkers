import { GameProvider } from '../game/gameProvider/GameProvider.tsx';
import { SettingsProvider } from '../settings/settingsProvider/SettingsProvider.tsx';
import { UIProvider } from '../ui/uiProvider/UIProvider.tsx';
import UIRoot  from '../ui/UIRoot.tsx';
import '../zIndexStyles.scss';
import './app.scss';

const App = () => {
    return (
        <GameProvider>
            <SettingsProvider>
                <UIProvider>
                    <UIRoot />
                </UIProvider>
            </SettingsProvider>
        </GameProvider>
    );
}

export default App;