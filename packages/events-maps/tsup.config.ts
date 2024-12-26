import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["./src"],
  target: "esnext",
  splitting: true,
  sourcemap: true,
  bundle: false,
  clean: true,
  format: ["esm"],
});
