import { AndroidClient, AndroidTracker } from "@/Trackers";
import { Adb, type DeviceClient } from "@devicefarmer/adbkit";
import { FetchHttpClient, HttpBody, HttpClient } from "@effect/platform";
import { AndroidProvider, type IosProvider, type Udid } from "@repo/domain";
import { Config, Effect as Ef, Schema as S } from "effect";
import getPort, { portNumbers } from "get-port";

type Provider = AndroidProvider | IosProvider;

const providersTable: Map<Udid, Provider & { model?: string }> = new Map();
type OS = "linux" | "windows" | "darwin";

/**
 * Get resolution of android device using ADB
 *
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

/**
 * According to the GADS documentation, it need to create provider, then create device and register to a provider
 * This is one provider - one device model
 * */
function setupAndroid(udid: Udid) {
  return Ef.gen(function* () {
    // even though this function is kinda long, the two request share a lot of same variables, so we do it once.
    const gadsHost = yield* Config.string("GADS_URL");
    const selenium_grid = yield* Config.string("SELENIUM_GRID_URL");
    const host_address = yield* Config.string("HOST_ADDRESS");
    const os = (yield* Config.string("OS")) as OS;
    const client = yield* HttpClient.HttpClient;
    const port = yield* Ef.promise(() => getPort({ port: portNumbers(10000, 12000) }));
    const device = AndroidClient.getDevice(udid);
    const props = yield* Ef.tryPromise(() => device.getProperties());
    const model = props["ro.product.model"] ?? props["ro.vendor.product.model"];
    const [screen_width, screen_height] = yield* Ef.tryPromise(() => getResolution(device));

    const provider = yield* S.decode(AndroidProvider)({
      nickname: udid,
      os,
      port,
      provide_android: true,
      use_selenium_grid: true,
      selenium_grid,
      host_address,
    });
    const providerBody = yield* HttpBody.json(provider);
    yield* client
      .post(`${gadsHost}/admin/providers/add`, {
        body: providerBody,
      })
      .pipe(
        Ef.tap(() => providersTable.set(udid, { ...provider, model })),
        Ef.tap(Ef.logInfo(`setup gads provider for ${model ?? udid}`)),
      );

    // *the screen_width and screen_height must be string* since the GADS server only accept as string
    const deviceBody = yield* HttpBody.json({
      udid,
      name: props["ro.product.model"],
      provider: udid,
      os_version: props["ro.build.version.release"] ?? "unknwn",
      screen_width,
      screen_height,
      os: "android",
      usage: "enabled",
      device_type: "real",
    });

    yield* client
      .post(`${gadsHost}/admin/device`, { body: deviceBody })
      .pipe(Ef.tap(Ef.logInfo(`setup device for ${model ?? udid}`)));
  });
}

export function createiOSProvider() {}

function removeProvider(udid: Udid) {
  return Ef.gen(function* () {
    const gadsHost = yield* Config.string("GADS_URL");
    const client = yield* HttpClient.HttpClient;
    const prov = providersTable.get(udid);

    return yield* client.del(`${gadsHost}/admin/providers/${udid}`).pipe(
      Ef.andThen((res) => res.status),
      Ef.tap(() => providersTable.delete(udid)),
      Ef.tap(Ef.logInfo(`remove gads provider for ${prov?.model ?? udid}`)),
    );
  });
}

export function setupGADS() {
  AndroidTracker.subscribe(async ({ event, device: { type, id } }) => {
    if ((event === "add" || event === "change") && (type === "device" || type === "emulator")) {
      const task = setupAndroid(id as Udid).pipe();
      await task.pipe(Ef.scoped, Ef.provide(FetchHttpClient.layer), Ef.runPromise);
    }

    if (event === "remove") {
      await removeProvider(id as Udid).pipe(
        Ef.scoped,
        Ef.provide(FetchHttpClient.layer),
        Ef.runPromise,
      );
    }
  });
}
