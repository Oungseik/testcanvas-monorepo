import { Hashing } from "@/Services/Hashing";
import { Jwt } from "@/Services/JsonWebToken";
import { users } from "@/Services/Mongo";
import { HttpApiBuilder } from "@effect/platform";
import { Api } from "@repo/api";
import { InternalServerError, NotFound, UnprocessableContent } from "@repo/api/errors";
import { Effect as Ef } from "effect";

export const AuthApiLive = HttpApiBuilder.group(Api, "authentication", (handlers) =>
  Ef.gen(function* () {
    const { hash, verify } = yield* Hashing;
    const { sign } = yield* Jwt;

    return handlers
      .handle("loginTester", ({ payload }) =>
        Ef.tryPromise(() => users.findOne({ email: payload.email })).pipe(
          Ef.flatMap(Ef.fromNullable),
          Ef.tap((user) => verify(user.password, payload.password)),
          Ef.flatMap((user) => sign({ email: user.email })),
          Ef.map((token) => ({ token })),
          Ef.tapError((e) => Ef.sync(() => console.error(e))),
          Ef.catchTags({
            UnknownException: () => new InternalServerError(),
            HashingError: () => new InternalServerError(),
            JwtError: () => new InternalServerError(),
            HashNotMatchError: () => new UnprocessableContent({ message: "passwd does not match" }),
            NoSuchElementException: () => new NotFound({ message: "user not found" }),
          }),
        ),
      )
      .handle("registerTester", ({ payload }) =>
        hash(payload.password).pipe(
          Ef.flatMap((hash) =>
            Ef.tryPromise(() => users.insertOne({ ...payload, password: hash })),
          ),
          Ef.andThen(Ef.succeed({ status: "success" as const })),
          Ef.tapError((e) => Ef.sync(() => console.error(e))),
          Ef.catchTags({
            HashingError: () => new InternalServerError(),
            UnknownException: () => new InternalServerError(),
          }),
        ),
      );
  }),
);
