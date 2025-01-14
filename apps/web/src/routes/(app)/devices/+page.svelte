<script lang="ts">
import { devices } from "$lib/stores/devices.svelte";
import Mobile from "$lib/components/svg/Mobile.svelte";

const availableDevices = $derived(devices.value.filter((d) => d.available));
</script>

<section class="px-4">
	<div class="flex gap-8">
		<p class="text-sm opacity-50">
			TOTAL: {devices.value.length}
			{devices.value.length === 1 ? "DEVICE" : "DEVICES"}
		</p>
		<p class="text-sm opacity-50">
			AVAILABLE: {availableDevices.length}
			{availableDevices.length === 1 ? "DEVICE" : "DEVICES"}
		</p>
	</div>
	<div class="divider mt-0"></div>
</section>
<section class="grid grid-cols-3 gap-4 px-4 xl:grid-cols-5">
	{#each devices.value as d (d.info.udid)}
		<div
			class="flex h-auto flex-row flex-nowrap justify-between rounded-md py-4 pl-4 pr-0 text-left font-normal shadow-md"
		>
			<div>
				<h2 class="text-lg font-bold">{d.info.name}</h2>
				<p class="text-sm">{d.info.os} {d.info.os_version}</p>
				{#if !d.available}
					<div class="btn-disable btn mt-4 cursor-not-allowed opacity-70">Offline</div>
				{:else if d.is_running_automation}
					<div class="btn btn-warning mt-4 cursor-not-allowed opacity-70">Running Automation</div>
				{:else if d.in_use}
					<div class="btn btn-warning mt-4 cursor-not-allowed opacity-70">In use</div>
				{:else if !d.in_use}
					<a href={`/devices/control/${d.info.udid}`} class="btn btn-success mt-4">Available</a>
				{/if}
			</div>
			<Mobile width="6rem" height="6rem" />
		</div>
	{/each}
</section>
