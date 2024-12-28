import { HttpApiEndpoint, HttpApiGroup, OpenApi } from "@effect/platform";
import { Schema } from "effect";

const CheckHealth = Schema.Struct({
  message: Schema.String,
});

export const CheckHealthApi = HttpApiGroup.make("checkHealth")
  .add(HttpApiEndpoint.get("checkHealth", "/check-health").addSuccess(CheckHealth))
  .annotateContext(
    OpenApi.annotations({
      title: "Check Health",
      description: "Endpoint to check health",
    }),
  );
