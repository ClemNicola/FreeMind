import { create } from "zustand";

interface SessionState {
  accessToken: string | null;
  refreshToken: string | null;
  masterKey: CryptoKey | null;
  setTokens: (tokens: { accessToken: string; refreshToken: string }) => void;
  setAccessToken: (token: string | null) => void;
  setMasterKey: (key: CryptoKey | null) => void;
  clear: () => void;
}

const useSessionStore = create<SessionState>()((set) => ({
  accessToken: null,
  refreshToken: null,
  masterKey: null,
  setTokens: ({ accessToken, refreshToken }) =>
    set({ accessToken, refreshToken }),
  setAccessToken: (accessToken) => set({ accessToken }),
  setMasterKey: (masterKey) => set({ masterKey }),
  clear: () => set({ accessToken: null, refreshToken: null, masterKey: null }),
}));

export default useSessionStore;
