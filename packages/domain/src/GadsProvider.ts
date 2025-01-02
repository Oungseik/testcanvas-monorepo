import { Schema as S } from "effect";

const Base = S.Struct({
  os: S.Literal("windows", "linux", "darwin"),
  nickname: S.String,
  host_address: S.String,
  port: S.Int,
  use_selenium_grid: S.Literal(true),
  selenium_grid: S.String,
});

export const AndroidProvider = S.extend(
  Base,
  S.Struct({
    provide_android: S.Literal(true),
  }),
);
export type AndroidProvider = typeof AndroidProvider.Type;

export const IosProvider = S.extend(
  Base,
  S.Struct({
    provide_ios: S.Literal(true),
    wda_bundle_id: S.String,
    wda_repo_path: S.String,
    use_custom_wda: S.Boolean,
    supervision_password: S.String.pipe(S.UndefinedOr),
  }),
);
export type IosProvider = typeof IosProvider.Type;
