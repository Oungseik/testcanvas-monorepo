import type { PageServerLoad } from "./$types";
import { PUBLIC_GADS_URL } from "$env/static/public";
import type { DeviceInfo } from "$lib/types";
import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ params }) => {
	const infoUrl = `${PUBLIC_GADS_URL}/device/${params.id}/info`;

	const info: DeviceInfo | null = await fetch(infoUrl).then((res) =>
		res.status === 200 ? res.json() : null
	);
	if (!info) {
		redirect(302, "/devices");
	}
	return { info };
};
