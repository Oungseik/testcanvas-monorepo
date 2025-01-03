import cp from "node:child_process";
import fs from "node:fs";
import { FetchHttpClient } from "@effect/platform";
import { Effect as Ef } from "effect";
import { setupAndroidProvider, setupIosProvider } from "./Services";
import { trackAndSetupAndroid } from "./Services/Android";

Promise.all([
  setupAndroidProvider().pipe(Ef.scoped, Ef.provide(FetchHttpClient.layer), Ef.runPromise),
  setupIosProvider().pipe(Ef.scoped, Ef.provide(FetchHttpClient.layer), Ef.runPromise),
]).then(() => {
  // make logs directory, if not exist
  if (!fs.existsSync("logs")) {
    fs.mkdirSync("logs", { recursive: true });
  }

  const childAndroid = cp.spawn("gads", [
    "provider",
    "--nickname=AndroidProvider",
    "--hub=http://192.168.99.192:8000",
  ]);

  childAndroid.stdout;
  childAndroid.stdout.pipe(fs.createWriteStream("logs/android.log", { encoding: "utf8" }));
  childAndroid.stderr.pipe(fs.createWriteStream("logs/android.error", { encoding: "utf8" }));

  const childIos = cp.spawn("gads", [
    "provider",
    "--nickname=IosProvider",
    "--hub=http://192.168.99.192:8000",
  ]);
  childIos.stdout.pipe(fs.createWriteStream("logs/ios.log", { encoding: "utf8" }));
  childIos.stderr.pipe(fs.createWriteStream("logs/ios.error", { encoding: "utf8" }));
});

trackAndSetupAndroid();
