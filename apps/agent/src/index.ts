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
  const gadsURL = process.env.GADS_URL ?? "127.0.0.1:8000";
  // make logs directory, if not exist
  if (!fs.existsSync("logs")) {
    fs.mkdirSync("logs", { recursive: true });
  }

  const childAndroid = cp.spawn("gads", [
    "provider",
    "--nickname=AndroidProvider",
    `--hub=${gadsURL}`,
  ]);

  childAndroid.stdout;
  childAndroid.stdout.pipe(fs.createWriteStream("logs/android.log", { encoding: "utf8" }));
  childAndroid.stderr.pipe(fs.createWriteStream("logs/android.error", { encoding: "utf8" }));
  childAndroid.on("exit", (e) => console.error("AndroidProvider exit with code", e))

  const childIos = cp.spawn("gads", [
    "provider",
    "--nickname=IosProvider",
    `--hub=${gadsURL}`,
  ]);
  childIos.stdout.pipe(fs.createWriteStream("logs/ios.log", { encoding: "utf8" }));
  childIos.stderr.pipe(fs.createWriteStream("logs/ios.error", { encoding: "utf8" }));
  childAndroid.on("exit", (e) => console.error("AndroidProvider exit with code", e))
});

trackAndSetupAndroid();
