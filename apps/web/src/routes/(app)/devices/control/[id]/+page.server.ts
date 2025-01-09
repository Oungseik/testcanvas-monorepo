import type { PageServerLoad } from "./$types";
import { PUBLIC_GADS_URL } from "$env/static/public";

export const load: PageServerLoad = async ({ params }) => {
	const infoUrl = `${PUBLIC_GADS_URL}/device/${params.id}/info`;

	const info = fetch(infoUrl).then((res) => res.json());
	console.log(info);
	return info;
};
