import { Schema as S } from "effect";
import { Email } from "./Email";
import { Password } from "./Password";

export const Role = S.Literal("ADMIN", "TESTER").pipe(S.brand("Role"));
export type Role = typeof Role.Type;

export const User = S.Struct({
  name: S.String,
  email: Email,
  role: Role,
  createdAt: S.Date,
  updatedAt: S.Date,
});
export type User = typeof User.Type;

export const UserWithCredentials = S.extend(User, S.Struct({ password: Password }));
export type UserWithCredentials = typeof UserWithCredentials.Type;
