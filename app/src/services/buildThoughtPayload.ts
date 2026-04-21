import { encryptData, decryptData } from "./crypto";
import { deriveIndexKey, computeIndex } from "./blindIndex";
import { MOOD_ENUM, LEGITIMATE_ENUM, TIME_ENUM } from "../constants/enum";

export type MoodKey = keyof typeof MOOD_ENUM;
export type LegitimateKey = keyof typeof LEGITIMATE_ENUM;
export type TimeKey = keyof typeof TIME_ENUM;

export interface PlainThoughtValues {
  mood: MoodKey;
  time: TimeKey;
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
  values: Omit<PlainThoughtValues, "time">,
  masterKey: CryptoKey,
  userId: string,
): Promise<ThoughtPayload> {
  const time = MOOD_ENUM[values.mood].timeIndex as TimeKey;

  const plaintext = JSON.stringify({
    mood: values.mood,
    time,
    legitimate: values.legitimate,
    thought: values.thought,
    context: values.context,
    trigger: values.trigger,
  } satisfies PlainThoughtValues);

  const [{ ciphertext, iv, authTag }, indexKey] = await Promise.all([
    encryptData(plaintext, masterKey),
    deriveIndexKey(masterKey, userId),
  ]);

  const [moodIndex, timeIndex, legitimateIndex] = await Promise.all([
    computeIndex(indexKey, "mood", values.mood),
    computeIndex(indexKey, "time", time),
    computeIndex(indexKey, "legitimate", values.legitimate),
  ]);

  return { ciphertext, iv, authTag, moodIndex, timeIndex, legitimateIndex };
}

export async function decryptThoughtPayload(
  encrypted: { ciphertext: string; iv: string; authTag: string },
  masterKey: CryptoKey,
): Promise<PlainThoughtValues> {
  const plaintext = await decryptData(encrypted, masterKey);
  return JSON.parse(plaintext) as PlainThoughtValues;
}

export type PlainThoughtFilters = {
  mood?: MoodKey;
  time?: TimeKey;
  legitimate?: LegitimateKey;
};

export type ThoughtFilterParams = {
  moodIndex?: string;
  timeIndex?: string;
  legitimateIndex?: string;
};

export async function buildThoughtFilterParams(
  filters: PlainThoughtFilters,
  masterKey: CryptoKey,
  userId: string,
): Promise<ThoughtFilterParams> {
  const hasAny = filters.mood || filters.time || filters.legitimate;
  if (!hasAny) return {};

  const indexKey = await deriveIndexKey(masterKey, userId);

  const [moodIndex, timeIndex, legitimateIndex] = await Promise.all([
    filters.mood ? computeIndex(indexKey, "mood", filters.mood) : undefined,
    filters.time ? computeIndex(indexKey, "time", filters.time) : undefined,
    filters.legitimate
      ? computeIndex(indexKey, "legitimate", filters.legitimate)
      : undefined,
  ]);

  return {
    ...(moodIndex && { moodIndex }),
    ...(timeIndex && { timeIndex }),
    ...(legitimateIndex && { legitimateIndex }),
  };
}
