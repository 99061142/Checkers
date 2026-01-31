import '@testing-library/jest-dom';
import { act } from '@testing-library/react';
import { renderWithProviders } from '../../utils';
import NavigationMenu from './NavigationMenu.tsx';
import UIRoot from '../../ui/UIRoot.tsx';

/* Test whether the navigation menu component renders without crashing */
test("Renders without crashing", () => {
    renderWithProviders(
        <NavigationMenu />
    );
});

describe("Buttons within the game navigation menu", () => {
    describe("The button to open the escape menu", () => {
        test("Is rendered and visible", () => {
            const { getByTestId } = renderWithProviders(
                <NavigationMenu />
            );

            // Expect the escape menu button to be rendered and visible
            const escapeMenuButton = getByTestId("openEscapeMenuButton");;
            expect(escapeMenuButton).toBeInTheDocument();
            expect(escapeMenuButton).toBeVisible();
        });

        describe("When clicked", () => {
            test("The escape menu is displayed", async () => {
                const { findByTestId } = renderWithProviders(
                    <UIRoot />,
                    {
                        UIProvider: {
                            initialComponentHistory: ['game']
                        }
                    }
                );

                // Click the escape menu button
                const escapeMenuButton = await findByTestId("openEscapeMenuButton");
                await act(async () => {
                    escapeMenuButton.click();
                });

                // Expect the escape menu to be displayed
                const escapeMenu = await findByTestId("escapeMenu");
                expect(escapeMenu).toBeInTheDocument();
                expect(escapeMenu).toBeVisible();
            });
        });
    });
});
