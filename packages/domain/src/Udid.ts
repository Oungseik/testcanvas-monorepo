import { Schema } from "effect";

export const Udid = Schema.String.pipe(
  Schema.brand("Udid"),
  Schema.annotations({
    title: "Udid",
    description: "Device's udid",
  }),
);

export type Udid = typeof Udid.Type;
