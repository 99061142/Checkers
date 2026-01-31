import { ReactNode } from "react";
import { render, RenderResult } from "@testing-library/react";
import Providers, { ProviderProps } from "../../providers/Providers";

/**
 * Helper function which renders the given component wrapped in the necessary providers.
 * @param {ReactNode} children The children which would be enclosed by the providers.
 * @param {ProviderProps} providerProps The props to be passed to the provider components.
 * @returns {RenderResult} The render result.
 */
export function renderWithProviders(
    children: ReactNode, 
    providerProps?: ProviderProps
): RenderResult {
    return render(
        <Providers 
            providersProps={providerProps}
        >
            {children}
        </Providers>
    );
}