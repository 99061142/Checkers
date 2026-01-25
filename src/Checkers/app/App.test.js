import '@testing-library/jest-dom';
import { render, act } from '@testing-library/react';
import App from './App.jsx';

describe('App', () => {
    test('renders without crashing', async () => {
        await act(async () => {
            render(
                <App />
            );
        });
    });
});