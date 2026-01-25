import '@testing-library/jest-dom';
import { render, act } from '@testing-library/react';
import { renderWithProviders } from '../../../utils/test/renderWithProviders.tsx';
import { settingsFormNamesArray } from "../settingsForm/SettingsFormUtils.ts";
import SettingsFormNavbar from './SettingsFormNavbar.tsx';
import { capitalizeFirstLetter } from '../../utils/index.ts';

// Test if the SettingsFormNavbar component renders without crashing
describe("SettingsFormNavbar renders on mount", () => {
    test("SettingsFormNavbar renders without crashing when the component is initialized", async () => {
        try {
            await act(async () => {
                render(
                    renderWithProviders(
                        <SettingsFormNavbar />
                    )
                );
            });
        } catch (error) {
            throw new Error(`SettingsFormNavbar failed to render on mount: ${error}`);
        }
    });
});

// Tests for the SettingsFormNavbar navigation links
describe("SettingsFormNavbar navigation links functionality", () => {
    // Tests whether all expected NavLinks are rendered
    describe("Renders all expected NavLinks for each settings category", () => {
        for (const formName of settingsFormNamesArray) {
            test(`Renders NavLink for the '${formName}' settings category`, async () => {
                const capitalizedSettingsFormName = capitalizeFirstLetter(formName);
                
                let getByTestId;
                await act(async () => {
                    const result = render(
                        renderWithProviders(
                            <SettingsFormNavbar />
                        )
                    );
                    getByTestId = result.getByTestId;
                });

                const navLinkElement = getByTestId(`settingsFormLink${capitalizedSettingsFormName}`);
                expect(navLinkElement).toBeInTheDocument();
            });
        }
    });

    // Tests for when the NavLink is enabled
    describe("Enabled NavLink functionality", () => {
        // Tests whether the NavLink for the current settings form is disabled if that form is shown
        describe("Disables the NavLink for the current settings form", () => {
            for (const formName of settingsFormNamesArray) {
                test(`Disables the '${formName}' NavLink when the '${formName}' settings form is shown`, async () => {
                    const capitalizedSettingsFormName = capitalizeFirstLetter(formName);
                    
                    let getByTestId;
                    await act(async () => {
                        const result = render(
                            renderWithProviders(
                                <SettingsFormNavbar 
                                    currentFormName={formName}
                                />
                            )
                        );
                        getByTestId = result.getByTestId;
                    });

                    const activeNavLinkElement = getByTestId(`settingsFormLink${capitalizedSettingsFormName}`);
                    expect(activeNavLinkElement).toBeDisabled();
                });
            }
        });

        describe("Adds 'active' class to the NavLink for the current settings form", () => {
            for (const formName of settingsFormNamesArray) {
                test(`Add 'active' class to the '${formName}' NavLink when the '${formName}' settings form is shown`, async () => {
                    const capitalizedSettingsFormName = capitalizeFirstLetter(formName);

                    let getByTestId;
                    await act(async () => {
                        const result = render(
                            renderWithProviders(
                                <SettingsFormNavbar
                                    currentFormName={formName}
                                />
                            )
                        );
                        getByTestId = result.getByTestId;
                    });
                    const activeNavLinkElement = getByTestId(`settingsFormLink${capitalizedSettingsFormName}`);
                    expect(activeNavLinkElement).toHaveClass('active');
                });
            }
        });
    });

    describe("Disabled NavLink functionality", () => {
        const secondFormName = settingsFormNamesArray[1];

        if (!secondFormName) {
            return;
        }

        const firstFormName = settingsFormNamesArray[0];
        
        test('Removes "active" class from a NavLink when it is not the current shown settings form', async () => {
            const capitalizedSettingsFormName = capitalizeFirstLetter(secondFormName);
            let getByTestId;
            await act(async () => {
                const result = render(
                    renderWithProviders(
                        <SettingsFormNavbar
                            currentFormName={firstFormName}
                        />
                    )
                );
                getByTestId = result.getByTestId;
            });
            const inactiveNavLinkElement = getByTestId(`settingsFormLink${capitalizedSettingsFormName}`);
            expect(inactiveNavLinkElement).not.toHaveClass('active');
        });

        test('Enables a NavLink when it is not the current shown settings form', async () => {
            const capitalizedSettingsFormName = capitalizeFirstLetter(secondFormName);
            let getByTestId;
            await act(async () => {
                const result = render(
                    renderWithProviders(
                        <SettingsFormNavbar
                            currentFormName={firstFormName}
                        />
                    )
                );
                getByTestId = result.getByTestId;
            });
            const inactiveNavLinkElement = getByTestId(`settingsFormLink${capitalizedSettingsFormName}`);
            expect(inactiveNavLinkElement).toBeEnabled();
        });
    });

    describe("Clicking on a NavLink calls the onclick handler with the correct form name", () => {
        const invalidFormName = "invalidFormName";

        for (const formName of settingsFormNamesArray) {
            test(`Clicking the '${formName}' NavLink calls the onclick handler with '${formName}'`, async () => {
                const capitalizedSettingsFormName = capitalizeFirstLetter(formName);
                const mockOnClickHandler = jest.fn();
                let getByTestId;
                await act(async () => {
                    const result = render(
                        renderWithProviders(
                            <SettingsFormNavbar
                                currentFormName={invalidFormName}
                                setCurrentFormName={mockOnClickHandler}
                            />
                        )
                    );
                    getByTestId = result.getByTestId;
                });
                const navLinkElement = getByTestId(`settingsFormLink${capitalizedSettingsFormName}`);

                act(() => {
                    navLinkElement.click();
                });
                expect(mockOnClickHandler).toHaveBeenCalledWith(formName);
            });
        }
    });
});