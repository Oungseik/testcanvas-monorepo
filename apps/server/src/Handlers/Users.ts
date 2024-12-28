import { users } from "@/Services/Mongo";
import type { AppServer, AppSocket } from "@/types";
import { UserWithTimeStamps } from "@repo/domain";
import { Effect as Ef, Schema as S } from "effect";

export function registerUsersHandler(_io: AppServer, socket: AppSocket) {
  socket.on("Users:GetInfo", async (_, callback) => {
    const task = Ef.tryPromise(() => users.findOne({ email: socket.data.email })).pipe(
      Ef.flatMap(Ef.fromNullable),
      Ef.flatMap((user) =>
        S.decodeUnknown(UserWithTimeStamps)({
          ...user,
          createdAt: user.createdAt.toString(),
          updatedAt: user.updatedAt.toString(),
        }),
      ),
      Ef.map((user) => ({ status: "success" as const, data: user })),
      Ef.catchTags({
        UnknownException: () =>
          Ef.succeed({ status: "fail", error: "INTERNAL_SERVER_ERROR" } as const),
        ParseError: () => Ef.succeed({ status: "fail", error: "INTERNAL_SERVER_ERROR" } as const),
        NoSuchElementException: () => Ef.succeed({ status: "fail", error: "NOT_FOUND" } as const),
      }),
    );

    const data = await Ef.runPromise(task);
    callback(data);
  });
}
