export function bufToHex(buf: Uint8Array): string {
  return Array.from(buf)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function deriveIndexKey(
  masterKey: CryptoKey,
  userId: string,
): Promise<CryptoKey> {
  const rawKey = await crypto.subtle.exportKey("raw", masterKey);
  const baseKey = await crypto.subtle.importKey("raw", rawKey, "HKDF", false, [
    "deriveKey",
  ]);

  return crypto.subtle.deriveKey(
    {
      name: "HKDF",
      hash: "SHA-256",
      salt: new TextEncoder().encode("blind-index-salt"),
      info: new TextEncoder().encode(`${userId}:index-key`),
    },
    baseKey,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
}

export async function computeIndex(
  indexKey: CryptoKey,
  field: string,
  value: string,
): Promise<string> {
  const data = new TextEncoder().encode(`${field}:${value}`);
  const signature = await crypto.subtle.sign("HMAC", indexKey, data);
  return bufToHex(new Uint8Array(signature));
}
