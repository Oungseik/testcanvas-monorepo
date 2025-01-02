import { Signal } from "@/Signal";
import { Adb, type Device } from "@devicefarmer/adbkit";

interface AndroidEvent {
  event: "add" | "change" | "remove";
  device: Device;
}

class AndroidTracker extends Signal<AndroidEvent> {}
export const tracker = new AndroidTracker();
export const client = Adb.createClient();

const tracking = () =>
  new Promise((_, reject) => {
    client
      .trackDevices()
      .then((t) => {
        t.on("add", (device: Device) => tracker.notify({ event: "add", device }));
        t.on("change", (device) => tracker.notify({ event: "change", device }));
        t.on("remove", (device: Device) => tracker.notify({ event: "remove", device }));
      })
      .catch(reject);
  });

// tracking with retry
tracking().catch(tracking);
