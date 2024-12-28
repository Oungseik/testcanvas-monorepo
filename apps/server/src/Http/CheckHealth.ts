import { HttpApiBuilder } from "@effect/platform";
import { Api } from "@repo/api";
import { Effect } from "effect";

export const CheckHealthApiLive = HttpApiBuilder.group(Api, "checkHealth", (handlers) =>
  handlers.handle("checkHealth", () => Effect.succeed({ message: "server is up and running" })),
);
