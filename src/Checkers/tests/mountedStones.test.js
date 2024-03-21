import { createRef } from "react";
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


function stonesAmountBasedOnBoardSize(size) {
    // Return the amount of stones on the board based on the board size
    let stonesAmount = 0;
    const midRow = size / 2;
    for(let row = 0; row < size; row++) {
        if (
            row === midRow ||
            row === midRow - 1
        )
            continue

        for(let col = 0; col < size; col++) {
            if (
                (
                    row % 2 === 0 &&
                    col % 2 !== 0
                ) ||
                (
                    row % 2 !== 0 &&
                    col % 2 === 0
                )
            )
                stonesAmount++;
        }
    }
    return stonesAmount
}

it("Check if the amount of stones on the board correctly adjusts based on the board size", () => {
    // Every board size that gets checked
    const boardSizes = [
        8,
        10,
        12
    ];

    // Create the board
    const boardRef = createRef(null);
    act(() => {
        render(
            <Board
                ref={boardRef}
                size={boardSizes[0]}
            />,
            container
        );
    });

    for (let i = 0; i < boardSizes.length - 1; i++) {
        // Check if the amount of stones on the board correctly adjusts based on the board size
        const expectedStonesAmount = stonesAmountBasedOnBoardSize(boardSizes[i]);
        const stonesAmount = Object.keys(boardRef.current.stones).length;
        expect(stonesAmount).toBe(expectedStonesAmount);

        // Adjust to the next board size
        boardRef.current.size = boardSizes[i+1];
    }
});