import { users } from "@/Services/Mongo";
import { Effect as Ef } from "effect";
import { DbError } from "./Errors";
import { Jwt, JwtError } from "./Services/JsonWebToken";
import type { AppSocket } from "./types";

export function auth(socket: AppSocket) {
  const { token } = socket.handshake.auth;
  return Ef.gen(function* () {
    const { verify } = yield* Jwt;

    const payload = yield* verify(token);
    if (typeof payload === "string") {
      yield* new JwtError({ message: "Invalid payload" });
      return;
    }

    const { email } = payload;

    yield* Ef.tryPromise(() => users.findOne({ email })).pipe(
      Ef.flatMap(Ef.fromNullable),
      Ef.tap((user) => {
        socket.data.email = user.email;
      }),
      Ef.catchTag("UnknownException", () => new DbError()),
    );
  });
}
