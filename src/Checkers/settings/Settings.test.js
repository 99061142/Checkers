import '@testing-library/jest-dom';
import { render, act, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../../utils/test/renderWithProviders.tsx';
import Settings from './Settings.tsx';
import UIRoot from '../ui/UIRoot.tsx';

// Tests if the Settings component renders correctly on mount
describe("Settings renders on mount", () => {
    test("Settings renders without crashing when the application is initialized", async () => {
        try {
            await act(async () => {
                render(
                    renderWithProviders(
                        <Settings />
                    )
                );
            });
        } catch (error) {
            throw new Error(`Settings failed to render on mount: ${error}`);
        }
    });
});

describe("All component elements are present when Settings is rendered", () => {
    test("Settings contains the SettingsNavbar component", async () => {
        let getByTestId;
        await act(async () => {
            const result = render(
                renderWithProviders(
                    <Settings />
                )
            );
            getByTestId = result.getByTestId;
        });

        // Expect the SettingsNavbar component to be rendered
        expect(getByTestId("settingsNavbar")).toBeInTheDocument();
    });

    test("Settings contains the SettingsFormNavbar component", async () => {
        let getByTestId;
        await act(async () => {
            const result = render(
                renderWithProviders(
                    <Settings />
                )
            );
            getByTestId = result.getByTestId;
        });

        // Expect the SettingsFormNavbar component to be rendered
        expect(getByTestId("settingsFormNavbar")).toBeInTheDocument();
    });

    test("Settings contains the SettingsForm component", async () => {
        let getByTestId;
        await act(async () => {
            const result = render(
                renderWithProviders(
                    <Settings />
                )
            );
            getByTestId = result.getByTestId;
        });

        // Expect the SettingsForm component to be rendered
        expect(getByTestId(/SettingsForm/)).toBeInTheDocument();
    });
});

describe("Keydown event listeners functionality", () => {
    describe("The event listener for keydown events is added on mount and removed on unmount", () => {
        test("The keydown event listener is added on mount", async () => {
            const addEventListenerSpy = jest.spyOn(window, 'addEventListener');

            await act(async () => {
                render(
                    renderWithProviders(
                        <Settings />
                    )
                );
            });

            expect(addEventListenerSpy).toHaveBeenCalledWith("keydown", expect.any(Function));

            addEventListenerSpy.mockRestore();
        });

        test("The keydown event listener is removed on unmount", async () => {
            const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

            let unmount;
            await act(async () => {
                const result = render(
                    renderWithProviders(
                        <Settings />
                    )
                );
                unmount = result.unmount;
            });
            unmount();

            expect(removeEventListenerSpy).toHaveBeenCalledWith("keydown", expect.any(Function));
            removeEventListenerSpy.mockRestore();
        });
    });

    describe("The keydown event listener correctly handles specific key presses", () => {
        test("Pressing the 'Escape' key closes the Settings component", async () => {
            let queryByTestId;
            await act(async () => {
                const result = render(
                    renderWithProviders(
                        <UIRoot />,
                        {
                            UIProvider: {
                                initialComponentHistory: ['mainMenu', 'settings']
                            },
                        }
                    )
                );
                queryByTestId = result.queryByTestId;
            });

            // Wait for Settings to be rendered
            await waitFor(() => {
                expect(queryByTestId("settings")).toBeInTheDocument();
            });

            // Simulate pressing the 'Escape' key
            act(() => {
                const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
                window.dispatchEvent(escapeEvent);
            });

            // Expect the Settings component to not be rendered anymore
            await waitFor(() => {
                expect(queryByTestId("settings")).toBeNull();
            });
        });
    });
});