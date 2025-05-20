import { createRoot } from 'react-dom/client';
import { act } from '@testing-library/react';
import EscapeMenu from '../EscapeMenu';

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

it("Should render the buttons to resume the game, navigate to the settings, or quit the game in the escape menu", () => {
    act(() => {
        root = createRoot(container);
        root.render(<EscapeMenu />);
    });

    // Check if the resume button is rendered
    const resumeButton = container.querySelector('[data-testid="escapeMenuResumeButton"]');
    expect(resumeButton).toBeTruthy();

    // Check if the settings button is rendered
    const settingsButton = container.querySelector('[data-testid="escapeMenuSettingsButton"]');
    expect(settingsButton).toBeTruthy();

    // Check if the quit button is rendered
    const quitButton = container.querySelector('[data-testid="escapeMenuQuitButton"]');
    expect(quitButton).toBeTruthy();
});

it("Should call the toggleComponent function when the buttons are clicked", () => {
    // Mock function to simulate that the toggleComponent function was called
    const toggleComponent = jest.fn();

    act(() => {
        root = createRoot(container);
        root.render(<EscapeMenu 
            toggleComponent={toggleComponent}
        />);
    });

    // Check if the mock function was called with 'Game' when the resume button was clicked
    const resumeButton = container.querySelector('[data-testid="escapeMenuResumeButton"]');
    act(() =>
        resumeButton.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    );
    expect(toggleComponent).toHaveBeenCalledWith('Game');

    // Check if the mock function was called with 'Settings' when the settings button was clicked
    const settingsButton = container.querySelector('[data-testid="escapeMenuSettingsButton"]');
    act(() => 
        settingsButton.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    );
    expect(toggleComponent).toHaveBeenCalledWith('Settings');

    // Check if the mock function was called with 'MainMenu' when the quit button was clicked
    const quitButton = container.querySelector('[data-testid="escapeMenuQuitButton"]');
    act(() =>
        quitButton.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    );
    expect(toggleComponent).toHaveBeenCalledWith('MainMenu');
});

it("If the user presses the escape key, the toggleComponent function should be called with the argument 'Game'", async () => {
    // Mock function to simulate that the toggleComponent function was called
    const toggleComponent = jest.fn();

    act(() => {
        root = createRoot(container);
        root.render(<EscapeMenu 
            toggleComponent={toggleComponent}
        />);
    });

    // Simulate the Escape key press
    await act(async () => {
        // Dispatch a keyboard event to simulate the Escape key press
        const event = new KeyboardEvent('keydown', { key: 'Escape' });
        window.dispatchEvent(event);

        // Await a short timeout to allow the event to be processed, this is necessary since the keyPressed function is async,
        // and uses a setTimeout to not overload the event loop
        await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Expect the toggleComponent function to have been called with 'Game'
    expect(toggleComponent).toHaveBeenCalledWith("Game");
});

it("Should add the event listener to the escape menu component is mounted", () => {
    // Spy to monitor calls to the addEventListener function
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
    
    act(() => {
        root = createRoot(container);
        root.render(<EscapeMenu />);
    });

    // Expect the addEventListener function to have been called with 'keydown' and any function as the handler
    expect(addEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
});

it("Should remove the event listener when the escape menu component is unmounted", () => {
    // Spy to monitor calls to the removeEventListener function
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
    
    act(() => {
        root = createRoot(container);
        root.render(<EscapeMenu />);
    });

    // Unmount the component to check if the event listener is removed when the component is unmounted
    act(() => 
        root.unmount()
    );

    // Check if the 'keydown' event listener was removed from the window object,
    // With any function as the handler
    expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
});