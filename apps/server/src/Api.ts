import { HttpApi, HttpApiBuilder } from "@effect/platform";
import { Layer } from "effect";
import { AuthApi, AuthApiLive } from "./Api/Auth";
import { CheckHealthApi, CheckHealthApiLive } from "./Api/CheckHealth";

export const Api = HttpApi.make("api").add(CheckHealthApi).add(AuthApi);

export const ApiLive = HttpApiBuilder.api(Api).pipe(
  Layer.provide(AuthApiLive),
  Layer.provide(CheckHealthApiLive),
);
