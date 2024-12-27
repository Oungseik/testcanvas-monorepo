import { Config, Context, Data, Effect as Ef, Layer } from "effect";
import jwt, { type JwtPayload } from "jsonwebtoken";

export class JwtError extends Data.TaggedError("JwtError")<{ message: string }> {}

export class Jwt extends Context.Tag("JwtService")<
  Jwt,
  {
    readonly sign: <T extends Record<string, unknown>>(payload: T) => Ef.Effect<string, JwtError>;
    readonly verify: (token: string) => Ef.Effect<JwtPayload | string, JwtError>;
  }
>() {}

export const JwtLive = Layer.effect(
  Jwt,
  Ef.gen(function* () {
    const jwtKey = yield* Config.string("JWT_KEY");
    const jwtExpire = yield* Config.string("JWT_EXPIRE").pipe(Config.withDefault("30d"));

    return {
      sign: (payload) =>
        Ef.try(() => jwt.sign(payload, jwtKey, { expiresIn: jwtExpire })).pipe(
          Ef.catchAll(() => new JwtError({ message: "error occured while signing token" })),
        ),
      verify: (token: string) =>
        Ef.try(() => jwt.verify(token, jwtKey)).pipe(
          Ef.catchTags({
            UnknownException: () => new JwtError({ message: "invalid token" }),
          }),
        ),
    };
  }),
);
