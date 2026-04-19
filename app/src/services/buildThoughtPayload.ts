import { encryptData } from "./crypto";
import { deriveIndexKey, computeIndex } from "./blindIndex";
import { MOOD_ENUM, LEGITIMATE_ENUM } from "../constants/enum";

type MoodKey = keyof typeof MOOD_ENUM;
type LegitimateKey = keyof typeof LEGITIMATE_ENUM;

export interface PlainThoughtValues {
  mood: MoodKey;
  thought: string;
  context: string;
  trigger: string;
  legitimate: LegitimateKey;
}

export interface ThoughtPayload {
  ciphertext: string;
  iv: string;
  authTag: string;
  moodIndex: string;
  timeIndex: string;
  legitimateIndex: string;
}

export async function buildThoughtPayload(
  values: PlainThoughtValues,
  masterKey: CryptoKey,
  userId: string,
): Promise<ThoughtPayload> {
  const plaintext = JSON.stringify({
    thought: values.thought,
    context: values.context,
    trigger: values.trigger,
  });

  const [{ ciphertext, iv, authTag }, indexKey] = await Promise.all([
    encryptData(plaintext, masterKey),
    deriveIndexKey(masterKey, userId),
  ]);

  const [moodIndex, timeIndex, legitimateIndex] = await Promise.all([
    computeIndex(indexKey, "mood", values.mood),
    computeIndex(indexKey, "time", MOOD_ENUM[values.mood].timeIndex),
    computeIndex(indexKey, "legitimate", values.legitimate),
  ]);

  return { ciphertext, iv, authTag, moodIndex, timeIndex, legitimateIndex };
}
