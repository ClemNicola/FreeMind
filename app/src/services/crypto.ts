import loadArgon2idWasm from "argon2id";

let argon2id: Awaited<ReturnType<typeof loadArgon2idWasm>> | null = null;

async function initArgon2id() {
  if (!argon2id) {
    argon2id = await loadArgon2idWasm();
  }
  return argon2id;
}

function toBase64(bytes: Uint8Array): string {
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
  const encoder = new TextEncoder();
  const argon2id = await initArgon2id();

  const hash = argon2id({
    password: encoder.encode(password),
    salt,
    parallelism: 1,
    passes: 4,
    memorySize: 65536,
    tagLength: 32,
  });

  return window.crypto.subtle.importKey(
    "raw",
    new Uint8Array(hash),
    { name: "AES-GCM" },
    true,
    ["encrypt", "decrypt", "wrapKey", "unwrapKey"],
  );
}

export async function wrapMasterKey(masterKey: CryptoKey): Promise<string> {
  const raw = await window.crypto.subtle.exportKey("raw", masterKey);
  return toBase64(new Uint8Array(raw));
}

export async function unwrapMasterKey(
  wrappedBase64: string,
): Promise<CryptoKey> {
  const raw = fromBase64(wrappedBase64);
  return window.crypto.subtle.importKey(
    "raw",
    raw as Uint8Array<ArrayBuffer>,
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
