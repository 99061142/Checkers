function getGameData() {
    // If there is no game data present, return an empty object
    const gameData = JSON.parse(localStorage.getItem('gameData'));
    if (gameData === null) {
        return Object.create(null)
    }
    // If there is game data present, return the game data
    return gameData
}

function setGameData(data) {
    // Set the game data in the local storage
    localStorage.setItem('gameData', JSON.stringify(data));
}

export function getLastPlayer() {
    // If the last player is not set, throw an error
    const gameData = getGameData();
    const lastPlayer = gameData.lastPlayer;
    if (lastPlayer === undefined) {
        throw new Error("Error: The last player is not set. This usually happens when the game is finished and the saved data is deleted, or when the player which turn it was wasn't saved before the game was closed.");
    }
    // If the last player is set, return the last player
    return lastPlayer
}

export function setLastPlayer(player) {
    // Set the player whos turn it was beofre the game was paused/exited in the local storage
    const gameData = getGameData();
    gameData.lastPlayer = player;
    setGameData(gameData);
}

export function getStonesData() {
    // If the game board is not set, throw an error
    const gameData = getGameData();
    const stonesData = gameData.stonesData;
    if (stonesData === undefined) {
        throw new Error("Error: The stones data is not set. This usually happens when the game is finished and the saved data is deleted, or when the game board wasn't saved before the game was closed.");
    }
    // If the game board is set, return the game board
    return stonesData
}

export function setStonesData(stonesData) {
    // Set the stones data in the local storage.
    // E.G. the positions of the stones, which player the stone belongs to, if the stone is a king, etc.
    const gameData = getGameData();
    gameData.stonesData = stonesData;
    setGameData(gameData);
}

export function gameDataPresent() {
    // Return if the game data is present in the local storage
    const boardData = localStorage.getItem('gameData');
    if (boardData === null)
        return false
    return true
}

export function deleteGameData() {
    // Delete the game data from the local storage
    localStorage.removeItem('gameData');
}