import { InternalServerError, Unauthorized } from "@repo/api/errors";
import { Config, Effect as Ef } from "effect";
import { Server } from "socket.io";
import { registerUsersHandler } from "./Handlers";
import { auth } from "./Middlewares";
import { Argon2HashingLive } from "./Services/Hashing";
import { JwtLive } from "./Services/JsonWebToken";
import type { AppServer } from "./types";

const main = Ef.gen(function* () {
  const port = yield* Config.number("WS_PORT").pipe(Config.withDefault(5100));
  const io: AppServer = new Server({ cors: { origin: ["*"] } });

  io.use((socket, next) =>
    auth(socket, next).pipe(
      Ef.catchTags({
        JwtError: ({ message }) => Ef.sync(() => next(new Unauthorized({ message }))),
        NoSuchElementException: () =>
          Ef.sync(() => next(new Unauthorized({ message: "user not exist" }))),
        DbError: () => Ef.sync(() => next(new InternalServerError())),
      }),
      Ef.provide(JwtLive),
      Ef.provide(Argon2HashingLive),
      Ef.runPromise,
    ),
  );

  io.on("connection", (socket) => {
    socket.on("error", console.error);

    registerUsersHandler(io, socket);
  });

  io.listen(port);
});

Ef.runPromise(main);
