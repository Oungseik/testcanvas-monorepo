import { Schema as S } from "effect";

export const ANDROID_TYPES = [
  "ANDROID",
  "ANDROID_EMULATOR",
  "ANDROID_TABLET",
  "ANDROID_TABLET_EMULATOR",
  "ANDROID_FOLDABLE",
  "ANDROID_FOLDABLE_EMULATOR",
] as const;

export const Android = S.Struct({
  udid: S.String,
  type: S.Literal(...ANDROID_TYPES),
  model: S.String,
  name: S.String,
  manufacturer: S.String,
  image: S.String,
});

export type Android = typeof Android.Type;
