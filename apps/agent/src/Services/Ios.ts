import { IosTracker } from "@/Trackers";
import { getInfo } from "@/Trackers/Ios";
import { FetchHttpClient, HttpBody, HttpClient } from "@effect/platform";
import type { Udid } from "@repo/domain";
import { Config, Effect as Ef } from "effect";

/** keep device udid with the model name just for logging purpose */
const deviceMap: Map<Udid, string> = new Map();

function addIos(udid: Udid) {
  return Ef.gen(function* () {
    const gadsHost = yield* Config.string("GADS_URL");
    const client = yield* HttpClient.HttpClient;
    const { name, os_version } = yield* getInfo(udid);

    yield* HttpBody.json({
      udid: udid,
      device_type: "real",
      os: "ios",
      provider: "IosProvider",
      usage: "enabled",
      name,
      os_version,

      // TODO replace this with the correct value
      screen_height: "680",
      screen_width: "375",
    }).pipe(
      Ef.andThen((body) => client.post(`${gadsHost}/admin/device`, { body })),
      Ef.andThen((res) => res.json),
      Ef.tap(() => Ef.succeed(deviceMap.set(udid, name ?? "unknown"))),
      Ef.tap(Ef.logInfo(`connect device ${name ?? udid}`)),
    );
  });
}

function removeIos(udid: Udid) {
  return Ef.gen(function* () {
    const gadsHost = yield* Config.string("GADS_URL");
    const client = yield* HttpClient.HttpClient;
    const name = deviceMap.get(udid);

    yield* client.del(`${gadsHost}/admin/device/${udid}`).pipe(
      Ef.andThen((res) => res.json),
      Ef.tap(Ef.logInfo(`disconnect device ${name ?? udid}`)),
    );
  });
}

export function trackAndSetupIos() {
  IosTracker.subscribe(async ({ event, device: { id } }) => {
    if (event === "add") {
      const task = addIos(id as Udid);
      await task.pipe(Ef.scoped, Ef.provide(FetchHttpClient.layer), Ef.runPromise);
    }

    if (event === "remove") {
      const task = removeIos(id as Udid);
      // TODO handle the error of the task
      await task.pipe(Ef.scoped, Ef.provide(FetchHttpClient.layer), Ef.runPromise);
    }
  });
}
