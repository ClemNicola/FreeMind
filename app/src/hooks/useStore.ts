import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  email: string;
  accessToken: string;
  refreshToken: string;
  wrappedMasterKey: string;
  salt: string;
}

interface UserStore {
  user: User | null;
  setUser: (user: User | null) => void;
}

const useStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
    }),
    { name: "user" },
  ),
);

export default useStore;
