import { FC, ReactNode } from "react";

// Neccessary Providers
import { GameProvider } from "../game/gameProvider/GameProvider.tsx";
import { SettingsProvider } from "../settings/settingsProvider/SettingsProvider.tsx";
import { UIProvider } from "../ui/uiProvider/UIProvider.tsx";

/**
 * Props for each individual provider.
 */
export interface ProviderProps {
    SettingsProvider?: Record<string, unknown>;
    UIProvider?: Record<string, unknown>;
    GameProvider?: Record<string, unknown>;
}

/**
 * Props for the Providers component.
 * - children: The child component(s) to be wrapped by the providers.
 * - providersProps: Optional props to be passed to each provider.
 */
interface ProvidersComponentProps {
    children: ReactNode;
    providersProps?: ProviderProps;
}

/**
 * Wrapper component that provides all necessary context providers for the application.
 * @param {ReactNode} children - The child components to wrap.
 * @param {ProviderProps} props.providersProps - Optional props to pass to individual providers.
 * @returns {ReactNode} The wrapped child components.
 */
const Providers: FC<ProvidersComponentProps> = ({ 
    children,
    providersProps
}: ProvidersComponentProps) => {
    return (
        <GameProvider 
            {...providersProps?.GameProvider}
        >
            <SettingsProvider 
                {...providersProps?.SettingsProvider}
            >
                <UIProvider 
                    {...providersProps?.UIProvider}
                >
                    {children}
                </UIProvider>
            </SettingsProvider>
        </GameProvider>
    );
};

export default Providers;
