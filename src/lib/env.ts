export type ServerEnvKey = "NEWS_API_KEY" | "NEWSDATA_API_KEY" | "GNEWS_API_KEY";

/**
 * Reads a server-only secret at request time. Returns `null` instead of throwing so a missing
 * key simply disables that provider. Nothing here runs at build time, so CI needs no keys.
 */
export function getServerEnv(key: ServerEnvKey): string | null {
  const value = process.env[key]?.trim();
  return value && value.length > 0 ? value : null;
}
