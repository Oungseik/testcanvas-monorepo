import { HttpApi } from "@effect/platform";
import { AuthApi, CheckHealthApi } from "./Api";

export const Api = HttpApi.make("AuthApi").add(CheckHealthApi).add(AuthApi);
