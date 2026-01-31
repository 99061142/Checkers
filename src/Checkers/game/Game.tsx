import { FC } from "react";
import NavigationMenu from "./navigationMenu/NavigationMenu.tsx";

/**
 * Props for the Game component.
 */
export interface GameProps {}

const Game: FC<GameProps> = () => {
    return (
        <>
            <NavigationMenu />
            <main
                data-testid='game'
            >
            </main>
        </>
    );
}

export default Game;