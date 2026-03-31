// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import argon2 from "argon2-browser/dist/argon2-bundled.min.js";

export function toBase64(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function fromBase64(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

export function generateSalt(): Uint8Array {
  return window.crypto.getRandomValues(new Uint8Array(16));
}

export async function deriveMasterKey(
  password: string,
  salt: Uint8Array,
): Promise<CryptoKey> {
  const result = await argon2.hash({
    pass: password,
    salt,
    time: 4,
    mem: 65536,
    hashLen: 32,
    parallelism: 1,
    type: argon2.ArgonType.Argon2id,
  });

  return window.crypto.subtle.importKey(
    "raw",
    new Uint8Array(result.hash),
    { name: "AES-GCM" },
    true,
    ["encrypt", "decrypt", "wrapKey", "unwrapKey"],
  );
}

export async function wrapMasterKey(
  masterKey: CryptoKey,
  wrappingKey: CryptoKey,
): Promise<{ wrapped: string; iv: string }> {
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const raw = await window.crypto.subtle.exportKey("raw", masterKey);

  const encrypted = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv, tagLength: 128 },
    wrappingKey,
    raw,
  );

  return {
    wrapped: toBase64(new Uint8Array(encrypted)),
    iv: toBase64(iv),
  };
}

export async function unwrapMasterKey(
  wrappedData: { wrapped: string; iv: string },
  wrappingKey: CryptoKey,
): Promise<CryptoKey> {
  const iv = fromBase64(wrappedData.iv);
  const encrypted = fromBase64(wrappedData.wrapped);

  const raw = await window.crypto.subtle.decrypt(
    { name: "AES-GCM", iv: iv as Uint8Array<ArrayBuffer>, tagLength: 128 },
    wrappingKey,
    encrypted as Uint8Array<ArrayBuffer>,
  );

  return window.crypto.subtle.importKey(
    "raw",
    raw,
    { name: "AES-GCM" },
    false,
    ["encrypt", "decrypt"],
  );
}

export async function encryptData(
  data: string,
  masterKey: CryptoKey,
): Promise<{ ciphertext: string; iv: string; authTag: string }> {
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(data);

  const encrypted = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv, tagLength: 128 },
    masterKey,
    encoded,
  );

  const ciphertext = new Uint8Array(
    encrypted.slice(0, encrypted.byteLength - 16),
  );
  const authTag = new Uint8Array(encrypted.slice(encrypted.byteLength - 16));

  return {
    ciphertext: toBase64(ciphertext),
    iv: toBase64(iv),
    authTag: toBase64(authTag),
  };
}

export async function decryptData(
  encryptedData: { ciphertext: string; iv: string; authTag: string },
  masterKey: CryptoKey,
): Promise<string> {
  const ciphertext = fromBase64(encryptedData.ciphertext);
  const iv = fromBase64(encryptedData.iv);
  const authTag = fromBase64(encryptedData.authTag);

  const combined = new Uint8Array(ciphertext.length + authTag.length);
  combined.set(ciphertext, 0);
  combined.set(authTag, ciphertext.length);

  const decrypted = await window.crypto.subtle.decrypt(
    { name: "AES-GCM", iv: iv as Uint8Array<ArrayBuffer>, tagLength: 128 },
    masterKey,
    combined,
  );

  return new TextDecoder().decode(decrypted);
}
