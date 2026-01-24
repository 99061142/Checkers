import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { renderWithProviders } from '../../utils/test/renderWithProviders.tsx';
import { unmountComponentAtNode } from 'react-dom';
import { fallbackComponentName, validComponentNamesArray } from './uiProvider/UIProviderUtils.ts';
import { getInvalidComponentRedirectMessage } from './uiProvider/UIProviderUtils.ts';
import UIRoot from './UIRoot.tsx';

/**
 * An array of faulty initial component names for testing purposes
 */
const _FAULTY_INITIAL_COMPONENT_NAMES = [
    "invalidComponentName",
    null,
    "",
    {},
    1,
    true
];

let container = null;
beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
});

afterEach(() => {
    unmountComponentAtNode(container);
    container.remove();
    container = null;
});

// Tests if the UIRoot component renders correctly on mount
describe("UIRoot renders on mount", () => {
    test("UIRoot renders without crashing when the application is initialized", () => {
        try {
            render(
                renderWithProviders(
                    <UIRoot />
                ),
                container
            );
        } catch (error) {
            throw new Error(`UIRoot failed to render on mount: ${error}`);
        }
    });
});

// Tests if the UIRoot component renders the correct initial UI component based on the UIProvider initialComponentHistory prop,
// or the fallback component when no initial component is specified
describe("Renders the (specified) initial UI component if the UIProvider initialComponentHistory prop is set", () => {
    test("Renders the main menu UI component when no initial component is specified", () => {
        const { getByTestId } = render(
            renderWithProviders(
                <UIRoot />
            ),
            container
        );

        // Expect the fallback component to be rendered
        const component = getByTestId(fallbackComponentName);
        expect(component).toBeInTheDocument();
    });
    
    for (const testComponentName of validComponentNamesArray) {
        test(`Renders the '${testComponentName}' component when the UIProvider initialComponentHistory prop is set to ['${testComponentName}']`, async () => {
            const { findByTestId } = render(
                renderWithProviders(
                    <UIRoot />,
                    {
                        UIProvider: {
                            initialComponentHistory: [testComponentName]
                        }
                    }
                ),
                container
            );

            // Expect the specified component to be rendered.
            // We use await here since some components may use suspense for lazy loading
            const component = await findByTestId(testComponentName);
            expect(component).toBeInTheDocument();
        });
    }
});

// Tests if the UIRoot component renders the fallback UI component when the UIProvider initialComponentHistory prop is set to an invalid value
describe("Renders the fallback UI component when the UIProvider initialComponentHistory prop is set to an invalid value", () => {
    for (const testComponentName of _FAULTY_INITIAL_COMPONENT_NAMES) {
        test(`Renders the fallback UI component when the UIProvider initialComponentHistory prop is set to ['${String(testComponentName)}']`, async () => {
            const { findByTestId } = render(
                renderWithProviders(
                    <UIRoot />,
                    {
                        UIProvider: {
                            initialComponentHistory: [testComponentName]
                        }
                    }
                ),
                container
            );

            // Expect the fallback component to be rendered.
            // We use await here since the fallback component may use suspense for lazy loading
            const component = await findByTestId(fallbackComponentName);
            expect(component).toBeInTheDocument();
        });
    }
});

// Tests if the neccessary errors are logged
describe("Error handling", () => {
    // Tests if an error is logged when the UIProvider initialComponentHistory prop is set to an invalid value
    describe("Logs an error when setting the UIProvider initialComponentHistory prop to an invalid value", () => {
        beforeEach(() => {
            jest.spyOn(console, 'error').mockImplementation(() => {});
        });

        afterEach(() => {
            console.error.mockRestore();
        });

        for (const testComponentName of _FAULTY_INITIAL_COMPONENT_NAMES) {
            test(`Console error is logged when the UIProvider initialComponentHistory prop is set to ['${String(testComponentName)}']`, () => {
                render(
                    renderWithProviders(
                        <UIRoot />,
                        {
                            UIProvider: {
                                initialComponentHistory: [testComponentName]
                            }
                        }
                    ),
                    container
                );

                // Expect an error to have been logged when an invalid component name is provided
                const expectedErrorMessage = getInvalidComponentRedirectMessage(testComponentName);
                expect(console.error).toHaveBeenCalledWith(expectedErrorMessage);
            });
        }
    });
});

describe("UI component renders", () => {
    describe("Only a single UI fullscreen component is rendered at a time", () => {
        test("When two UI fullscreen components are in the initialComponentHistory, only the last one is rendered", async () => {
            const { findByTestId, queryByTestId } = render(
                renderWithProviders(
                    <UIRoot />,
                    {
                        UIProvider: {
                            initialComponentHistory: ['mainMenu', 'settings']
                        }
                    }
                ),
                container
            );

            // Expect only the settings component to be rendered
            const settingsComponent = await findByTestId('settings');
            expect(settingsComponent).toBeInTheDocument();

            const mainMenuComponent = queryByTestId('mainMenu');
            expect(mainMenuComponent).not.toBeInTheDocument();
        });
    });

    describe("Only render non-fullscreen UI components when they are after the last fullscreen component in the initialComponentHistory", () => {
        test("When a fullscreen component is followed by non-fullscreen component(s) in the initialComponentHistory, render both the fullscreen and non-fullscreen components", async () => {
            const { findByTestId } = render(
                renderWithProviders(
                    <UIRoot />,
                    {
                        UIProvider: {
                            initialComponentHistory: ['game', 'escapeMenu']
                        }
                    },
                    container
                )
            );

            // Expect both the game and escapeMenu components to be rendered
            const gameComponent = await findByTestId('game');
            expect(gameComponent).toBeInTheDocument();

            const escapeMenuComponent = await findByTestId('escapeMenu');
            expect(escapeMenuComponent).toBeInTheDocument();
        });

        test("When a non-fullscreen component is followed by a fullscreen component in the initialComponentHistory, only render the fullscreen component", async () => {
            const { findByTestId, queryByTestId } = render(
                renderWithProviders(
                    <UIRoot />,
                    {
                        UIProvider: {
                            initialComponentHistory: ['escapeMenu', 'game']
                        }
                    },
                    container
                )
            );

            // Expect only the game component to be rendered
            const gameComponent = await findByTestId('game');
            expect(gameComponent).toBeInTheDocument();

            const escapeMenuComponent = queryByTestId('escapeMenu');
            expect(escapeMenuComponent).not.toBeInTheDocument();
        });
    });
});
