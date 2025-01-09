import type { Device } from "$lib/types";

class Devices {
	value: Device[] = $state([]);

	constructor(value: Device[]) {
		this.value = value;
	}
}

export const devices = new Devices([]);
