import { FC } from 'react';
import Providers from '../providers/Providers.tsx';
import UIRoot from '../ui/UIRoot.tsx';
import '../zIndexStyles.scss';
import './app.scss';

const App: FC = () => {
    return (
        <Providers>
            <UIRoot />
        </Providers>
    );
}

export default App;