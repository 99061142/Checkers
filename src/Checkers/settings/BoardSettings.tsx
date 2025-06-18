import { Component } from 'react';
import { Form, FormCheck } from 'react-bootstrap';
import { getBoardSize, setBoardSize, BoardSize, BOARD_SIZES } from './settingsData.ts';

/**
 * Props for the BoardSettings component.
 * - gameDataPresent: A boolean value indicating whether the game data is present in the local storage.
 */
interface BoardSettingsProps {
    gameDataPresent: boolean;
}

/**
 * State for the BoardSettings component.
 * - boardSize: The size of the board.
 */
interface BoardSettingsState {
    boardSize: BoardSize;
}

class BoardSettings extends Component<BoardSettingsProps, BoardSettingsState> {
    // The initial board size which is retrieved from the local storage
    initialBoardSize = getBoardSize();
    
    constructor(props: BoardSettingsProps) {
        super(props);
        this.state = {
            boardSize: this.initialBoardSize
        };
    }

    componentDidMount() {
        window.addEventListener('beforeunload', this.beforeUnloadHandler);
    }

    componentWillUnmount() {
        window.removeEventListener('beforeunload', this.beforeUnloadHandler);

        // Save the board form settings to the local storage before the component is unmounted
        this.saveBoardSettings();
    }

    /**
     * Handles the change event for the board size radio buttons.
     * @param {React.ChangeEvent<HTMLInputElement>} ev - The change event triggered by the board size radio buttons.
     * @returns {void}
     */
    boardSizeChanged = (ev: React.ChangeEvent<HTMLInputElement>): void => {
        const boardSize = Number(ev.target.value) as BoardSize;
        this.setState({ 
            boardSize 
        });
    }
    
    /**
     * Handles the beforeunload event when the user exits the form
     * @returns {void}
     */
    beforeUnloadHandler = (): void => {
        // Save the board form settings to the local storage before the component is unmounted
        this.saveBoardSettings();
    }

    /**
     * Saves the board form settings to the local storage before the component is unmounted
     * @returns {void}
     */
    saveBoardSettings(): void {
        // If the board size have been changed, save it to the local storage
        if (this.state.boardSize !== this.initialBoardSize) {
            setBoardSize(this.state.boardSize);
        }
    }

    render() {
        return (
                <Form
                    data-testid="boardSettings"
                >
                    <fieldset>
                        <legend>
                            Board size
                        </legend>
                        {BOARD_SIZES
                            .map((optionalBoardSize, key) =>
                                <FormCheck
                                    onChange={this.boardSizeChanged}
                                    checked={this.state.boardSize === optionalBoardSize}
                                    type="radio"
                                    id={"_optionalBoardSize-" + key}
                                    name="boardSize"
                                    disabled={this.props.gameDataPresent}
                                    value={optionalBoardSize}
                                    label={optionalBoardSize + "X" + optionalBoardSize}
                                    key={key}
                                />
                            )
                        }
                    </fieldset>
            </Form>
        )
    }
}

export default BoardSettings;