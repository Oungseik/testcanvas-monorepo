import { Schema as S } from "effect";
import { effect } from "sveltekit-superforms/adapters";
import type { PageServerLoad, Actions } from "./$types";
import { Email } from "@repo/domain";
import { superValidate, fail, message } from "sveltekit-superforms";
import { redirect } from "@sveltejs/kit";
import { PUBLIC_BACKEND_URL } from "$env/static/public";
import { Api } from "@repo/api";
import { HttpApiClient, FetchHttpClient } from "@effect/platform";
import { Effect as Ef } from "effect";

const schema = S.Struct({ email: Email, password: S.String });

export const load = (async () => {
  const form = await superValidate(effect(schema));
  return { form };
}) satisfies PageServerLoad;

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const form = await superValidate(request, effect(schema));

    if (!form.valid) {
      return fail(400, { form });
    }

    const task = Ef.gen(function* () {
      const client = yield* HttpApiClient.make(Api, { baseUrl: PUBLIC_BACKEND_URL });
      const { token } = yield* client.authentication.loginTester({ payload: { ...form.data } });
      cookies.set("token", token, { path: "/" });
      cookies.set("email", form.data.email, { path: "/" });
    }).pipe(
      Ef.catchTags({
        UnprocessableContent: (e) => Ef.sync(() => message(form, e.message, { status: 400 })),
        RequestError: (e) => Ef.sync(() => message(form, e.message, { status: 500 })),
        ResponseError: (e) => Ef.sync(() => message(form, e.message)),
        HttpApiDecodeError: (e) => Ef.sync(() => message(form, e.message)),
        NotFound: () =>
          Ef.sync(() => message(form, "Incorrect email or password", { status: 400 })),
        InternalServerError: () =>
          Ef.sync(() => message(form, "Service unavaliable", { status: 500 })),
      }),
      Ef.scoped,
      Ef.provide(FetchHttpClient.layer),
    );

    const result = await Ef.runPromise(task);
    return result ?? redirect(302, "/");
  },
};
