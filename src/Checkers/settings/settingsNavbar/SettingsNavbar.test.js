import '@testing-library/jest-dom';
import { render, act, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../../utils';
import SettingsNavbar from './SettingsNavbar.tsx';
import Settings from '../Settings.tsx';
import { noPreviousComponentToGoBackToMessage } from '../../ui/uiProvider/UIProviderUtils.ts';
import UIRoot from '../../ui/UIRoot.tsx';

// Tests if the SettingsNavbar component renders without crashing
describe("SettingsNavbar renders on mount", () => {
    // Test whether the SettingsNavbar renders without crashing
    test("SettingsNavbar renders without crashing when the component is initialized", async () => {
        try {
            await act(async () => {
                render(
                    renderWithProviders(
                        <SettingsNavbar />
                    )
                );
            });
        } catch (error) {
            throw new Error(`SettingsNavbar failed to render on mount: ${error}`);
        }
    });
});

// Tests for the essential elements in the SettingsNavbar
describe("SettingsNavbar contains essential elements", () => {
    // Test whether the brand element is present in the SettingsNavbar
    test("SettingsNavbar contains the brand element", async () => {
        let getByTestId;
        await act(async () => {
            const result = render(
                renderWithProviders(
                    <SettingsNavbar />
                )
            );
            getByTestId = result.getByTestId;
        });

        const brandElement = getByTestId("settingsNavbarBrand");;
        expect(brandElement).toBeInTheDocument();
    });

    // Test whether the exit button is present in the SettingsNavbar
    test("SettingsNavbar contains the exit button", async () => {
        let getByTestId;
        await act(async () => {
            const result = render(
                renderWithProviders(
                    <SettingsNavbar />
                )
            );
            getByTestId = result.getByTestId;
        });

        const exitButtonElement = getByTestId("settingsNavbarExitButton");
        expect(exitButtonElement).toBeInTheDocument();
    });
});

// Tests for the functionality of the exit button in the SettingsNavbar
describe("SettingsNavbar exit button functionality", () => {
    // Test whether clicking the exit button calls the exitSettings function
    test("Clicking the exit button calls the exitSettings function", async () => {
        const mockExitSettings = jest.fn();
        let getByTestId;
        await act(async () => {
            const result = render(
                renderWithProviders(
                    <SettingsNavbar 
                        exitSettings={mockExitSettings} 
                    />
                )
            );
            getByTestId = result.getByTestId;
        });
        const exitButtonElement = getByTestId("settingsNavbarExitButton");

        act(() => {
            exitButtonElement.click();
        });
        expect(mockExitSettings).toHaveBeenCalledTimes(1);
    });

    // Test whether clicking the exit button when there is no previous UI component logs an error
    test("Logs an console error if we click the exit button when there is no previously UI component to return to", async () => {
        console.error = jest.fn();

        let getByTestId;
        await act(async () => {
            const result = render(
                renderWithProviders(
                    <Settings />
                )
            );
            getByTestId = result.getByTestId;
        });
        const exitButtonElement = getByTestId("settingsNavbarExitButton");
        act(() => {
            exitButtonElement.click();
        });

        expect(console.error).toHaveBeenCalledWith(noPreviousComponentToGoBackToMessage);
    });

    // Test whether clicking the exit button goes back to the previous UI component
    test("Goes back to the previous UI component when the exit button is clicked", async () => {
        let getByTestId, queryByTestId;
        await act(async () => {
            const result = render(
                renderWithProviders(
                    <UIRoot />, 
                    { 
                        UIProvider: { 
                            initialComponentHistory: ['mainMenu', 'settings'] 
                        } 
                    }
                )
            );
            getByTestId = result.getByTestId;
            queryByTestId = result.queryByTestId;
        });

        // Wait for the Settings component to be rendered
        await waitFor(() => {
            expect(queryByTestId("settings")).toBeInTheDocument();
        });

        // Click the exit button to go back to the MainMenu component
        const exitButtonElement = getByTestId("settingsNavbarExitButton");
        act(() => {
            exitButtonElement.click();
        });

        // Expect the MainMenu component to be rendered
        await waitFor(() => {
            expect(queryByTestId("mainMenu")).toBeInTheDocument();
        });
    });
});