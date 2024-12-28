import { HttpApiEndpoint, HttpApiGroup, OpenApi } from "@effect/platform";
import { Email, UserWithCredentials } from "@repo/domain";
import { Schema as S } from "effect";
import { InternalServerError, NotFound, UnprocessableContent } from "../Errors";

const registerTester = HttpApiEndpoint.post("registerTester", "/testers/register")
  .setPayload(UserWithCredentials)
  .addSuccess(S.Struct({ status: S.Literal("success") }))
  .addError(UnprocessableContent)
  .addError(InternalServerError)
  .annotateContext(
    OpenApi.annotations({
      title: "Register Testers",
      description: "API endpoint to create an account as an tester",
    }),
  );

const loginTester = HttpApiEndpoint.post("loginTester", "/login")
  .setPayload(S.Struct({ email: Email, password: S.String }))
  .addSuccess(S.Struct({ token: S.String }))
  .addError(NotFound)
  .addError(UnprocessableContent)
  .addError(InternalServerError)
  .annotateContext(
    OpenApi.annotations({
      title: "Log-in Engineer",
      description: "API endpoint to log-in as an tester.",
    }),
  );

export const AuthApi = HttpApiGroup.make("authentication")
  .add(registerTester)
  .add(loginTester)
  .prefix("/api/auth")
  .annotateContext(
    OpenApi.annotations({
      title: "Authentication APIs",
      description: "APIs to do authentication stuffs like register, sign-in and sign-out.",
    }),
  );
