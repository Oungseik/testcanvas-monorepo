<script lang="ts">
	import { devices } from "$lib/stores/devices.svelte";
	import Mobile from "$lib/components/svg/Mobile.svelte";
</script>

<section class="px-4">
	<div>
		<p class="text-sm opacity-50">
			TOTAL: {0}
			{"DEVICES"}
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
				<a
					href={`/control/${d.info.udid}`}
					class={"btn mt-4" + (d.available ? " btn-success" : " btn-disable opacity-50")}
					>{d.available ? "Available" : "Offline"}</a
				>
			</div>
			<Mobile width="6rem" height="6rem" />
		</div>
	{/each}
</section>
