export function generateRandomHexColor(): string {
  // Generate a random number between 0 and 16777215 (FFFFFF in hexadecimal)
  const randomColorNumber = Math.floor(Math.random() * 16777215);

  // Convert the decimal number to hexadecimal and pad with zeros if necessary
  const hexColor = randomColorNumber.toString(16).padStart(6, '0');

  // Prepend a '#' to the hex color code
  return `#${hexColor}`;
}
