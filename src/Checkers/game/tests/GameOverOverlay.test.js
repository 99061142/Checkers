import { createRoot } from 'react-dom/client';
import { act,  } from '@testing-library/react';
import GameOverOverlay from '../GameOverOverlay';

// Import the gameData module to access all exported functions
// This will allow us to spy on the exported functions.
// We need to import the whole module to mock it, not just the function, 
// because we are using jest.spyOn to spy on one or more exported functions,
// and jest needs to be able to access the module to do that
import * as gameData from '../gameData';


let container = null;
beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
});

let root = null;
afterEach(() => {
    if (root) {
        act(() =>
            root.unmount()
        );
        root = null;
    }
    if (container) {
        container.remove();
        container = null;
    }
});

it("Should render the game over overlay with an h1 that says which player won", () => {
    act(() => {
        root = createRoot(container);
        root.render(<GameOverOverlay 
            winner={1} 
        />);
    });

    // Check if the game over overlay is rendered
    const gameOverOverlay = container.querySelector('[data-testid="gameOverOverlay"]');
    expect(gameOverOverlay).toBeTruthy();

    // Check if the h1 is rendered
    const h1 = container.querySelector('h1');
    expect(h1).toBeTruthy();

    // Check if the h1 says which player won
    expect(h1.textContent).toBe("PLAYER 1 WINS!");
});

it("Should render button to go back to the main menu", () => {
    act(() => {
        root = createRoot(container);
        root.render(<GameOverOverlay />);
    });

    // Check if the button is rendered
    const mainMenuButton = container.querySelector('[data-testid="gameOverOverlayMainMenuButton"]');
    expect(mainMenuButton).toBeTruthy();
});

it("Should call the toggleComponent function when the button is clicked", () => {
    // Mock function to simulate that the toggleComponent function was called
    const toggleComponent = jest.fn();

    act(() => {
        root = createRoot(container);
        root.render(<GameOverOverlay 
            toggleComponent={toggleComponent}
        />);
    });

    // Check if the mock function was called with 'MainMenu' when the button was clicked
    const mainMenuButton = container.querySelector('[data-testid="gameOverOverlayMainMenuButton"]');
    act(() =>
        mainMenuButton.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    );

    // Expect the toggleComponent function to have been called with 'MainMenu'
    expect(toggleComponent).toHaveBeenCalledWith('MainMenu');

    // Dispose of the toggleComponent mock function.
    // This is neccessary to avoid memory leaks and to ensure that the mock function is not called again in other tests.
    toggleComponent.mockClear();
});

it("Expect the function 'removeAllGameData' to be called when the main menu button is clicked", () => {
    // Mock the removeAllGameData function
    const removeAllGameDataMock = jest.spyOn(gameData, 'removeAllGameData');

    act(() => {
        root = createRoot(container);
        root.render(<GameOverOverlay 
            toggleComponent={() => {}}
        />);
    });

    // Check if the removeAllGameData function is called when the button is clicked
    const mainMenuButton = container.querySelector('[data-testid="gameOverOverlayMainMenuButton"]');
    act(() =>
        mainMenuButton.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    );
    
    // Expect the removeAllGameData function to have been called
    expect(removeAllGameDataMock).toHaveBeenCalled();

    // Dispose of the removeAllGameData mock function.
    // This is neccessary to avoid memory leaks and to ensure that the mock function is not called again in other tests.
    removeAllGameDataMock.mockRestore();
});