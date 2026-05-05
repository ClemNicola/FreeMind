import { useEffect } from "react";
import useAuthStore from "./useAuthStore";
import useSessionStore from "./useSessionStore";

export default function useAuthBootstrap(): void {
  useEffect(() => {
    const { user, clear } = useAuthStore.getState();
    const { accessToken } = useSessionStore.getState();

    if (user && !accessToken) {
      clear();
    }
  }, []);
}
