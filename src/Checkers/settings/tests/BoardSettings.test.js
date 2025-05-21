import { createRoot } from 'react-dom/client';
import { act } from '@testing-library/react';
import BoardSettings from '../BoardSettings';
import defaultSettings from '../defaultSettings';

let container = null;
beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
});

let root = null;
afterEach(() => {
    if (root) {
        act(() => {
            root.unmount();
        });
        root = null;
    }
    if (container) {
        container.remove();
        container = null;
    }
});

it("Check if the board size fieldset is being rendered with the options 8, 10 and 12", () => {
    act(() => {
        root = createRoot(container);
        root.render(<BoardSettings
            settings={defaultSettings}
        />);
    });

    // Check if the options: 8, 10 and 12 for the board size are being rendered
    const possibleBoardSizes = [8, 10, 12];
    for (const [i, possibleBoardSize] of possibleBoardSizes.entries()) {
        const boardSizeRadioButton = container.querySelector(`#_optionalBoardSize-${i}`);
        expect(boardSizeRadioButton).toBeTruthy();
        expect(boardSizeRadioButton.value).toBe(possibleBoardSize.toString());
    }
});

it("Check if the board size fieldset inputs are disabled when the gameDataPresent prop is set to true", () => {
    act(() => {
        root = createRoot(container);
        root.render(<BoardSettings
            settings={defaultSettings}
            gameDataPresent={true}
        />);
    });

    // Check if the fieldset inputs for the board size are disabled
    for (let i = 0; i < 3; i++) {
        const boardSizeRadioButton = container.querySelector(`#_optionalBoardSize-${i}`);
        expect(boardSizeRadioButton.disabled).toBe(true);
    }
});

it("Check if the board size fieldset inputs are enabled when the gameDataPresent prop is set to false", () => {
    act(() => {
        root = createRoot(container);
        root.render(<BoardSettings
            settings={defaultSettings}
            gameDataPresent={false}
        />);
    });

    // Check if the fieldset inputs for the board size are enabled
    for (let i = 0; i < 3; i++) {
        const boardSizeRadioButton = container.querySelector(`#_optionalBoardSize-${i}`);
        expect(boardSizeRadioButton.disabled).toBe(false);
    }
});

it("Check if the updateSettingValue prop function is called when the board size is changed", () => {
    // Mock function to simulate that the updateSettingValue function was called
    const updateSettingValue = jest.fn();

    act(() => {
        root = createRoot(container);
        root.render(
            <BoardSettings
                settings={defaultSettings}
                updateSettingValue={updateSettingValue}
            />
        );
    });

    //! This loop only works if the board size which this loops starts with is not the default board size (which is 8)
    //! This is because the fieldset inputs are rendered with the defaultChecked attribute set to the defaultSettings.boardSize.
    //! This means that we can't trigger the already defaultChecked radio button first, since it will not trigger the onChange event
    const possibleBoardSizes = [8, 10, 12];
    for (let i = possibleBoardSizes.length - 1; i >= 0; i--) {
        // Click on the radio button to change the board size
        const optionalBoardSize = container.querySelector(`#_optionalBoardSize-${i}`);
        optionalBoardSize.dispatchEvent(new MouseEvent('click', { bubbles: true }));

        // Check if the updateSettingValue function was called with 'boardSize' which indicates the name of the setting,
        // and the value of the selected radio button, which needs to be a number
        const possibleBoardSize = possibleBoardSizes[i];
        expect(updateSettingValue).toHaveBeenCalledWith('boardSize', possibleBoardSize);
    }
});