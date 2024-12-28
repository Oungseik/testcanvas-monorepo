import type { AppSocket } from "$lib/types";

export const socket: { socket: AppSocket | null } = $state({
	socket: null
});
