import { ReactNode } from "react";

// Necessary providers
import { GameProvider } from "../../Checkers/game/gameProvider/GameProvider";
import { SettingsProvider } from "../../Checkers/settings/settingsProvider/SettingsProvider";
import { UIProvider } from "../../Checkers/ui/uiProvider/UIProvider";

/**
 * Type representing the props for the providers which would always encapsulate the rendered component.
 */
interface ProviderProps {
    SettingsProvider?: Record<string, unknown>;
    UIProvider?: Record<string, unknown>;
    GameProvider?: Record<string, unknown>;
}

/**
 * Helper function which renders the given component with the given props wrapped in the necessary providers.
 * @param {ReactNode} Component The component to render.
 * @param {ProviderProps} providerProps The props to be passed to the provider components.
 * @returns {ReactNode} The rendered component wrapped with providers.
 */
export function renderWithProviders(
    Component: ReactNode, 
    providerProps: ProviderProps = {}
): ReactNode {
    return (
        <GameProvider
            {...providerProps.GameProvider}
        >
            <SettingsProvider
                {...providerProps.SettingsProvider}
            >
                <UIProvider
                    {...providerProps.UIProvider}
                >
                    {Component}
                </UIProvider>
            </SettingsProvider>
        </GameProvider>
    );
}