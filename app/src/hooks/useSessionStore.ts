import { create } from "zustand";

const MASTER_KEY_STORAGE_KEY = "mk";

async function exportKey(key: CryptoKey): Promise<string> {
  const raw = await crypto.subtle.exportKey("raw", key);
  return btoa(String.fromCharCode(...new Uint8Array(raw)));
}

async function importKey(b64: string): Promise<CryptoKey> {
  const raw = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
  return crypto.subtle.importKey("raw", raw, { name: "AES-GCM" }, true, [
    "encrypt",
    "decrypt",
  ]);
}

export async function persistMasterKey(key: CryptoKey): Promise<void> {
  const b64 = await exportKey(key);
  sessionStorage.setItem(MASTER_KEY_STORAGE_KEY, b64);
}

export async function restoreMasterKey(): Promise<CryptoKey | null> {
  const b64 = sessionStorage.getItem(MASTER_KEY_STORAGE_KEY);
  if (!b64) return null;
  try {
    return await importKey(b64);
  } catch {
    sessionStorage.removeItem(MASTER_KEY_STORAGE_KEY);
    return null;
  }
}

export function clearPersistedMasterKey(): void {
  sessionStorage.removeItem(MASTER_KEY_STORAGE_KEY);
}

interface SessionState {
  isAuthenticated: boolean;
  masterKey: CryptoKey | null;
  setAuthenticated: (value: boolean) => void;
  setMasterKey: (key: CryptoKey | null) => void;
  clear: () => void;
}

const useSessionStore = create<SessionState>()((set) => ({
  isAuthenticated: false,
  masterKey: null,
  setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  setMasterKey: (masterKey) => set({ masterKey }),
  clear: () => {
    clearPersistedMasterKey();
    set({ isAuthenticated: false, masterKey: null });
  },
}));

export default useSessionStore;
