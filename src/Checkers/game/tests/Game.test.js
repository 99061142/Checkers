import { createRef } from 'react';
import { createRoot } from 'react-dom/client';
import { act, waitFor, fireEvent } from '@testing-library/react';
import defaultSettings from '../../settings/defaultSettings.json';
import Game from '../Game';

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

// Set the initial settings to the localstorage.
// This is needed since the Settings component uses the settings from the localstorage.
// In normal use, the settings would be set to the localstorage when the App component is mounted.
// But since we are testing the Game component in isolation, we need to set the settings to the localstorage manually.
localStorage.setItem('settings', JSON.stringify(defaultSettings));

it("The keydown event listener must be added to the window when the component is mounted", () => {
    // Spy on the addEventListener listener.
    // This will allow us to check if the listener was called with the correct arguments
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');

    act(() => {
        root = createRoot(container);
        root.render(<Game 
            setGameDataPresent={() => {}}
        />);
    });

    // Check if the keydown event listener is added to the window.
    // This will be done by checking if the keydown event listener was called with any function as the second argument
    expect(addEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));

    // Dispose of the addEventListenerSpy spy.
    // This is important to avoid memory leaks and ensure that the spy is removed after the test is done
    addEventListenerSpy.mockRestore();
});

it("The keydown event listener must be removed from the window when the component is unmounted", () => {
    // Spy on the removeEventListener listener.
    // This will allow us to check if the listener was called with the correct arguments
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

    act(() => {
        root = createRoot(container);
        root.render(<Game 
            setGameDataPresent={() => {}}
        />);
    });

    // Unmount the component to trigger the componentWillUnmount lifecycle method
    act(() =>
        root.unmount()
    );

    // Check if the keydown event listener is removed from the window.
    // This will be done by checking if the keydown event listener was called with any function as the second argument
    expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));

    // Dispose of the removeEventListenerSpy spy.
    // This is important to avoid memory leaks and ensure that the spy is removed after the test is done
    removeEventListenerSpy.mockRestore();
});

it("The beforeunload event listener must be added to the window when the component is mounted", () => {
    // Spy on the addEventListener listener.
    // This will allow us to check if the listener was called with the correct arguments
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');

    act(() => {
        root = createRoot(container);
        root.render(<Game 
            setGameDataPresent={() => {}}
        />);
    });

    // Check if the beforeunload event listener is added to the window.
    // This will be done by checking if the beforeunload event listener was called with any function as the second argument
    expect(addEventListenerSpy).toHaveBeenCalledWith('beforeunload', expect.any(Function));

    // Dispose of the addEventListenerSpy spy.
    // This is important to avoid memory leaks and ensure that the spy is removed after the test is done
    addEventListenerSpy.mockRestore();
});

it("The beforeunload event listener must be removed from the window when the component is unmounted", () => {
    // Spy on the removeEventListener listener.
    // This will allow us to check if the listener was called with the correct arguments
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

    act(() => {
        root = createRoot(container);
        root.render(<Game 
            setGameDataPresent={() => {}}
        />);
    });

    // Unmount the component to trigger the componentWillUnmount lifecycle method
    act(() =>
        root.unmount()
    );

    // Check if the beforeunload event listener is removed from the window.
    // This will be done by checking if the beforeunload event listener was called with any function as the second argument
    expect(removeEventListenerSpy).toHaveBeenCalledWith('beforeunload', expect.any(Function));

    // Dispose of the removeEventListenerSpy spy.
    // This is important to avoid memory leaks and ensure that the spy is removed after the test is done
    removeEventListenerSpy.mockRestore();
});

it("The setGameDataPresent prop function must be called when the component is mounted, with the parameter 'true'", () => {
    // Spy on the setGameDataPresent prop function.
    // This will allow us to check if the function was called with the correct arguments
    const setGameDataPresent = jest.fn();

    act(() => {
        root = createRoot(container);
        root.render(<Game 
            setGameDataPresent={setGameDataPresent}
        />);
    });

    // Check if the setGameDataPresent prop function is called with the parameter 'true'
    expect(setGameDataPresent).toHaveBeenCalledWith(true);

    // Dispose of the setGameDataPresent mock function.
    // This is important to avoid memory leaks and ensure that the mock function is removed after the test is done
    setGameDataPresent.mockRestore();
});

it("If the game is over, and the component is unmounted, the setGameDataPresent prop function must be called with the parameter 'false'", () => {
    // Spy on the setGameDataPresent prop function.
    // This will allow us to check if the function was called with the correct arguments
    const setGameDataPresent = jest.fn();

    const ref = createRef();
    act(() => {
        root = createRoot(container);
        root.render(<Game
            ref={ref}
            setGameDataPresent={setGameDataPresent}
        />);
    });

    // Set the game over state to true
    // This is needed to test if the setGameDataPresent prop function is called with the parameter 'false',
    // since that will only happen if the game is over
    act(() =>
        ref.current.setGameOver(true)
    );

    // Unmount the component to trigger the componentWillUnmount lifecycle method
    act(() =>
        root.unmount()
    );

    // Check if the setGameDataPresent prop function is called with the parameter 'false'
    expect(setGameDataPresent).toHaveBeenCalledWith(false);

    // Dispose of the setGameDataPresentSpy mock function.
    // This is important to avoid memory leaks and ensure that the mock function is removed after the test is done
    setGameDataPresent.mockRestore();
});

it("Expect the currentPlayer state to be the same as the saved player in the local storage if there is a saved player", () => {
    // Set the 'saved player' to the local storage.
    // This is needed to test if the currentPlayer state is set to the saved player in the local storage
    localStorage.setItem('lastCurrentPlayer', 3);

    const ref = createRef();
    act(() => {
        root = createRoot(container);
        root.render(<Game 
            setGameDataPresent={() => {}}
            gameDataPresent={true}
            ref={ref}
        />);
    });

    // Check if the currentPlayer state is the same as the saved player in the local storage
    expect(ref.current.currentPlayer).toEqual(3);

    // Remove the lastCurrentPlayer from the local storage.
    // This is important to avoid memory leaks and ensure that the 'lastCurrentPlayer' local storage item is removed after the test is done
    localStorage.removeItem('lastCurrentPlayer');
});

it("Expect the currentPlayer state to be equal to the initial player in the defaultSettings.json file if there is no saved player", () => {
    const ref = createRef();
    act(() => {
        root = createRoot(container);
        root.render(<Game 
            setGameDataPresent={() => {}}
            gameDataPresent={false}
            ref={ref}
        />);
    });

    // Check if the currentPlayer state is the same as the initial player in the defaultSettings.json file.
    expect(ref.current.currentPlayer).toEqual(defaultSettings.initialPlayer);
});

it("Expect the current player to be saved to the local storage when the component is unmounted, and the game is not over", () => {
    const ref = createRef();
    act(() => {
        root = createRoot(container);
        root.render(<Game 
            setGameDataPresent={() => {}}
            ref={ref}
        />);
    });

    // Call the switchPlayer function to change the current player (if player is 1, it will be set to 2, and vice versa)
    // This is needed to test if the current player is saved to the local storage
    act(() => {
        ref.current.switchPlayer();
    });

    // Set the player it has switched to to the variable currentPlayer
    // This is needed to test if the current player is saved to the local storage
    const currentPlayer = ref.current.currentPlayer;

    // Unmount the component to trigger the componentWillUnmount lifecycle method
    act(() =>
        root.unmount()
    );

    // Check if the current player is saved to the local storage
    expect(localStorage.getItem('lastCurrentPlayer')).toEqual(currentPlayer.toString());

    // Remove the saved player from the local storage.
    // This is important to avoid memory leaks and ensure that the 'lastCurrentPlayer' local storage item is removed after the test is done
    localStorage.removeItem('lastCurrentPlayer');
});

it("Expect that the current player isn't saved to the local storage when the component is unmounted, and the game is over", () => {
    const ref = createRef();
    act(() => {
        root = createRoot(container);
        root.render(<Game 
            setGameDataPresent={() => {}}
            ref={ref}
        />);
    });

    // Set the game over state to true
    act(() =>
        ref.current.setGameOver(true)
    );

    // Unmount the component to trigger the componentWillUnmount lifecycle method
    act(() =>
        root.unmount()
    );

    // Check if the current player isn't saved to the local storage
    expect(localStorage.getItem('lastCurrentPlayer')).toBeNull();
});

it("Expect the 'toggleComponent' prop function to be called with 'EscapeMenu' when the 'Escape' key is pressed", async () => {
    // Mock function to simulate that the toggleComponent function was called
    const toggleComponent = jest.fn();

    act(() => {
        root = createRoot(container);
        root.render(<Game 
            setGameDataPresent={() => {}}
            toggleComponent={toggleComponent}
        />);
    });

    await act(async () => {
        // Dispatch a keyboard event to simulate the Escape key press
        fireEvent.keyDown(window, { key: 'Escape' });

        // Await a short timeout to allow the event to be processed, this is necessary since the keyPressed function is async,
        // and uses a setTimeout to not overload the event loop
        await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Expect the toggleComponent function to have been called with 'EscapeMenu'
    expect(toggleComponent).toHaveBeenCalledWith("EscapeMenu");

    // Dispose of the toggleComponent mock function.
    // This is important to avoid memory leaks and ensure that the mock function is removed after the test is done
    toggleComponent.mockRestore();
});

it("Expect the 'removeAllGameData' function to be called when the beforeunload event is triggered", async () => {
    // Set the initial settings to the localstorage.
    // This is needed since the Settings component uses the settings from the localstorage.
    // In normal use, the settings would be set to the localstorage when the App component is mounted.
    // But since we are testing the Settings component in isolation, we need to set the settings to the localstorage manually.
    localStorage.setItem('settings', JSON.stringify(defaultSettings));

    // Spy on the removeAllGameData function.
    // This is an exported function from the gameData module,
    // and we need to spy on it to check if it was called when the beforeunload event is triggered
    const removeAllGameDataSpy = jest.spyOn(gameData, 'removeAllGameData');

    const ref = createRef();
    act(() => {
        root = createRoot(container);
        root.render(<Game 
            setGameDataPresent={() => {}}
            ref={ref}
        />);
    });

    // Set the game over state to true
    act(() =>
        ref.current.setGameOver(true)
    );

    // Wait for the gameOver state to be set to true
    await waitFor(() =>
        expect(ref.current.gameOver).toBe(true)
    );

    // Call the beforeUnloadHandler directly to ensure that the removeAllGameData function is called.
    // If we don't call the beforeUnloadHandler directly, the removeAllGameData function will not be called
    act(() =>
        ref.current.beforeUnloadHandler()
    );

    // Expect the removeAllGameData function to be called,
    // Which will remove all game data from the local storage
    expect(removeAllGameDataSpy).toHaveBeenCalled();

    // Dispose of the removeAllGameDataSpy spy.
    // This is important to avoid memory leaks and ensure that the spy is removed after the test is done
    removeAllGameDataSpy.mockRestore();
});