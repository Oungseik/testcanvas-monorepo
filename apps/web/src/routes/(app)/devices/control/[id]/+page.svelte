<script lang="ts">
	import { browser } from "$app/environment";
	import { page } from "$app/state";
	import { PUBLIC_GADS_URL } from "$env/static/public";
	import { devices } from "$lib/stores/devices.svelte";
	import { onMount } from "svelte";

	let shouldShowStream = $state(false);

	const udid = page.params.id;
	const device = $derived(devices.value.find((d) => d.info.udid === udid)!);
	let imageWidth: number = $derived(Number(device?.info.screen_width) / 2.4);
	let imageHeight: number = $derived(
		(imageWidth * Number(device?.info.screen_height)) / Number(device?.info.screen_width)
	);

	onMount(() => {
		let socket: WebSocket;
		if (browser) {
			const protocol = window.location.protocol;
			const wsType = protocol === "http" ? "ws" : "wss";
			socket = new WebSocket(`${wsType}://${window.location.host}/devices/control/${udid}/in-use`);

			socket.onopen = () => {
				console.log("In Use WebSocket connection opened");
			};

			socket.onclose = () => {
				console.log("In Use WebSocket connection closed");
			};

			socket.onerror = (error) => {
				console.error("In Use WebSocket error:", error);
			};

			socket.onmessage = (event) => {
				if (socket.readyState === WebSocket.OPEN) {
					const message = JSON.parse(event.data);
					switch (message.type) {
						case "ping":
							socket.send("admin");
							break;
						case "releaseDevice":
							shouldShowStream = false;
							socket?.close();
							break;
						case "sessionExpired":
							shouldShowStream = false;
							socket?.close();
							break;
					}
				}
			};
		}
		return () => {
			socket?.close();
		};
	});
</script>

<div class="grid min-h-dvh grid-cols-3">
	<div class="col-span-2 mx-auto my-8">
		<div>
			<div class="display">
				<div
					class="artboard artboard-demo rounded-xl border-4 border-base-content"
					style={`width: ${imageWidth}px; height: ${imageHeight}px`}
				>
					{#if device}
						<img
							class="block h-full w-full rounded-lg"
							src={`${PUBLIC_GADS_URL}/device/${udid}/${device?.info.os}-stream-mjpeg`}
							alt="streaming device screen"
							draggable="false"
						/>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>
