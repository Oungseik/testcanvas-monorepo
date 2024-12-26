import { Schema as S } from "effect";
import { Email } from "./Email";

export const User = S.Struct({
  name: S.String,
  email: Email,
  role: S.Literal("ADMIN", "TESTER"),
});

export type User = typeof User.Type;
