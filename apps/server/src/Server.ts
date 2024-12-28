import { createServer } from "node:http";
import { Argon2HashingLive } from "@/Services/Hashing";
import { JwtLive } from "@/Services/JsonWebToken";
import { HttpApiBuilder, HttpApiSwagger, HttpMiddleware, HttpServer } from "@effect/platform";
import { NodeHttpServer, NodeRuntime } from "@effect/platform-node";
import { Layer } from "effect";
import { Api } from "@repo/api";
import { AuthApiLive, CheckHealthApiLive } from "./Http";

export const ApiLive = HttpApiBuilder.api(Api).pipe(
  Layer.provide(AuthApiLive),
  Layer.provide(CheckHealthApiLive),
);

export const HttpLive = HttpApiBuilder.serve(HttpMiddleware.logger).pipe(
  Layer.provide(HttpApiSwagger.layer({ path: "/docs" })),
  Layer.provide(HttpApiBuilder.middlewareCors()),
  Layer.provide(HttpApiBuilder.middlewareOpenApi()),
  Layer.provide(ApiLive),
  HttpServer.withLogAddress,
  Layer.provide(Argon2HashingLive),
  Layer.provide(JwtLive),
);

HttpLive.pipe(
  Layer.provide(NodeHttpServer.layer(createServer, { port: 5000 })),
  Layer.launch,
  NodeRuntime.runMain,
);
