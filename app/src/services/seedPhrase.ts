import { generateMnemonic, validateMnemonic } from "bip39";

function bufToHex(buf: Uint8Array): string {
  return Array.from(buf)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function generateSeedPhrase(): string {
  return generateMnemonic(128);
}

export function validateSeedPhrase(seedPhrase: string): boolean {
  return validateMnemonic(seedPhrase);
}

export async function hashSeedPhrase(seedPhrase: string): Promise<string> {
  const encoded = new TextEncoder().encode(seedPhrase);
  const hash = await crypto.subtle.digest("SHA-256", encoded);
  return bufToHex(new Uint8Array(hash));
}
