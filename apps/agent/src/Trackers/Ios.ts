import cp from "node:child_process";
import { Signal } from "@/Signal";
import type { Udid } from "@repo/domain";
import { Data, Effect as Ef } from "effect";

const diff = <T>(xs: T[], ys: T[]) => xs.filter((x) => !ys.includes(x));

type IosEvent = {
  event: "add" | "remove";
  device: { id: Udid; type: "real" };
};

class IosTracker extends Signal<IosEvent> {
  constructor() {
    super();

    const ps = cp.spawn("ios", ["listen"]);
    ps.stdout.on("data", (data) => {
      for (const output of data.toString().split("\n")) {
        if (!output) {
          continue;
        }
        const device = JSON.parse(output);
        if (device.MessageType === "Attached") {
          this.notify({
            event: "add",
            device: { id: device.Properties.SerialNumber as Udid, type: "real" },
          });
        }

        if (device.Message === "Detached") {
          this.notify({ event: "remove", device: { id: "unknown" as Udid, type: "real" } });
        }
      }
    });
  }
}

export const tracker = new IosTracker();

export class GoIosError extends Data.TaggedError("GoIosError")<{
  readonly message: string;
}> {}

interface IphoneInfo {
  name: string;
  os_version: string;
}

export function getInfo(udid: Udid) {
  return Ef.async<IphoneInfo, GoIosError>((resume) => {
    cp.exec(`ios info --udid=${udid}`, (err, stdout, stderr) => {
      if (err) {
        return resume(new GoIosError({ message: err.message }));
      }

      if (stderr) {
        return resume(
          new GoIosError({
            message:
              JSON.parse(stderr).msg ?? "Something went wrong while reading the ios device info",
          }),
        );
      }

      const data = JSON.parse(stdout);
      return resume(
        Ef.succeed({
          name: data.DeviceName,
          os_version: data.ProductVersion,
        }),
      );
    });
  });
}
