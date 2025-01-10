<script lang="ts">
	import { browser } from "$app/environment";
	import { page } from "$app/state";
	import { PUBLIC_GADS_URL } from "$env/static/public";
	import { onMount } from "svelte";
	import type { PageServerData } from "./$types";
	import Control from "./Control.svelte";

	const RESIZE_RATIO = 2.4;
	const { data }: { data: PageServerData } = $props();
	const udid = page.params.id;
	const isReady = fetch(`${PUBLIC_GADS_URL}/device/${udid}/health`);

	let screen: HTMLDivElement;
	let image: HTMLImageElement;
	let deviceX = Number(data.info.screen_width);
	let deviceY = Number(data.info.screen_height);
	let isPortrait = $state(true);

	let streamUrl = `${PUBLIC_GADS_URL}/device/${udid}/${data.info.os}-stream-mjpeg`;

	let imageWidth = $state(0);
	let imageHeight = $state(0);

	onMount(() => {
		const updateCanvasDimensions = () => {
			if (isPortrait) {
				imageWidth = Number(data.info.screen_width) / RESIZE_RATIO;
				imageHeight =
					(imageWidth * Number(data.info.screen_height)) / Number(data.info.screen_width);
			} else {
				imageHeight = Number(data.info.screen_width) / RESIZE_RATIO;
				imageWidth =
					(imageWidth * Number(data.info.screen_height)) / Number(data.info.screen_width);
			}
		};

    // only trigger after ready, if not the health check was cancelled.
			image.src = "";
			updateCanvasDimensions();
			image.src = streamUrl;

			window.addEventListener("resize", updateCanvasDimensions);

		return () => {
			window.stop();
			window.removeEventListener("resize", updateCanvasDimensions);
		};
	});

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
					if (message.type === "ping") {
						socket.send("admin");
					} else if (message.type === "releaseDevice") {
						socket?.close();
					} else if (message.type === "sessionExpired") {
						socket?.close();
					}
				}
			});
		}

		return () => socket?.close();
	});

	function getCursorCoord(
		e: MouseEvent & { currentTarget: EventTarget & HTMLDivElement }
	): [number, number] {
		const cachedRect = screen.getBoundingClientRect();
		const absoluteX = Math.round(e.clientX - cachedRect.left);
		const absoluteY = Math.round(e.clientY - cachedRect.top);
		const x = absoluteX / cachedRect.width;
		const y = absoluteY / cachedRect.height;
		return [x, y];
	}

	let tapStartAt: number;
	let tapEndAt: number;
	let coord1: [number, number];
	let coord2: [number, number];

	function handleMouseDown(e: MouseEvent & { currentTarget: EventTarget & HTMLDivElement }) {
		tapStartAt = new Date().getTime();
		coord1 = getCursorCoord(e);
	}

	function handleMouseUp(e: MouseEvent & { currentTarget: EventTarget & HTMLDivElement }) {
		tapEndAt = new Date().getTime();
		coord2 = getCursorCoord(e);
		const mouseEventsTimeDiff = tapEndAt - tapStartAt;

		if (
			(mouseEventsTimeDiff > 300 && Math.abs(coord2[0] - coord1[0]) > 0.1) ||
			Math.abs(coord2[1] - coord1[1]) > 0.1
		) {
			swipeCoordinates(coord1, coord2);
		} else if (mouseEventsTimeDiff < 500) {
			tapCoordinates(coord1);
		} else {
			touchAndHoldCoordinates(coord1);
		}
	}

	function swipeCoordinates(coord1: [number, number], coord2: [number, number]) {
		let x1 = coord1[0];
		let y1 = coord1[1];
		let x2 = coord2[0];
		let y2 = coord2[1];
		let finalX1: number;
		let finalY1: number;
		let finalX2: number;
		let finalY2: number;

		if (isPortrait) {
			finalX1 = x1 * deviceX;
			finalY1 = y1 * deviceY;
			finalX2 = x2 * deviceX;
			finalY2 = y2 * deviceY;
		} else {
			finalX1 = x1 * deviceY;
			finalY1 = y1 * deviceX;
			finalX2 = x2 * deviceY;
			finalY2 = y2 * deviceX;
		}

		let body = JSON.stringify({
			x: finalX1,
			y: finalY1,
			endX: finalX2,
			endY: finalY2
		});

		fetch(`${PUBLIC_GADS_URL}/device/${udid}/swipe`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body
		}).catch((error) => {
			if (error.response) {
				if (error.response.status === 404) {
					// showCustomSnackbarError('Swipe failed - Appium session has expired!')
				} else {
					// showCustomSnackbarError('Swipe failed!')
				}
			} else {
				// showCustomSnackbarError('Swipe failed!')
			}
		});
	}

	function tapCoordinates(pos: [number, number]) {
		// set initial x and y tap coordinates
		let x = pos[0];
		let y = pos[1];
		let finalX: number;
		let finalY: number;

		if (isPortrait) {
			finalX = x * deviceX;
			finalY = y * deviceY;
		} else {
			finalX = x * deviceY;
			finalY = y * deviceX;
		}

		let body = JSON.stringify({
			x: finalX,
			y: finalY
		});

		fetch(`${PUBLIC_GADS_URL}/device/${udid}/tap`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body
		}).catch((error) => {
			if (error.response) {
				if (error.response.status === 404) {
					// showCustomSnackbarError('Tap failed - Appium session has expired!')
				} else {
					// showCustomSnackbarError('Tap failed!')
				}
			} else {
				// showCustomSnackbarError('Tap failed!')
			}
		});
	}

	function touchAndHoldCoordinates(pos: [number, number]) {
		let x = pos[0];
		let y = pos[1];
		let finalX: number;
		let finalY: number;

		if (isPortrait) {
			finalX = x * deviceX;
			finalY = y * deviceY;
		} else {
			finalX = x * deviceY;
			finalY = y * deviceX;
		}

		let body = JSON.stringify({
			x: finalX,
			y: finalY
		});

		fetch(`${PUBLIC_GADS_URL}/device/${udid}/touchAndHold`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body
		}).catch((error) => {
			if (error.response) {
				if (error.response.status === 404) {
					// showCustomSnackbarError('Touch & Hold failed - Appium session has expired!')
				} else {
					// showCustomSnackbarError('Touch & Hold failed!')
				}
			} else {
				// showCustomSnackbarError('Touch & Hold failed!')
			}
		});
	}
</script>

<div class="relative grid min-h-dvh grid-cols-3">
	{#await isReady}
		<div
			class="absolute left-0 top-0 z-10 flex h-full w-full items-center justify-center gap-4 bg-base-300/40"
		>
			<p class="text-4xl">Loading</p>
			<p class="loading loading-dots loading-lg mt-4"></p>
		</div>
	{/await}
	<div class="absolute left-4 top-1/4">
		<Control {udid} />
	</div>
	<div class="col-span-2 mx-auto my-8">
		<div>
			<div class="display">
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div
					bind:this={screen}
					onmousedown={handleMouseDown}
					onmouseup={handleMouseUp}
					class="artboard artboard-demo relative rounded-xl border-4 border-base-content"
					style={`width: ${imageWidth}px; height: ${imageHeight}px`}
				>
					<img
						bind:this={image}
						class="block h-full w-full rounded-lg"
						src={streamUrl}
						alt="streaming device screen"
						draggable="false"
					/>
				</div>
			</div>
		</div>
	</div>
</div>
