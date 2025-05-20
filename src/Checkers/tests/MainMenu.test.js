import { createRoot } from 'react-dom/client';
import { act } from '@testing-library/react';
import MainMenu from '../MainMenu';

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

it("Should render the buttons to start the game, load the game, delete the game, or go to the settings", () => {
    act(() => {
        root = createRoot(container);
        root.render(<MainMenu />);
    });

    // Check if the start button is rendered
    const startButton = container.querySelector('[data-testid="mainMenuStartButton"]');
    expect(startButton).toBeTruthy();

    // Check if the load button is rendered
    const loadButton = container.querySelector('[data-testid="mainMenuLoadButton"]');
    expect(loadButton).toBeTruthy();

    // Check if the settings button is rendered
    const settingsButton = container.querySelector('[data-testid="mainMenuSettingsButton"]');
    expect(settingsButton).toBeTruthy();

    // Check if the delete button is rendered
    const deleteButton = container.querySelector('[data-testid="mainMenuDeleteSavedGameButton"]');
    expect(deleteButton).toBeTruthy();
});

it("Start a new game when the 'New game' button is clicked", () => {
    // Mock function to simulate that the toggleComponent function was called
    const toggleComponent = jest.fn();

    // Mock function to simulate that the setGameDataPresent function was called
    const setGameDataPresent = jest.fn();

    // Set local storage to simulate that the game data is present
    localStorage.setItem('stonesInformation', JSON.stringify({'0,0': 1}));
    localStorage.setItem('lastCurrentPlayer', 1);

    act(() => {
        root = createRoot(container);
        root.render(<MainMenu
            gameDataPresent={true}
            toggleComponent={toggleComponent}
            setGameDataPresent={setGameDataPresent}
        />);
    });

    // Simulate a click on the start button (this will start a new game)
    const startButton = container.querySelector('[data-testid="mainMenuStartButton"]');
    act(() =>
        startButton.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    );

    // Check if the toggleComponent function was called with "Game"
    expect(toggleComponent).toHaveBeenCalledWith('Game');

    // Check if the game data was set to false (This prop is a state inside the Window component, and will be true/false based on if the game data is present or not),
    // And will need to be set to false when a new game is started
    expect(setGameDataPresent).toHaveBeenCalledWith(false);

    // Check if the game data was removed from the local storage
    expect(localStorage.getItem('stonesInformation')).toBe(null);
    expect(localStorage.getItem('lastCurrentPlayer')).toBe(null);
});

it("Load a game when the 'Load game' button is clicked", () => {
    // Mock function to simulate that the toggleComponent function was called
    const toggleComponent = jest.fn();

    // Set local storage to simulate that the game data is present
    const mockStonesInformation = {'0,0': 1};
    const mockLastCurrentPlayer = 1;
    localStorage.setItem('stonesInformation', JSON.stringify(mockStonesInformation));
    localStorage.setItem('lastCurrentPlayer', mockLastCurrentPlayer);

    act(() => {
        root = createRoot(container);
        root.render(<MainMenu
            gameDataPresent={true}
            toggleComponent={toggleComponent}
        />);
    });

    // Simulate a click on the load button (this will load the game that was saved)
    const loadButton = container.querySelector('[data-testid="mainMenuLoadButton"]');
    act(() => 
        loadButton.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    );

    // Check if the toggleComponent function was called with "Game"
    expect(toggleComponent).toHaveBeenCalledWith('Game');

    // Expect the game data that is stored in the local storage to be the same when the game is loaded
    expect(JSON.parse(localStorage.getItem('stonesInformation'))).toEqual(mockStonesInformation);
    expect(localStorage.getItem('lastCurrentPlayer')).toBe(mockLastCurrentPlayer.toString());
});

it("Should disable the 'Load game' button and 'delete saved game' button when there is no game data present", () => {
    // Render the MainMenu component with gameDataPresent set to false.
    // This means that there is no game data present in the local storage,
    // and the buttons should be disabled
    act(() => {
        root = createRoot(container);
        root.render(<MainMenu
            gameDataPresent={false}
        />);
    });

    // Check if the load button is disabled
    const loadButton = container.querySelector('[data-testid="mainMenuLoadButton"]');
    expect(loadButton.disabled).toBe(true);

    // Check if the delete button is disabled
    const deleteButton = container.querySelector('[data-testid="mainMenuDeleteSavedGameButton"]');
    expect(deleteButton.getAttribute('aria-disabled')).toBe('true');
});


it("Should toggle to the Settings component when the 'Settings' button is clicked", () => {
    // Mock function to simulate that the toggleComponent function was called
    const toggleComponent = jest.fn();

    act(() => {
        root = createRoot(container);
        root.render(<MainMenu
            toggleComponent={toggleComponent}
        />);
    });

    // Simulate a click on the settings button
    const settingsButton = container.querySelector('[data-testid="mainMenuSettingsButton"]');
    act(() =>
        settingsButton.dispatchEvent(new MouseEvent("click", { bubbles: true }))
    );

    // Check if the toggleComponent function was called with "Settings"
    expect(toggleComponent).toHaveBeenCalledWith('Settings');
});

it("Should delete the saved game inside of the local storage when the 'Delete saved game' button is clicked", () => {
    // Mock function to simulate that the toggleComponent function was called
    const toggleComponent = jest.fn();
    
    // Mock function to simulate that the setGameDataPresent function was called
    // This function is inside of the gameData.js file, and is used to set the game data inside of the local storage
    const setGameDataPresent = jest.fn();

    // Set local storage to simulate that the game data is present
    localStorage.setItem('stonesInformation', JSON.stringify({'0,0': 1}));
    localStorage.setItem('lastCurrentPlayer', 1);

    act(() => {
        root = createRoot(container);
        root.render(<MainMenu
            gameDataPresent={true}
            toggleComponent={toggleComponent}
            setGameDataPresent={setGameDataPresent}
        />);
    });

    // Simulate a click on the delete button (this will delete the game data that was inside of the local storage)
    const deleteButton = container.querySelector('[data-testid="mainMenuDeleteSavedGameButton"]');
    act(() =>
        deleteButton.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    );

    // Check if the game data was removed from the local storage
    expect(localStorage.getItem('stonesInformation')).toBe(null);
    expect(localStorage.getItem('lastCurrentPlayer')).toBe(null);

    // Check if the game data was set to false (This prop is a state inside the Window component, and will be true/false based on if the game data is present or not),
    // and will need to be set to false when the game data has been deleted
    expect(setGameDataPresent).toHaveBeenCalledWith(false);
});

it("Should not start/load a game when the 'delete saved game' button is clicked", () => {
    // Mock function to simulate that the toggleComponent function was called
    const toggleComponent = jest.fn();

    // Mock function to simulate that the setGameDataPresent function was called
    const setGameDataPresent = jest.fn();

    // Set local storage to simulate a game data present
    localStorage.setItem('stonesInformation', JSON.stringify({'0,0': 1}));
    localStorage.setItem('lastCurrentPlayer', 1);

    act(() => {
        root = createRoot(container);
        root.render(<MainMenu
            gameDataPresent={true}
            toggleComponent={toggleComponent}
            setGameDataPresent={setGameDataPresent}
        />);
    });

    // Simulate a click on the delete button (this will delete the game data that was inside of the local storage)
    const deleteButton = container.querySelector('[data-testid="mainMenuDeleteSavedGameButton"]');
    act(() =>
        deleteButton.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    );

    // Check if the toggleComponent function was not called with "Game"
    expect(toggleComponent).not.toHaveBeenCalledWith('Game');
});

it("The buttons on the main menu should all have a tabIndex", () => {
    act(() => {
        root = createRoot(container);
        root.render(<MainMenu 
            gameDataPresent={true}
        />);
    });

    // Get the rendered buttons
    const startButton = container.querySelector('[data-testid="mainMenuStartButton"]');
    const loadButton = container.querySelector('[data-testid="mainMenuLoadButton"]');
    const settingsButton = container.querySelector('[data-testid="mainMenuSettingsButton"]');
    const deleteButton = container.querySelector('[data-testid="mainMenuDeleteSavedGameButton"]');

    // Check if the buttons have a tabIndex
    expect(startButton.getAttribute('tabIndex')).toBe('0');
    expect(loadButton.getAttribute('tabIndex')).toBe('1');
    expect(deleteButton.getAttribute('tabIndex')).toBe('2');
    expect(settingsButton.getAttribute('tabIndex')).toBe('3');
});

it("The delete saved game button should have a tabIndex -1 when there is no game data present", () => {
    act(() => {
        root = createRoot(container);
        root.render(<MainMenu 
            gameDataPresent={false}
        />);
    });

    // Check if the delete button has a tabIndex of -1
    const deleteButton = container.querySelector('[data-testid="mainMenuDeleteSavedGameButton"]');
    expect(deleteButton.getAttribute('tabIndex')).toBe('-1');
});