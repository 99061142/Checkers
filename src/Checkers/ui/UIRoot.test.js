import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { renderWithProviders } from '../testUtils/renderComponent.tsx';
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

// Tests if the UIRoot component renders the correct initial UI component based on the UIProvider initialComponentName prop,
// or the fallback component when no initial component is specified
describe("Renders the (specified) initial UI component if the UIProvider initialComponentName prop is set", () => {
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
        test(`Renders the '${testComponentName}' component when the UIProvider initialComponentName prop is set to '${testComponentName}'`, async () => {
            const { findByTestId } = render(
                renderWithProviders(
                    <UIRoot />,
                    {
                        UIProvider: {
                            initialComponentName: testComponentName
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

// Tests if the UIRoot component renders the fallback UI component when the UIProvider initialComponentName prop is set to an invalid value
describe("Renders the fallback UI component when the UIProvider initialComponentName prop is set to an invalid value", () => {
    for (const testComponentName of _FAULTY_INITIAL_COMPONENT_NAMES) {
        test(`Renders the fallback UI component when the UIProvider initialComponentName prop is set to '${String(testComponentName)}'`, async () => {
            const { findByTestId } = render(
                renderWithProviders(
                    <UIRoot />,
                    {
                        UIProvider: {
                            initialComponentName: testComponentName
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
    // Tests if an error is logged when the UIProvider initialComponentName prop is set to an invalid value
    describe("Logs an error when setting the UIProvider initialComponentName prop to an invalid value", () => {
        beforeEach(() => {
            jest.spyOn(console, 'error').mockImplementation(() => {});
        });

        afterEach(() => {
            console.error.mockRestore();
        });

        for (const testComponentName of _FAULTY_INITIAL_COMPONENT_NAMES) {
            test(`Console error is logged when the UIProvider initialComponentName prop is set to '${String(testComponentName)}'`, () => {
                render(
                    renderWithProviders(
                        <UIRoot />,
                        {
                            UIProvider: {
                                initialComponentName: testComponentName
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