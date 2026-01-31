import '@testing-library/jest-dom';
import { act } from '@testing-library/react';
import { renderWithProviders } from '../utils';
import MainMenu from './MainMenu.tsx';
import UIRoot from '../ui/UIRoot.tsx';

/* Test whether the main menu component renders without crashing */
test("Renders without crashing", () => {
    renderWithProviders(
        <MainMenu />
    );
});

describe("Buttons within the main menu", () => {
    describe("The button to start a new game", () => {
        test("Is rendered and visible", async () => {
            const { findByTestId } = renderWithProviders(
                <MainMenu />
            );

            // Expect the button to start a new game to be rendered and visible
            const newGameButton = await findByTestId('newGameButton');
            expect(newGameButton).toBeInTheDocument();
            expect(newGameButton).toBeVisible();
        });

        describe("When clicked", () => {
            test("Navigates to the game page and closes the main menu", async () => {
                const { findByTestId, queryByTestId } = renderWithProviders(
                    <UIRoot />
                );

                // Click the button to start a new game
                const newGameButton = await findByTestId('newGameButton');
                await act(async () => {
                    newGameButton.click();
                });

                // Expect to be navigated to the game component
                const gameComponent = await findByTestId('game');
                expect(gameComponent).toBeInTheDocument();

                // Expect the main menu component to no longer be rendered
                const mainMenuComponent = queryByTestId('mainMenu');
                expect(mainMenuComponent).not.toBeInTheDocument();
            });
        });
    });

    describe("The button to load a saved game", () => {
        test("Is rendered and visible", async () => {
            const { findByTestId } = renderWithProviders(
                <MainMenu />
            );

            // Expect the button to load a saved game to be rendered and visible
            const loadGameButton = await findByTestId('loadGameButton');
            expect(loadGameButton).toBeInTheDocument();
            expect(loadGameButton).toBeVisible();
        });
    });

    describe("The button to delete saved game data", () => {
        test("Is rendered and visible", async () => {
            const { findByTestId } = renderWithProviders(
                <MainMenu />
            );

            // Expect the button to delete the saved game data to be rendered and visible
            const deleteSavedGameDataButton = await findByTestId('deleteSavedGameDataButton');
            expect(deleteSavedGameDataButton).toBeInTheDocument();
            expect(deleteSavedGameDataButton).toBeVisible();
        });
    });

    describe("The button to navigate to the settings page", () => {
        test("Is rendered and visible", async () => {
            const { findByTestId } = renderWithProviders(
                <MainMenu />
            );

            // Expect the button to navigate to the settings page to be rendered and visible
            const settingsButton = await findByTestId('settingsButton');
            expect(settingsButton).toBeInTheDocument();
            expect(settingsButton).toBeVisible();
        });

        describe("When clicked", () => {
            test("Navigates to the settings page and closes the main menu", async () => {
                const { findByTestId, queryByTestId } = renderWithProviders(
                    <UIRoot />
                );

                // Click the button to navigate to the settings page
                const settingsButton = await findByTestId('settingsButton');
                await act(async () => {
                    settingsButton.click();
                });

                // Expect to be navigated to the settings component
                const settingsComponent = await findByTestId('settings');
                expect(settingsComponent).toBeInTheDocument();

                // Expect the main menu component to no longer be rendered
                const mainMenuComponent = queryByTestId('mainMenu');
                expect(mainMenuComponent).not.toBeInTheDocument();
            });
        });
    });
});

