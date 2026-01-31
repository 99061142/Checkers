import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import App from './App.jsx';

/* Test whether the application renders without crashing */
test('Renders without crashing', () => {
    render(
        <App />
    );
});