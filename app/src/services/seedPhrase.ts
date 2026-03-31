import { Buffer } from "buffer";
globalThis.Buffer = Buffer;

import { generateMnemonic, validateMnemonic } from "bip39";
import { bufToHex } from "./blindIndex";

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
