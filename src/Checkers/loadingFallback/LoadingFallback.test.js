import '@testing-library/jest-dom';
import { render, act } from '@testing-library/react';
import { renderWithProviders } from '../../utils/test/renderWithProviders.tsx';
import LoadingFallback from './LoadingFallback.tsx';

// Tests if the LoadingFallback component renders correctly on mount
describe("LoadingFallback renders on mount", () => {
    test("LoadingFallback renders without crashing when the application is initialized", async () => {
        try {
            await act(async () => {
                render(
                    renderWithProviders(
                        <LoadingFallback />
                    )
                );
            });
        } catch (error) {
            throw new Error(`LoadingFallback failed to render on mount: ${error}`);
        }
    });
});