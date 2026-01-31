import '@testing-library/jest-dom';
import { act } from '@testing-library/react';
import { renderWithProviders } from '../utils';
import EscapeMenu from './EscapeMenu.tsx';
import UIRoot from '../ui/UIRoot.tsx';
import { noPreviousComponentToGoBackToMessage } from '../ui/uiProvider/UIProviderUtils.ts';

/* Test whether the escape menu component renders without crashing */
test("Renders without crashing", () => {
    renderWithProviders(
        <EscapeMenu />
    );
});

describe("Buttons within the escape menu", () => {
    describe("The button to resume the game", () => {
        test("Is visible", async () => {
            const { findByTestId } = renderWithProviders(
                <EscapeMenu />
            );
            
            // Expect the button to resume the game to be in the document
            const resumeGameButton = await findByTestId('resumeGameButton');
            expect(resumeGameButton).toBeInTheDocument();
        });

        describe("Click functionality", () => {
            describe("With previous component in history", () => {
                test("Navigates to the previous component in history and hides the escape menu", async () => {
                    const { findByTestId, queryByTestId } = renderWithProviders(
                        <UIRoot />,
                        {
                            UIProvider: {
                                initialComponentHistory: ['game', 'escapeMenu']
                            }
                        }
                    );

                    // Click the resume game button
                    const resumeGameButton = await findByTestId('resumeGameButton');
                    await act(async () => {
                        resumeGameButton.click();
                    });

                    // Expect the game component to be rendered
                    const gameComponent = await findByTestId('game');
                    expect(gameComponent).toBeInTheDocument();

                    // Expect the escape menu component to not be rendered
                    const escapeMenuComponent = queryByTestId('escapeMenu');
                    expect(escapeMenuComponent).not.toBeInTheDocument();
                });
            });

            describe("Without previous component in history", () => {
                test("Keeps the escape menu visible", async () => {
                    const { findByTestId } = renderWithProviders(
                        <UIRoot />,
                        {
                            UIProvider: {
                                initialComponentHistory: ['escapeMenu']
                            }
                        }
                    );

                    // Expect the escape menu component to still be rendered
                    const escapeMenuComponent = await findByTestId('escapeMenu');
                    expect(escapeMenuComponent).toBeInTheDocument();
                });
                
                test("Logs error to console", async () => {
                    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
                    
                    const { findByTestId } = renderWithProviders(
                        <UIRoot />,
                        {
                            UIProvider: {
                                initialComponentHistory: ['escapeMenu']
                            }
                        }
                    );

                    // Click the resume game button
                    const resumeGameButton = await findByTestId('resumeGameButton');
                    await act(async () => {
                        resumeGameButton.click();
                    });

                    // Expect an error to be logged to the console
                    expect(consoleErrorSpy).toHaveBeenCalledWith(noPreviousComponentToGoBackToMessage);
                    
                    consoleErrorSpy.mockRestore();
                });
            });
        });
    });

    describe("Button to navigate to the settings page", () => {
        test("Is visible", async () => {
            const { findByTestId } = renderWithProviders(
                <EscapeMenu />
            );
            
            // Expect the button to navigate to the settings page to be in the document
            const settingsButton = await findByTestId('settingsButton');
            expect(settingsButton).toBeInTheDocument();
        });

        describe("Click functionality", () => {
            test("Navigates to the settings page and hides the escape menu", async () => {
                const { findByTestId, queryByTestId } = renderWithProviders(
                    <UIRoot />,
                    {
                        UIProvider: {
                            initialComponentHistory: ['escapeMenu']
                        }
                    }
                );

                // Click the button to navigate to the settings page
                const settingsButton = await findByTestId('settingsButton');
                await act(async () => {
                    settingsButton.click();
                });

                // Expect the settings component to be rendered
                const settingsComponent = await findByTestId('settings');
                expect(settingsComponent).toBeInTheDocument();

                // Expect the escape menu component to not be rendered
                expect(queryByTestId('escapeMenu')).not.toBeInTheDocument();
            });
        });
    });

    describe("Button to navigate to the main menu", () => {
        test("Is visible", async () => {
            const { findByTestId } = renderWithProviders(
                <EscapeMenu />
            );

            // Expect the button to navigate to the main menu to be rendered
            const mainMenuButton = await findByTestId('mainMenuButton');
            expect(mainMenuButton).toBeInTheDocument();
        });

        describe("Click functionality", () => {
            test("Navigates to the main menu and hides the escape menu", async () => {
                const { findByTestId, queryByTestId } = renderWithProviders(
                    <UIRoot />,
                    {
                        UIProvider: {
                            initialComponentHistory: ['escapeMenu']
                        }
                    }
                );

                // Click the button to navigate to the main menu
                const mainMenuButton = await findByTestId('mainMenuButton');
                await act(async () => {
                    mainMenuButton.click();
                });

                // Expect the main menu component to be rendered
                const mainMenuComponent = await findByTestId('mainMenu');
                expect(mainMenuComponent).toBeInTheDocument();

                // Expect the escape menu component to not be rendered
                const escapeMenuComponent = queryByTestId('escapeMenu');
                expect(escapeMenuComponent).not.toBeInTheDocument();
            });
        });
    });
});

describe("Keyboard handling for the escape menu", () => {
    describe("Pressing the Escape key", () => {
        describe("With previous component in history", () => {
            test("Navigates back to the previous component and hides the escape menu", async () => {
                const { getByTestId, queryByTestId } = renderWithProviders(
                    <UIRoot />,
                    {
                        UIProvider: {
                            initialComponentHistory: ['game', 'escapeMenu']
                        }
                    }
                );

                // Press the Escape key on the keyboard
                act(() => {
                    const escapeKeyEvent = new KeyboardEvent('keydown', { key: 'Escape' });
                    window.dispatchEvent(escapeKeyEvent);
                });

                // Expect the game component to be rendered
                const gameComponent = getByTestId('game');
                expect(gameComponent).toBeInTheDocument();

                // Expect the escape menu component to not be rendered
                const escapeMenuComponent = queryByTestId('escapeMenu');
                expect(escapeMenuComponent).not.toBeInTheDocument();
            });
        });

        describe("Without previous component in history", () => {
            test("Keeps the escape menu visible", async () => {
                const { getByTestId } = renderWithProviders(
                    <UIRoot />,
                    {
                        UIProvider: {
                            initialComponentHistory: ['escapeMenu']
                        }
                    }
                );

                // Press the Escape key on the keyboard
                act(() => {
                    const escapeKeyEvent = new KeyboardEvent('keydown', { key: 'Escape' });
                    window.dispatchEvent(escapeKeyEvent);
                });

                // Expect the escape menu component to still be rendered
                const escapeMenuComponent = getByTestId('escapeMenu');
                expect(escapeMenuComponent).toBeInTheDocument();
            });

            test("Logs error to console", async () => {
                const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
                
                renderWithProviders(
                    <UIRoot />,
                    {
                        UIProvider: {
                            initialComponentHistory: ['escapeMenu']
                        }
                    }
                );

                // Press the Escape key on the keyboard
                act(() => {
                    const escapeKeyEvent = new KeyboardEvent('keydown', { key: 'Escape' });
                    window.dispatchEvent(escapeKeyEvent);
                });

                // Expect an error to be logged to the console
                expect(consoleErrorSpy).toHaveBeenCalledWith(noPreviousComponentToGoBackToMessage);
                
                consoleErrorSpy.mockRestore();
            });
        });
    });
});