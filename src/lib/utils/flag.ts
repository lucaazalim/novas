/** Turns an ISO 3166-1 alpha-2 code into its regional-indicator emoji ("br" -> 🇧🇷). */
export function getFlagEmoji(countryCode: string): string {
  const codePoints = Array.from(countryCode.toUpperCase(), (char) => 0x1f1a5 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}
