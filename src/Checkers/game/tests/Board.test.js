import { createRoot } from 'react-dom/client';
import { act } from '@testing-library/react';
import defaultSettings from '../../settings/defaultSettings';
import Board from '../Board';

let container = null;
beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
});

let root = null;
afterEach(() => {
    if (root) {
        act(() => {
            root.unmount();
        });
        root = null;
    }
    if (container) {
        container.remove();
        container = null;
    }
});

it("Should render the board with the correct amount of stones based on the board size", () => {
    for (const size of [8, 10, 12]) {
        // Set the default settings to the local storage, and set the board size to the current size that is being tested
        // This must happen since the Board component uses the local storage to get the settings
        const settings = { 
            ...defaultSettings,
            boardSize: size
        };
        localStorage.setItem('settings', JSON.stringify(settings));

        act(() => {
            root = createRoot(container);
            root.render(<Board />);
        });

        // Check if the amount of stones is correct based on the board size
        const expectedStonesAmount = size * (size - 2) / 2; // 8 = 24, 10 = 40, 12 = 60
        const stonesAmount = container.getElementsByClassName('stone').length;
        expect(stonesAmount).toBe(expectedStonesAmount);
    }
});