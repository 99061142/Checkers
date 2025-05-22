import { createRef, Component } from 'react';
import { createRoot } from 'react-dom/client';
import { act } from '@testing-library/react';
import Settings from '../Settings';
import defaultSettings from '../defaultSettings';

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

it("The initial form that must be shown is the game form", () => {
    // Set the initial settings to the localstorage.
    // This is needed since the Settings component uses the settings from the localstorage.
    // In normal use, the settings would be set to the localstorage when the App component is mounted.
    // But since we are testing the Settings component in isolation, we need to set the settings to the localstorage manually
    localStorage.setItem('settings', JSON.stringify(defaultSettings));

    act(() => {
        root = createRoot(container);
        root.render(<Settings />);
    });

    // Check if the game form is shown by default
    const gameForm = container.querySelector('[data-testid="gameSettings"]');
    expect(gameForm).toBeTruthy();
});

it("The initial formSettings state must be set to the settings from the localstorage", () => {
    // Set the initial settings to the localstorage.
    // This is needed since the Settings component uses the settings from the localstorage.
    // In normal use, the settings would be set to the localstorage when the App component is mounted.
    // But since we are testing the Settings component in isolation, we need to set the settings to the localstorage manually
    localStorage.setItem('settings', JSON.stringify(defaultSettings));

    const ref = createRef();
    act(() => {
        root = createRoot(container);
        root.render(<Settings 
            ref={ref}
        />);
    });

    // Check if the formSettings state is set to the settings from the localstorage
    const formSettings = ref.current.formSettings;
    expect(formSettings).toEqual(defaultSettings);
});

it("The keydown event listener must be added to the window when the component is mounted", () => {
    // Spy on the addEventListener listener.
    // This will allow us to check if the listener was called with the correct arguments
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');

    act(() => {
        root = createRoot(container);
        root.render(<Settings />);
    });

    // Check if the keydown event listener is added to the window.
    // This will be done by checking if the keydown event listener was called with any function as the second argument
    expect(addEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));

    // Clean up the spy.
    // This is important to avoid memory leaks and ensure that the spy does not affect other tests
    addEventListenerSpy.mockRestore();
});

it("The keydown event listener must be removed from the window when the component is unmounted", () => {
    // Spy on the removeEventListener listener.
    // This will allow us to check if the listener was called with the correct arguments
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

    act(() => {
        root = createRoot(container);
        root.render(<Settings />);
    });

    act(() => {
        root.unmount();
    });

    // Check if the keydown event listener is removed from the window.
    // This will be done by checking if the keydown listener was removed with any function as the second argument
    expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));

    // Clean up the spy.
    // This is important to avoid memory leaks and ensure that the spy does not affect other tests
    removeEventListenerSpy.mockRestore();
});

it("The beforeunload event listener must be added to the window when the component is mounted", () => {
    // Spy on the addEventListener listener.
    // This will allow us to check if the listener was called with the correct arguments
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');

    act(() => {
        root = createRoot(container);
        root.render(<Settings />);
    });

    // Check if the beforeunload event listener is added to the window.
    // This will be done by checking if the beforeunload event listener was called with any function as the second argument
    expect(addEventListenerSpy).toHaveBeenCalledWith('beforeunload', expect.any(Function));

    // Clean up the spy.
    // This is important to avoid memory leaks and ensure that the spy does not affect other tests
    addEventListenerSpy.mockRestore();
});

it("The beforeunload event listener must be removed from the window when the component is unmounted", () => {
    // Spy on the removeEventListener listener.
    // This will allow us to check if the listener was called with the correct arguments
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

    act(() => {
        root = createRoot(container);
        root.render(<Settings />);
    });

    act(() => {
        root.unmount();
    });

    // Check if the beforeunload event listener is removed from the window.
    // This will be done by checking if the beforeunload listener was removed with any function as the second argument
    expect(removeEventListenerSpy).toHaveBeenCalledWith('beforeunload', expect.any(Function));

    // Clean up the spy.
    // This is important to avoid memory leaks and ensure that the spy does not affect other tests
    removeEventListenerSpy.mockRestore();
});

it("When the user presses the escape key, the loadPreviousComponent prop function should be called", async () => {
    // Mock function to simulate that the loadPreviousComponent function was called.
    // This function is passed from the Window component to the Settings component,
    // and is used to change the component which is shown to the previously shown component
    const loadPreviousComponent = jest.fn();

    act(() => {
        root = createRoot(container);
        root.render(<Settings 
            loadPreviousComponent={loadPreviousComponent}
        />);
    });

    // Simulate the Escape key press
    await act(async () => {
        const event = new KeyboardEvent('keydown', { key: 'Escape' });
        window.dispatchEvent(event);

        // Await a short timeout to allow the event to be processed, this is necessary since the keyPressed function is async,
        // and uses a setTimeout to not overload the event loop
        await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Check if the loadPreviousComponent function was called
    expect(loadPreviousComponent).toHaveBeenCalled();
});

it("When the user presses the exit button, the loadPreviousComponent prop function should be called", () => {
    // Mock function to simulate that the loadPreviousComponent function was called.
    // This function is passed from the Window component to the Settings component,
    // and is used to change the component which is shown to the previously shown component
    const loadPreviousComponent = jest.fn();

    act(() => {
        root = createRoot(container);
        root.render(<Settings 
            loadPreviousComponent={loadPreviousComponent}
        />);
    });

    // Simulate the exit button press
    const exitButton = container.querySelector('[data-testid="exitButton"]');
    exitButton.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    // Check if the loadPreviousComponent function was called
    expect(loadPreviousComponent).toHaveBeenCalled();
});

it("The formSettings state must be saved to the localstorage when the component is unmounted", async () => {
    // Set the initial settings to the localstorage.
    // This is needed since the Settings component uses the settings from the localstorage.
    // In normal use, the settings would be set to the localstorage when the App component is mounted.
    // But since we are testing the Settings component in isolation, we need to set the settings to the localstorage manually.
    localStorage.setItem('settings', JSON.stringify(defaultSettings));

    const ref = createRef();
    act(() => {
        root = createRoot(container);
        root.render(<Settings 
            ref={ref}
        />);
    });

    act(() => {
        // Change the formSettings state.
        // This is needed to check if the formSettings state is saved to the localstorage when the component is unmounted.
        // In this test case, we are changing the boardSize to 10
        ref.current.updateSettingValue('boardSize', 10);

        // Unmount the component.
        // This is needed to trigger the componentWillUnmount lifecycle method
        root.unmount();
    });

    // Check if the changed formSettings state is saved to the localstorage
    const formSettings = JSON.parse(localStorage.getItem('settings'));
    expect(formSettings).toEqual({
        ...defaultSettings,
        boardSize: 10
    });
});

it("The formSettings state must be saved to the localstorage when the beforeunload event is triggered", async () => {
    // Set the initial settings to the localstorage.
    // This is needed since the Settings component uses the settings from the localstorage.
    // In normal use, the settings would be set to the localstorage when the App component is mounted.
    // But since we are testing the Settings component in isolation, we need to set the settings to the localstorage manually.
    localStorage.setItem('settings', JSON.stringify(defaultSettings));

    const ref = createRef();
    act(() => {
        root = createRoot(container);
        root.render(<Settings 
            ref={ref}
        />);
    });

    await act(async () => {
        // Change the formSettings state to a new value.
        // This is needed to check if the formSettings state is saved to the localstorage when the beforeunload event is triggered.
        // In this test case, we are changing the boardSize to 10.
        ref.current.updateSettingValue('boardSize', 10);
        ref.current.setState({
            formSettings: ref.current.formSettings
        });

        // Trigger the beforeunload event
        const event = new Event('beforeunload');
        window.dispatchEvent(event);

        // Await a short timeout to allow the event to be processed, this is necessary since the beforeUnloadHandler function is async,
        // and uses a setTimeout to not overload the event loop
        await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Check if the changed formSettings state is saved to the localstorage
    const formSettings = JSON.parse(localStorage.getItem('settings'));
    expect(formSettings).toEqual({
        ...defaultSettings,
        boardSize: 10
    });
});

it("The board settings form should be shown when the currentFormStr is set to 'board'", async () => {
    const ref = createRef();
    act(() => {
        root = createRoot(container);
        root.render(<Settings 
            ref={ref}
        />);
    });

    // Set the currentFormStr to 'board'
    await act(async () =>
        ref.current.setFormShownStr('board')
    );

    // Check if the board settings form is shown
    const boardForm = container.querySelector('[data-testid="boardSettings"]');
    expect(boardForm).toBeTruthy();
});

it("The game settings form should be shown when the 'game' settings button inside of the settings navigation bar is clicked", () => {
    const ref = createRef();
    act(() => {
        root = createRoot(container);
        root.render(<Settings 
            ref={ref}
        />);
    });

    // Set the currentFormStr to 'board' since the currentFormStr is set to 'game' by default,
    // which would disable the game settings button in the settings navigation bar,
    // and would either way show the game settings form, without the need to click the button inside of the settings navigation bar
    act(() =>
        ref.current.setFormShownStr('board')
    );

    // Simulate a click on the 'game' settings button inside of the settings navigation bar
    const settingsNavLinkGame = container.querySelector('[data-testid="settingsNavLinkGame"]');
    act(() =>
        settingsNavLinkGame.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    );

    // Check if the game settings form is shown
    const gameForm = container.querySelector('[data-testid="gameSettings"]');
    expect(gameForm).toBeTruthy();
});

it("The board settings form should be shown when the 'board' settings button inside of the settings navigation bar is clicked", () => {
    const ref = createRef();
    act(() => {
        root = createRoot(container);
        root.render(<Settings 
            ref={ref}
        />);
    });

    // Simulate a click on the 'board' settings button inside of the settings navigation bar
    const settingsNavLinkBoard = container.querySelector('[data-testid="settingsNavLinkBoard"]');
    act(() =>
        settingsNavLinkBoard.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    );

    // Check if the board settings form is shown
    const boardForm = container.querySelector('[data-testid="boardSettings"]');
    expect(boardForm).toBeTruthy();
});

it("The button for the game inside of the settings navigation bar should be disabled when the currentFormStr is set to 'game'", () => {
    const ref = createRef();
    act(() => {
        root = createRoot(container);
        root.render(<Settings 
            ref={ref}
        />);
    });

    // Check if the button for the game inside of the settings navigation bar is disabled.
    // This should happen since the currentFormStr is set to 'game' by default,
    // which means we don't need to change the currentFormStr to 'game' in this test case
    const settingsNavLinkGame = container.querySelector('[data-testid="settingsNavLinkGame"]');
    expect(settingsNavLinkGame.disabled).toBeTruthy();
});

it("The button for the board inside of the settings navigation bar should be disabled when the currentFormStr is set to 'board'", () => {
    const ref = createRef();
    act(() => {
        root = createRoot(container);
        root.render(<Settings 
            ref={ref}
        />);
    });

    // Set the currentFormStr to 'board'.
    // This is needed since the currentFormStr is set to 'game' by default
    act(() =>
        ref.current.setFormShownStr('board')
    );

    // Check if the button for the board inside of the settings navigation bar is disabled
    const settingsNavLinkBoard = container.querySelector('[data-testid="settingsNavLinkBoard"]');
    expect(settingsNavLinkBoard.disabled).toBeTruthy();
});

class ErrorBoundaryRangeError extends Component {
    constructor(props) {
        super(props);
        this.state = { errorMessage: null };
    }

    static getDerivedStateFromError(error) {
        // Remove 'RangeError: ' from the error message
        // This will only show the error message, and not the type of error
        const errorMessage = error.toString().replace('RangeError: ', '');
        return { errorMessage: errorMessage };
    }

    render() {
        if (this.state.errorMessage) {
            return <h1>{this.state.errorMessage}</h1>;
        }
        return this.props.children;
    }
}

it("Throws RangeError when the currentFormStr is set to an invalid value that is not in the switch statement when trying to render a form", () => {
    const ref = createRef(null);
    act(() => {
        root = createRoot(container);
        root.render(
            <ErrorBoundaryRangeError>
                <Settings
                    ref={ref}
                />
            </ErrorBoundaryRangeError>
        );
    });

    // Set the state 'currentComponentStr' to a value that is not in the switch statement
    // In this case, the value is 'InvalidComponent'
    const invalidComponentName = 'InvalidComponent';
    act(() => {
        ref.current.setFormShownStr(invalidComponentName);
    });

    // Check if the error message is shown
    const expectedError = `Invalid currentFormStr: ${invalidComponentName}. Check if the form name is a valid case in the switch statement.`;
    const errorMessage = container.querySelector('h1'); // This will be an element that will be rendered in the ErrorBoundaryRangeError class if an error is thrown. This is because the test environment is not set up to throw errors, and the error will be caught in the ErrorBoundaryRangeError class
    expect(errorMessage).toBeTruthy();
    expect(errorMessage.textContent).toBe(expectedError);
});

it("Update the formSettings state when the updateSettingValue function is called with the setting name (as nested keys) and the new value", () => {
    // Set the initial settings to the localstorage.
    // This is needed since the Settings component uses the settings from the localstorage.
    // In normal use, the settings would be set to the localstorage when the App component is mounted.
    // But since we are testing the Settings component in isolation, we need to set the settings to the localstorage manually.
    localStorage.setItem('settings', JSON.stringify(defaultSettings));

    const ref = createRef();
    act(() => {
        root = createRoot(container);
        root.render(<Settings 
            ref={ref}
        />);
    });

    /* e.g.:
        {
            initialPlayer: 1,
            gameRules: {
                mandatoryCapture: true
            }
        }

        If the user wants to change the initialPlayer to 2,
        the updateSettingValue function should be called with the setting name 'initialPlayer' and the new value 2. (updateSettingValue('initialPlayer', 2))

        If the user wants to change the mandatoryCapture to false,
        the updateSettingValue function should be called with the setting name 'gameRules-mandatoryCapture' and the new value false. (updateSettingValue('gameRules-mandatoryCapture', false))

        This means that when the user wants to change a setting that is nested in an object,
        the setting name should be passed as a string with the nested keys separated by a dash '-'
    */

    // Update the formSettings state with a new value based on a setting name which isn't nested,
    // and check if the formSettings state is updated with the new value.
    // In this case, the non nested setting name is 'initialPlayer', and the new value is 2
    
    act(() =>
        ref.current.updateSettingValue('initialPlayer', 2)
    );
    expect(ref.current.formSettings.initialPlayer).toBe(2);

    // Update the formSettings state with a new value based on a nested setting name,
    // and check if the formSettings state is updated with the new value.
    // In this case, the nested setting name is 'gameRules-mandatoryCapture', and the new value is false
    act(() =>
        ref.current.updateSettingValue('gameRules-mandatoryCapture', false)
    );
    expect(ref.current.formSettings.gameRules.mandatoryCapture).toBe(false);
});

it("Expects the updateSettingValue function to throw an error when the nested setting name is not valid", () => {
    // Set the initial settings to the localstorage.
    // This is needed since the Settings component uses the settings from the localstorage.
    // In normal use, the settings would be set to the localstorage when the App component is mounted.
    // But since we are testing the Settings component in isolation, we need to set the settings to the localstorage manually.
    localStorage.setItem('settings', JSON.stringify(defaultSettings));

    const ref = createRef();
    act(() => {
        root = createRoot(container);
        root.render(<Settings 
            ref={ref}
        />);
    });

    // Check if an error is thrown when trying to update a setting that is not valid which is not a nested key.
    // In this case, we test the non nested setting name 'invalidSettingName', which doesn't exist in the settings object
    const singleNestedSettingName = 'invalidSettingName';
    expect(() =>
        ref.current.updateSettingValue(singleNestedSettingName, 2)
    ).toThrow(`The key '${singleNestedSettingName}' doesn't exist in the first level of the settings object.`);

    // Check if an error is thrown when trying to update a setting that is not valid which is a nested key.
    // In this case, we test the nested setting name 'gameRules-invalidSettingName', which doesn't exist in the settings object.
    // The gameRules object is the first level of the settings object, and the invalidSettingName is the second level of the settings object.
    // This means that the updateSettingValue function should throw an error with the message 'The key 'invalidSettingName' doesn't exist in level 1 of the settings object, after the key 'gameRules'.'
    // Since the first key 'gameRules' is valid, but inside of the gameRules object, the invalidSettingName key doesn't exist
    const nestedSettingName = 'gameRules-invalidSettingName';
    expect(() =>
        ref.current.updateSettingValue(nestedSettingName, 2)
    ).toThrow(`The key 'invalidSettingName' doesn't exist in level 1 of the settings object, after the key 'gameRules'.`);
});