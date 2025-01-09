<script lang="ts">
	import { browser } from "$app/environment";
	import { page } from "$app/state";
	import { PUBLIC_GADS_URL } from "$env/static/public";
	import { onMount } from "svelte";
	import type { PageServerData } from "./$types";

	const { data }: { data: PageServerData } = $props();

	let shouldShowStream = $state(false);

	const udid = page.params.id;
	let imageWidth: number = $derived(Number(data.info.screen_width) / 2.4);
	let imageHeight: number = $derived(
		(imageWidth * Number(data.info.screen_height)) / Number(data.info.screen_width)
	);

	onMount(() => {
		let socket: WebSocket;
		if (browser) {
			const protocol = window.location.protocol;
			const socketUrl = new URL(PUBLIC_GADS_URL);
			socketUrl.protocol = protocol === "https" ? "wss" : "ws";
			socketUrl.pathname = `/devices/control/${udid}/in-use`;
			socket = new WebSocket(socketUrl);

			socket.addEventListener("open", () => console.info("In Use WebSocket connection opened"));
			socket.addEventListener("close", () => console.info("In Use WebSocket connection closed"));
			socket.addEventListener("error", (error) => console.error("In Use WebSocket error:", error));

			socket.addEventListener("message", (event) => {
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
			});
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
					<img
						class="block h-full w-full rounded-lg"
						src={`${PUBLIC_GADS_URL}/device/${udid}/${data.info.os}-stream-mjpeg`}
						alt="streaming device screen"
						draggable="false"
					/>
				</div>
			</div>
		</div>
	</div>
</div>
