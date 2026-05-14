import useSessionStore from "./useSessionStore";
import useAuthStore from "./useAuthStore";
import { useEffect, useState } from "react";
import { computeIndex, deriveIndexKey } from "@/services/blindIndex";
import { LEGITIMATE_ENUM, MOOD_ENUM, TIME_ENUM } from "@/constants/enum";

type IndexLookUp = {
  mood: Map<string, string>;
  time: Map<string, string>;
  legitimate: Map<string, string>;
};

export default function useIndexLookUp(): IndexLookUp | null {
  const masterKey = useSessionStore((s) => s.masterKey);
  const user = useAuthStore((s) => s.user);
  const [lookup, setLookup] = useState<IndexLookUp | null>(null);

  useEffect(() => {
    if (!masterKey || !user?.id) return;
    let cancelled = false;
    (async () => {
      const indexKey = await deriveIndexKey(masterKey, user.id);
      const [moodEntries, timeEntries, legitimateEntries] = await Promise.all([
        Promise.all(
          Object.keys(MOOD_ENUM).map(
            async (key) =>
              [await computeIndex(indexKey, "mood", key), key] as const,
          ),
        ),
        Promise.all(
          Object.keys(TIME_ENUM).map(
            async (key) =>
              [await computeIndex(indexKey, "time", key), key] as const,
          ),
        ),
        Promise.all(
          Object.keys(LEGITIMATE_ENUM).map(
            async (key) =>
              [await computeIndex(indexKey, "legitimate", key), key] as const,
          ),
        ),
      ]);
      if (cancelled) return;
      setLookup({
        mood: new Map(moodEntries),
        time: new Map(timeEntries),
        legitimate: new Map(legitimateEntries),
      });
    })();
    return () => {
      cancelled = true;
    };
  }, [masterKey, user?.id]);
  return lookup;
}
