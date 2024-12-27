import { HttpApi, HttpApiBuilder } from "@effect/platform";
import { Effect } from "effect";

import { CheckHealthApi } from "./Api";

export const Api = HttpApi.make("api").add(CheckHealthApi);

export const CheckHealthApiLive = HttpApiBuilder.group(Api, "checkHealth", (handlers) =>
  handlers.handle("checkHealth", () => Effect.succeed({ message: "server is up and running" })),
);
