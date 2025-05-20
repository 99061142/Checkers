import { Component, createRef } from 'react';
import { createRoot } from 'react-dom/client';
import { act } from '@testing-library/react';
import defaultSettings from '../settings/defaultSettings';
import Window from '../Window';

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

it("The initial component that is shown should be the MainMenu", () => {
    act(() => {
        root = createRoot(container);
        root.render(<Window />);
    });

    // Check if the initial component that is being rendered is the main menu
    const mainMenu = container.querySelector('[data-testid="mainMenu"]');
    expect(mainMenu).toBeTruthy();
});

it("Expect the game to be shown when the currentComponentStr is set to 'Game'", async () => {
    // Set the default settings in local storage
    // This will be needed, since an error wil be thrown if the settings are not set
    // In the application itself, the settings are set in the App.jsx file, which will be the first file to be loaded,
    // And will render the Window component as a child
    localStorage.setItem('settings', JSON.stringify(defaultSettings));
    
    const ref = createRef(null);
    act(() => {
        root = createRoot(container);
        root.render(<Window 
            ref={ref}
        />);
    });

    // Set the state 'currentComponentStr' to 'Game'
    // This state will be used to determine which component will be shown
    await act(async () =>
        ref.current.setComponentStr('Game')
    );

    // Check if the game component is being rendered
    const board = container.querySelector('[data-testid="board"]');
    expect(board).toBeTruthy();
});

it("Expect the settings to be shown when the currentComponentStr is set to 'Settings'", async () => {
    const ref = createRef(null);
    act(() => {
        root = createRoot(container);
        root.render(<Window 
            ref={ref}
        />);
    });

    // Set the state 'currentComponentStr' to 'Settings'
    // This state will be used to determine which component will be shown
    await act(async () => {
        ref.current.setComponentStr('Settings');
    });

    // Check if the settings component is being rendered
    const settings = container.querySelector('[data-testid="settings"]');
    expect(settings).toBeTruthy();
});

it("Expect the escape menu to be shown when the currentComponentStr is set to 'EscapeMenu'", async () => {
    const ref = createRef(null);
    act(() => {
        root = createRoot(container);
        root.render(<Window 
            ref={ref}
        />);
    });

    // Set the state 'currentComponentStr' to 'EscapeMenu'
    // This state will be used to determine which component will be shown
    await act(async () => {
        ref.current.setComponentStr('EscapeMenu');
    });

    // Check if the escape menu component is being rendered
    const escapeMenu = container.querySelector('[data-testid="escapeMenu"]');
    expect(escapeMenu).toBeTruthy();
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

it("Throws RangeError when the componentStr is set to a value that is not in the switch statement", async () => {
    const ref = createRef(null);
    act(() => {
        root = createRoot(container);
        root.render(
            <ErrorBoundaryRangeError>
                <Window
                    ref={ref}
                />
            </ErrorBoundaryRangeError>
        );
    });

    // Set the state 'currentComponentStr' to a value that is not in the switch statement
    // In this case, the value is 'InvalidComponent'
    const invalidComponentName = "InvalidComponent";
    await act(async () => {
        ref.current.setComponentStr(invalidComponentName);
    });
    
    // Expect that an error is thrown, and that the correct error message is shown
    const expectedError = `Invalid component name: '${invalidComponentName}'. Check if the component name is starting with a capital letter, and if the component is in the switch statement.`
    const errorMessage = container.querySelector('h1'); // This will be an element that will be rendered in the ErrorBoundaryRangeError class if an error is thrown. This is because the test environment is not set up to throw errors, and the error will be caught in the ErrorBoundaryRangeError class
    expect(errorMessage).toBeTruthy();
    expect(errorMessage.textContent).toBe(expectedError);
});

it("Log an error when the user toggles to the same component", async () => {
    const ref = createRef(null);
    act(() => {
        root = createRoot(container);
        root.render(<Window 
            ref={ref} 
        />);
    });

    // Spy on the console.error method to check if it is called, and what it had been called with.
    // This will be used to check if the error is logged correctly
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    // call the toggleComponent function with the same component
    // This will be the main menu, since this is the default component that is being rendered
    const calledComponent = "MainMenu";
    ref.current.toggleComponent(calledComponent);

    // Expect an error log when trying to load the same component
    expect(consoleErrorSpy).toHaveBeenCalledWith(`Error: Tried to switch to the same component: ${calledComponent}.`);
    
    // Restore the console.error method to its original implementation.
    // This will be done to avoid any side effects in other tests
    consoleErrorSpy.mockRestore();
});

it("Log an error when the user tries to load the previous component, but the previous component is null", async () => {
    const ref = createRef(null);
    act(() => {
        root = createRoot(container);
        root.render(<Window 
            ref={ref} 
        />);
    });

    // Spy on the console.error method to check if it is called, and what it had been called with.
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    // Call the loadPreviousComponent function
    // This will be null, since the previous component isn't set when the Window component is first rendered, 
    // and will only be set when the user toggles to a different component, which will set the previous component to the current component
    ref.current.loadPreviousComponent();

    // Expect an error log when trying to load the previous component, since the previous component is null
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error: Tried to switch to the previous component, but the previous component is null.');
    
    // Restore the console.error method to its original implementation.
    // This will be done to avoid any side effects in other tests
    consoleErrorSpy.mockRestore();
});

it("Log an error when the user tries to load the previous component, but the previous component is the same as the current component", async () => {
    const ref = createRef(null);
    act(() => {
        root = createRoot(container);
        root.render(<Window 
            ref={ref} 
        />);
    });

    // Set the current component to the main menu.
    // Because the currentComponentStr is set as 'MainMenu' when the Window component is first rendered,
    // the previousComponentStr will be set to 'mainMenu' as well, since the previousCompoenentStr is set to the currentComponentStr when the setComponentStr function is called.
    // * NOTE: the setComponentStr will never be called as a solo function inside the application itself. 
    // * This is why we can use it in this case to test the error log. 
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const calledComponent = "MainMenu";
    await act(async () => {
        ref.current.setComponentStr(calledComponent);
    });

    // Call the loadPreviousComponent function
    ref.current.loadPreviousComponent();
    
    // Expect an error log when trying to load the previous component, since the previous component is the same as the current component
    expect(consoleErrorSpy).toHaveBeenCalledWith(`Error: Tried to switch to the previous component, but the previous component is the same as the current component: ${calledComponent}.`);
    consoleErrorSpy.mockRestore();
});