import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import Board from "../Board";

let container = null;
beforeEach(() => {
    // Setup a DOM element as a render target
    container = document.createElement('div');
    document.body.appendChild(container);
});

afterEach(() => {
    // Cleanup on exiting
    unmountComponentAtNode(container);
    container.remove();
    container = null;
});

function expectedStonesAmount(boardSize) {
    const usedRows = boardSize - 2;
    const usedColsPerRow = boardSize / 2;
    const expectedStonesAmount = usedRows * usedColsPerRow;
    return expectedStonesAmount
}

it("Render the board based on the given size prop", () => {
    //! This size must always be even
    const boardSize = 8;

    // Render the board
    act(() => {
        render(
            <Board
                settings={{
                    "boardSize": {
                        "value": boardSize
                    }
                }}
            />,
            container
        );
    });

    // Check if the board gets rendered correctly based on the given size prop
    const stonesAmount = document.getElementById("board").children.length;
    expect(stonesAmount).toBe(expectedStonesAmount(boardSize));
});