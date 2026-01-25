import '@testing-library/jest-dom';
import { render, act } from '@testing-library/react';
import { renderWithProviders } from '../../utils/test/renderWithProviders.tsx';
import EscapeMenu from './EscapeMenu.tsx';
import UIRoot from '../ui/UIRoot.tsx';
import { noPreviousComponentToGoBackToMessage } from '../ui/uiProvider/UIProviderUtils.ts';

// Tests if the EscapeMenu component renders correctly on mount
describe("EscapeMenu", () => {
    test("renders without crashing", async () => {
        try {
            await act(async () => {
                render(
                    renderWithProviders(
                        <EscapeMenu />
                    )
                );
            });
        } catch (error) {
            throw new Error(`EscapeMenu failed to render on mount: ${error}`);
        }
    });
});

// Tests if the EscapeMenu has every necessary button and their functionality
describe("EscapeMenu buttons", () => {
    describe("Resume Game button", () => {
        test("is visible", async () => {
            let findByTestId;
            await act(async () => {
                const result = render(
                    renderWithProviders(
                        <EscapeMenu />
                    )
                );
                findByTestId = result.findByTestId;
            });

            // Expect the Resume game button to be in the document
            const resumeButton = await findByTestId('resumeGameButton');
            expect(resumeButton).toBeInTheDocument();
        });
    });

    describe("Resume Game button when clicked", () => {
        describe("with previous component in history", () => {
            test("navigates back and hides EscapeMenu", async () => {
                let findByTestId, queryByTestId;
                await act(async () => {
                    const result = render(
                        renderWithProviders(
                            <UIRoot />,
                            {
                                UIProvider: {
                                    initialComponentHistory: ['game', 'escapeMenu']
                                }
                            }
                        )
                    );
                    findByTestId = result.findByTestId;
                    queryByTestId = result.queryByTestId;
                });

                // Click the resume game button
                const resumeButton = await findByTestId('resumeGameButton');
                await act(async () => {
                    resumeButton.click();
                });

                // Expect only the game component to be rendered
                const gameComponent = await findByTestId('game');
                expect(gameComponent).toBeInTheDocument();

                // Expect the escapeMenu component to not be rendered
                const escapeMenuComponent = queryByTestId('escapeMenu');
                expect(escapeMenuComponent).not.toBeInTheDocument();
            });
        });
    });

    describe("Resume Game button when clicked without previous component in history", () => {
        test("keeps EscapeMenu visible", async () => {
            let findByTestId;
            await act(async () => {
                const result = render(
                    renderWithProviders(
                        <UIRoot />,
                        {
                            UIProvider: {
                                initialComponentHistory: ['escapeMenu']
                            }
                        }
                    )
                );
                findByTestId = result.findByTestId;
            });

            // Expect the escapeMenu component to still be rendered
            const escapeMenuComponent = await findByTestId('escapeMenu');
            expect(escapeMenuComponent).toBeInTheDocument();
        });

        test("logs error to console", async () => {
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
            let findByTestId;
            await act(async () => {
                const result = render(
                    renderWithProviders(
                        <UIRoot />,
                        {
                            UIProvider: {
                                initialComponentHistory: ['escapeMenu']
                            }
                        }
                    )
                );
                findByTestId = result.findByTestId;
            });

            // Click the resume game button
            const resumeButton = await findByTestId('resumeGameButton');
            await act(async () => {
                resumeButton.click();
            });

            // Expect an error to be logged to the console
            expect(consoleErrorSpy).toHaveBeenCalledWith(noPreviousComponentToGoBackToMessage);
            consoleErrorSpy.mockRestore();
        });
    });

    describe("Settings button", () => {
        test("is visible", async () => {
            let findByTestId;
            await act(async () => {
                const result = render(
                    renderWithProviders(
                        <EscapeMenu />
                    )
                );
                findByTestId = result.findByTestId;
            });

            // Expect the Settings button to be in the document
            const settingsButton = await findByTestId('settingsButton');
            expect(settingsButton).toBeInTheDocument();
        });
    });

    describe("Settings button when clicked", () => {
        test("navigates to Settings and hides EscapeMenu", async () => {
            let findByTestId, queryByTestId;
            await act(async () => {
                const result = render(
                    renderWithProviders(
                        <UIRoot />,
                        {
                            UIProvider: {
                                initialComponentHistory: ['escapeMenu']
                            }
                        }
                    )
                );
                findByTestId = result.findByTestId;
                queryByTestId = result.queryByTestId;
            });

            // Click the Settings button
            const settingsButton = await findByTestId('settingsButton');
            await act(async () => {
                settingsButton.click();
            });

            // Expect the Settings UI component to be rendered
            const settingsComponent = await findByTestId('settings');
            expect(settingsComponent).toBeInTheDocument();

            // Expect the EscapeMenu component to not be rendered
            expect(queryByTestId('escapeMenu')).not.toBeInTheDocument();
        });
    });

    describe("Main Menu button", () => {
        test("is visible", async () => {
            let findByTestId;
            await act(async () => {
                const result = render(
                    renderWithProviders(
                        <EscapeMenu />
                    )
                );
                findByTestId = result.findByTestId;
            });

            // Expect the Main Menu button to be in the document
            const mainMenuButton = await findByTestId('mainMenuButton');
            expect(mainMenuButton).toBeInTheDocument();
        });
    });

    describe("Main Menu button when clicked", () => {
        test("navigates to Main Menu and hides EscapeMenu", async () => {
            let findByTestId, queryByTestId;
            await act(async () => {
                const result = render(
                    renderWithProviders(
                        <UIRoot />,
                        {
                            UIProvider: {
                                initialComponentHistory: ['escapeMenu']
                            }
                        }
                    )
                );
                findByTestId = result.findByTestId;
                queryByTestId = result.queryByTestId;
            });

            // Click the Main Menu button
            const mainMenuButton = await findByTestId('mainMenuButton');
            await act(async () => {
                mainMenuButton.click();
            });

            // Expect the Main Menu UI component to be rendered
            const mainMenuComponent = await findByTestId('mainMenu');
            expect(mainMenuComponent).toBeInTheDocument();

            // Expect the EscapeMenu component to not be rendered
            expect(queryByTestId('escapeMenu')).not.toBeInTheDocument();
        });
    });
});

describe("EscapeMenu keyboard handling", () => {
    test("Escape key navigates back when previous component exists", async () => {
        let getByTestId, queryByTestId;
        await act(async () => {
            const result = render(
                renderWithProviders(
                    <UIRoot />,
                    {
                        UIProvider: {
                            initialComponentHistory: ['game', 'escapeMenu']
                        }
                    }
                )
            );
            getByTestId = result.getByTestId;
            queryByTestId = result.queryByTestId;
        });

        // Simulate pressing the Escape key
        act(() => {
            const escapeKeyEvent = new KeyboardEvent('keydown', { key: 'Escape' });
            window.dispatchEvent(escapeKeyEvent);
        });

        // Expect only the game component to be rendered
        const gameComponent = getByTestId('game');
        expect(gameComponent).toBeInTheDocument();

        // Expect the escapeMenu component to not be rendered
        const escapeMenuComponent = queryByTestId('escapeMenu');
        expect(escapeMenuComponent).not.toBeInTheDocument();
    });

    test("Escape key logs error when no previous component exists", async () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        let getByTestId;
        await act(async () => {
            const result = render(
                renderWithProviders(
                    <UIRoot />,
                    {
                        UIProvider: {
                            initialComponentHistory: ['escapeMenu']
                        }
                    }
                )
            );
            getByTestId = result.getByTestId;
        });

        // Simulate pressing the Escape key
        act(() => {
            const escapeKeyEvent = new KeyboardEvent('keydown', { key: 'Escape' });
            window.dispatchEvent(escapeKeyEvent);
        });

        // Expect an error to be logged to the console
        expect(consoleErrorSpy).toHaveBeenCalledWith(noPreviousComponentToGoBackToMessage);
        consoleErrorSpy.mockRestore();
    });
});