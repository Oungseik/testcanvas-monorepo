import { FetchHttpClient } from "@effect/platform";
import { Effect as Ef } from "effect";
import { setupAndroidProvider, setupIosProvider } from "./Services";
import { trackAndSetupAndroid } from "./Services/Android";

setupAndroidProvider().pipe(Ef.scoped, Ef.provide(FetchHttpClient.layer), Ef.runPromise);
setupIosProvider().pipe(Ef.scoped, Ef.provide(FetchHttpClient.layer), Ef.runPromise);

trackAndSetupAndroid();
