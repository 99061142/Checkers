import '@testing-library/jest-dom';
import { renderWithProviders } from '../utils';
import LoadingFallback from './LoadingFallback.tsx';

/* Test whether the loading fallback component renders without crashing */
test("Renders without crashing", () => {
    renderWithProviders(
        <LoadingFallback />
    );
});