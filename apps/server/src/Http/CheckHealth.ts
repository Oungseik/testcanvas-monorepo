import { HttpApi, HttpApiBuilder } from "@effect/platform";
import { Effect } from "effect";
import { Api } from "@repo/api";

export const CheckHealthApiLive = HttpApiBuilder.group(Api, "checkHealth", (handlers) =>
  handlers.handle("checkHealth", () => Effect.succeed({ message: "server is up and running" })),
);
