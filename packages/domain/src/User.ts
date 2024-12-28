import { Schema as S } from "effect";
import { Email } from "./Email";
import { Password } from "./Password";
import { TimeStamps } from "./TimeStamp";

export const Role = S.Literal("ADMIN", "TESTER").pipe(S.brand("Role"));
export type Role = typeof Role.Type;

export const User = S.Struct({
  name: S.String,
  email: Email,
  role: Role,
});
export type User = typeof User.Type;

export const UserWithCredentials = S.extend(User, S.Struct({ password: Password }));
export type UserWithCredentials = typeof UserWithCredentials.Type;

export const UserWithTimeStamps = S.extend(User, TimeStamps);
export type UserWithTimeStamps = typeof UserWithTimeStamps.Type;
