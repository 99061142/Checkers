import { SettingsProvider } from '../settings/settingsProvider/SettingsProvider.tsx';
import { UIProvider } from '../ui/uiProvider/UIProvider.tsx';
import UIRoot  from '../ui/UIRoot.tsx';
import '../zIndexStyles.scss';
import './app.scss';

const App = () => {
    return (
        <SettingsProvider>
            <UIProvider>
                <UIRoot />
            </UIProvider>
        </SettingsProvider>
    );
}

export default App;