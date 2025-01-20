import cp, { type ChildProcessWithoutNullStreams } from "node:child_process";
import { Signal } from "@/Signal";
import { Udid } from "@repo/domain";
import { Data, Effect as Ef, Schema as S } from "effect";

const diff = <T>(xs: T[], ys: T[]) => xs.filter((x) => !ys.includes(x));

const IosListenMsg = S.Struct({
  MessageType: S.Literal("Attached", "Detached"),
  Properties: S.Struct({
    SerialNumber: Udid,
  }),
});

type IosEvent = {
  event: "add" | "remove";
  device: { udid: Udid; type: "real"; name: string; os_version: string; model_number: string };
};

class IosTracker extends Signal<IosEvent> {
  proc: ChildProcessWithoutNullStreams;

  constructor() {
    super();

    this.proc = cp.spawn("ios", ["listen"]);
    this.proc.stdout.on("data", (data) => {
      for (const output of data.toString().split("\n")) {
        if (!output) {
          continue;
        }
        
        // FIXME this decoding process might throw error
        const device = S.decodeUnknownSync(IosListenMsg)(JSON.parse(output));
        if (device.MessageType === "Attached") {
          this.add(device);
        }

        if (device.MessageType === "Detached") {
          // FIXME - detech does not include SerialNumber
          this.remove(device);
        }
      }
    });
  }

  private add(device: typeof IosListenMsg.Type): void {
    const task = getInfo(device.Properties.SerialNumber).pipe(
      Ef.tap((info) => {
        this.notify({
          event: "add",
          device: { ...info, udid: device.Properties.SerialNumber, type: "real" },
        });
      }),
    );
    task.pipe(Ef.tapError(Ef.logError), Ef.runPromise);
  }

  private remove(device: typeof IosListenMsg.Type): void {
    const task = getInfo(device.Properties.SerialNumber).pipe(
      Ef.tap((info) => {
        this.notify({
          event: "remove",
          device: { ...info, udid: device.Properties.SerialNumber, type: "real" },
        });
      }),
    );
    task.pipe(Ef.tapError(Ef.logError), Ef.runPromise);
  }
}

export const tracker = new IosTracker();

export class GoIosError extends Data.TaggedError("GoIosError")<{
  readonly message: string;
}> {}

interface IphoneInfo {
  name: string;
  os_version: string;
  model_number: string;
  product_type: string; // the model name which can relate with the device dimension scraped from gsmarena
}

// TODO: This should be private use only
function getInfo(udid: Udid): Ef.Effect<IphoneInfo, GoIosError, never> {
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
          model_number: data.ModelNumber,
          product_type: data.ProductType,
        }),
      );
    });
  });
}
