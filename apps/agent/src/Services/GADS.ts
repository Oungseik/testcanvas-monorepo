/** @module GADS */
/**
 *
 * n devices - 1 provider - 1 appium - 1 selenium grid
 * Create dedicate providers for android and ios devices.
 *
 * */
import { HttpBody, HttpClient } from "@effect/platform";
import { AndroidProvider, type IosProvider } from "@repo/domain";
import { Config, Effect as Ef, Schema as S } from "effect";
import getPort, { portNumbers } from "get-port";

type Provider = AndroidProvider | IosProvider;
type OS = "linux" | "windows" | "darwin";

function setupProvider(nickname: string) {
  return Ef.gen(function* () {
    const client = yield* HttpClient.HttpClient;
    const gadsHost = yield* Config.string("GADS_URL");

    const providers = (yield* client
      .get(`${gadsHost}/admin/providers`)
      .pipe(Ef.andThen((res) => res.json))) as Provider[];

    if (providers.some((p) => p.nickname === nickname)) {
      return yield* Ef.logInfo(`${nickname} already exist`);
    }

    const selenium_grid = yield* Config.string("SELENIUM_GRID_URL");
    const host_address = yield* Config.string("HOST_ADDRESS");
    const os = (yield* Config.string("OS")) as OS;
    const port = yield* Ef.promise(() => getPort({ port: portNumbers(10000, 12000) }));

    const provider = yield* S.decode(AndroidProvider)({
      nickname,
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
      .pipe(Ef.tap(Ef.logInfo(`successfully setup ${nickname}`)));
  });
}

export const setupAndroidProvider = () => setupProvider("AndroidProvider");
export const setupIosProvider = () => setupProvider("IosProvider");
