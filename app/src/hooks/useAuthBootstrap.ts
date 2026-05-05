import { useEffect, useState } from "react";
import useAuthStore from "./useAuthStore";
import useSessionStore, { restoreMasterKey } from "./useSessionStore";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export default function useAuthBootstrap() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        let res = await fetch(`${BASE_URL}/auth/me`, {
          credentials: "include",
        });

        if (res.status === 401) {
          const refreshRes = await fetch(`${BASE_URL}/auth/refresh`, {
            method: "POST",
            credentials: "include",
          });
          if (!refreshRes.ok) throw new Error("Not authenticated");
          res = await fetch(`${BASE_URL}/auth/me`, {
            credentials: "include",
          });
        }

        if (!res.ok) throw new Error("Not authenticated");

        const user = await res.json();
        if (cancelled) return;

        const masterKey = await restoreMasterKey();

        useAuthStore.getState().setSession({
          user,
          refreshToken: "",
          persist: true,
        });
        useSessionStore.getState().setAuthenticated(true);
        if (masterKey) {
          useSessionStore.getState().setMasterKey(masterKey);
        }
      } catch {
        if (cancelled) return;
        useAuthStore.getState().clear();
        useSessionStore.getState().clear();
      } finally {
        if (!cancelled) setIsReady(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return isReady;
}
