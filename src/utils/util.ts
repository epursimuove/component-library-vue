export const createRandomId = (factor: number = 100000): number =>
  Math.ceil(Math.random() * factor);

export const getNumberOfDigits = (n: number): number =>
  n.toString(10).length - (n < 0 ? 1 : 0);

export const padStart = (n: number, numberOfCharacters: number): string =>
  n.toString(10).padStart(numberOfCharacters);

export function getFlagEmoji(countryCode: string): string {
  const codePoints: number[] = countryCode
    .toUpperCase()
    .split("")
    .map((char: string) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

export const toFixed = (n: number, numberOfDecimals: number = 2): string =>
  n.toFixed(numberOfDecimals);

export const toFixedPOC = (n: number, numberOfDecimals: number = 2): number =>
  Number.parseFloat(n.toFixed(numberOfDecimals));
