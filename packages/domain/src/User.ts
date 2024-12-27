import { Schema as S } from "effect";
import { Email } from "./Email";
import { Password } from "./Password";

export const User = S.Struct({
  name: S.String,
  email: Email,
  role: S.Literal("ADMIN", "TESTER"),
});

export type User = typeof User.Type;

export const UserWithCredentials = S.extend(User, S.Struct({ password: Password }));

export type UserWithCredentials = typeof UserWithCredentials.Type;
