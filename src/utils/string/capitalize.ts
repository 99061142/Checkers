/**
 * Capitalizes the first letter of the given string.
 * @param {string} str The string to capitalize the first letter of.
 * @returns {string} The string with the first letter capitalized.
 */
export function capitalizeFirstLetter(str: string): string {
    const capitalizedString: string = str.charAt(0).toUpperCase() + str.slice(1);
    return capitalizedString;
}