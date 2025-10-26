import "@testing-library/jest-dom";
import { render, screen, cleanup } from "@testing-library/react";
import { GameStorageProvider } from '../game/gameStorage/gameStorage.tsx';
import { SettingsStorageProvider } from '../settings/settingsStorage/settingsStorage.tsx';
import { validComponentNamesSet, faultyComponentNameErrorMessage } from './Window.tsx';
import Window from './Window.tsx';

const renderComponentWithNecessaryProviders = (component) => {
    return render(
        <GameStorageProvider>
            <SettingsStorageProvider>
                {component}
            </SettingsStorageProvider>
        </GameStorageProvider>
    );
};

describe("Test whether the main menu is rendered on initial load", () => {
    it("Renders main menu on initial load", () => {
        renderComponentWithNecessaryProviders(
            <Window />
        );

        // Expect to find a `data-testid` of "mainMenu" once rendered.
        const mainMenu = screen.getByTestId("mainMenu");
        expect(mainMenu).toBeInTheDocument();
    });
});

describe("Test if all possible component names can be rendered independently", () => {
    // Clean up after each test.
    afterEach(() => {
        cleanup();
    });

    validComponentNamesSet.forEach((componentName) => {
        it(`Renders '${componentName}' component independently`, async () => {
            renderComponentWithNecessaryProviders(
                <Window
                    initialComponentName={componentName}
                />
            );
            
            // Expect to find a `data-testid` matching the component name once rendered.
            // ! We use 'await' here because the components gets rendered within a lazy / Suspense block.
            const component = await screen.findByTestId(componentName);
            expect(component).toBeInTheDocument();
        });
    });
});

describe("Test whether an invalid component name logs an error", () => {
    it("Logs an error for an invalid component name", () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
        
        const invalidComponentName = "invalidComponentName";
        renderComponentWithNecessaryProviders(
            <Window
                initialComponentName={invalidComponentName}
            />
        );

        // Expect an error message to be logged in the console.
        const errorMessage = faultyComponentNameErrorMessage(invalidComponentName);
        expect(consoleSpy).toHaveBeenCalledWith(errorMessage);

        consoleSpy.mockRestore();
    });
});

describe("Test whether the main menu is shown as fallback when trying to load an invalid component", () => {
    it("Shows main menu as fallback when trying to load an invalid component", () => {
        const invalidComponentName = "invalidComponentName";
        
        renderComponentWithNecessaryProviders(
            <Window
                initialComponentName={invalidComponentName}
            />
        );

        // Expect the main menu to be rendered as fallback.
        const mainMenu = screen.getByTestId("mainMenu");
        expect(mainMenu).toBeInTheDocument();
    });
});