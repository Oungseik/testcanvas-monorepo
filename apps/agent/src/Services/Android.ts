/** @module AndroidService */
import { AndroidClient, AndroidTracker } from "@/Trackers";
import { Adb, type DeviceClient } from "@devicefarmer/adbkit";
import { FetchHttpClient, HttpBody, HttpClient } from "@effect/platform";
import type { Udid } from "@repo/domain";
import { Config, Effect as Ef } from "effect";

/** keep device udid with the model name just for logging purpose */
const deviceMap: Map<Udid, string> = new Map();

/**
 * Get resolution of android device using ADB
 *
 * Since *the screen_width and screen_height must be string* since the GADS server only accept as string, we does not change to *number*
 * */
async function getResolution(device: DeviceClient): Promise<[string, string]> {
  // @ts-expect-error resolution is assert as
  return device
    .shell("wm size")
    .then(Adb.util.readAll)
    .then((output: Buffer) =>
      output
        .toString()
        .split("\n")
        .map((size) => size.trim()?.slice(15)),
    )
    .then((sizes: string[]) => (sizes.length > 2 ? sizes[1] : sizes[0]))
    .then((rso) => rso?.split("x"));
}

function addAndroid(udid: Udid) {
  return Ef.gen(function* () {
    const gadsHost = yield* Config.string("GADS_URL");
    const client = yield* HttpClient.HttpClient;
    const device = AndroidClient.getDevice(udid);
    const props = yield* Ef.tryPromise(() => device.getProperties());
    const model = props["ro.product.model"] ?? props["ro.vendor.product.model"];
    const [screen_width, screen_height] = yield* Ef.tryPromise(() => getResolution(device));

    return yield* HttpBody.json({
      udid,
      name: props["ro.product.model"],
      provider: "AndroidProvider",
      os_version: props["ro.build.version.release"] ?? "unknown",
      screen_width,
      screen_height,
      os: "android",
      usage: "enabled",
      device_type: "real",
    }).pipe(
      Ef.andThen((body) => client.post(`${gadsHost}/admin/device`, { body })),
      Ef.andThen((res) => res.json),
      Ef.tap(() => Ef.succeed(deviceMap.set(udid, model ?? "unknown"))),
      Ef.tap(Ef.logInfo(`connect device ${model ?? udid}`)),
    );
  });
}

function removeAndroid(udid: Udid) {
  return Ef.gen(function* () {
    const model = deviceMap.get(udid);
    yield* Ef.logInfo(`disconnect device ${model ?? udid}`);
  });
}

export function trackAndSetupAndroid() {
  AndroidTracker.subscribe(async ({ event, device: { type, id } }) => {
    if ((event === "add" || event === "change") && (type === "device" || type === "emulator")) {
      const task = addAndroid(id as Udid);
      // TODO handle the error of the task
      await task.pipe(Ef.scoped, Ef.provide(FetchHttpClient.layer), Ef.runPromise);
    }

    if (event === "remove") {
      const task = removeAndroid(id as Udid);
      // TODO handle the error of the task
      await task.pipe(Ef.scoped, Ef.provide(FetchHttpClient.layer), Ef.runPromise);
    }
  });
}
