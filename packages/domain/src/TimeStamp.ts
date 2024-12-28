import { Schema as S } from "effect";

export const TimeStamps = S.Struct({
  createdAt: S.Date,
  updatedAt: S.Date,
});

export type TimeStamps = typeof TimeStamps.Type;
