import { createRoot } from 'react-dom/client';
import { act } from '@testing-library/react';
import App from '../App';

// Mock the entire settingsData module
// This will allow us to spy on the initializeSettings function.
// We need to import the whole module to mock it, not just the function, 
// because we are using jest.spyOn to spy on the function.
import * as settingsData from '../settings/settingsData';

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

it("Check if the initializeSettings function is called when the App component is mounted", () => {
    // Spy on the initializeSettings function
    const spy = jest.spyOn(settingsData, 'initializeSettings');
    
    act(() => {
        root = createRoot(container);
        root.render(<App />);
    });
    
    // Expect the initializeSettings function to be called when the App component is mounted
    expect(spy).toHaveBeenCalled();

    // Clean up the spy.
    // This is important to avoid memory leaks and ensure that the spy does not affect other tests
    spy.mockRestore();
});