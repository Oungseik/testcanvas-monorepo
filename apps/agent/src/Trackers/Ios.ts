import cp from "node:child_process";
import { Signal } from "@/Signal";
import type { Udid } from "@repo/domain";

const diff = <T>(xs: T[], ys: T[]) => xs.filter((x) => !ys.includes(x));

type IosEvent = {
  event: "add" | "remove";
  device: { udid: Udid; type: "real" };
};

class IosTracker extends Signal<IosEvent> {
  constructor() {
    super();

    const ps = cp.spawn("ios", ["listen"]);
    ps.stdout.on("data", (data) =>
      data
        .toString()
        .split("\n")
        .filter((output: string) => output) // since there might be new line, we need to remove empty string
        .forEach((output: string) => {
          const device = JSON.parse(output);
          if (device.MessageType === "Attached") {
            this.notify({
              event: "add",
              device: { udid: device.Properties.SerialNumber as Udid, type: "real" },
            });
          }

          if (device.Message === "Detached") {
            this.notify({ event: "remove", device: { udid: "unknown" as Udid, type: "real" } });
          }
        }),
    );
  }
}

export const tracker = new IosTracker();
