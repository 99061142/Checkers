export function saveGame(stonesData) {
    // Remove the stones component reference
    Object.entries(stonesData).map(([_, stoneData]) => delete stoneData.ref);
    
    // Save the stones data
    localStorage.setItem('stonesData', JSON.stringify(stonesData));
}

export function removeGame() {
    // Remove the stones data
    localStorage.removeItem('stonesData');
}