export function getStonesInformationData() {
    // Function to get the stones information data from the local storage
    const stonesInformationData = JSON.parse(localStorage.getItem('stonesInformation'));
    if (stonesInformationData === null)
        throw new Error("Error: The stones information data is not set. This is usually when the game is finished and the saved data is deleted, or when the initial game data is not set yet.");
    return stonesInformationData
}

export function setStonesInformationData(stonesInformationData) {
    // Function to set the stones information data to the local storage
    localStorage.setItem('stonesInformation', JSON.stringify(stonesInformationData));
}

export function getLastCurrentPlayer() {
    // Function to get the last current player from the local storage
    let lastCurrentPlayer = localStorage.getItem('lastCurrentPlayer');
    if (lastCurrentPlayer === null) {
        throw new Error("Error: The last current player is not set. This is usually when the game is finished, or not started yet.");
    }
    lastCurrentPlayer = Number(lastCurrentPlayer);
    return lastCurrentPlayer
}

export function setLastCurrentPlayer(lastCurrentPlayer) {
    // Function to set the last current player to the local storage
    localStorage.setItem('lastCurrentPlayer', lastCurrentPlayer);
}

export function getAllGameDataPresent() {
    // Function to check if the game data is present in the local storage
    const gameDataFunctions = [
        getStonesInformationData,
        getLastCurrentPlayer
    ];

    // If any of the game data functions throw an error, return false
    // Since this means that not all the game data is present in the local storage
    for (const func of gameDataFunctions) {
        try {
            func();
        } catch (error) {
            return false
        }
    }
    // If all the game data functions do not throw an error, return true
    return true
}

export function removeAllGameData() {
    // Function to remove all game data from the local storage
    localStorage.removeItem('stonesInformation');
    localStorage.removeItem('lastCurrentPlayer');
}