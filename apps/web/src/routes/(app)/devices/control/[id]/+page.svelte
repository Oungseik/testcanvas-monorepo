<script lang="ts">
	import { page } from "$app/state";
	import { PUBLIC_GADS_URL } from "$env/static/public";
	import { devices } from "$lib/stores/devices.svelte";

	const udid = page.params.id;
	const device = $derived(devices.value.find((d) => d.info.udid === udid)!);

	let imageWidth: number = $derived(Number(device?.info.screen_width) / 2.4);
	let imageHeight: number = $derived(
		(imageWidth * Number(device?.info.screen_height)) / Number(device?.info.screen_width)
	);
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
