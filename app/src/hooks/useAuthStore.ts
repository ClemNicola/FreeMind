import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface AuthUser {
  id: string;
  email: string;
  wrappedMasterKey: string;
  salt: string;
}

interface AuthState {
  user: AuthUser | null;
  refreshToken: string | null;
  setSession: (session: {
    user: AuthUser;
    refreshToken: string;
    persist: boolean;
  }) => void;
  clear: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      refreshToken: null,
      setSession: ({ user, refreshToken, persist: shouldPersist }) =>
        set({ user, refreshToken: shouldPersist ? refreshToken : null }),
      clear: () => set({ user: null, refreshToken: null }),
    }),
    {
      name: "auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        refreshToken: state.refreshToken,
      }),
    },
  ),
);

export default useAuthStore;
