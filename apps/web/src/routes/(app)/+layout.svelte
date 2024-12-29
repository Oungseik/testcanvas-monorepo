<script lang="ts">
	import { socket } from "$lib/stores/socket.svelte";
	import { page } from "$app/state";
	import Logo from "$lib/components/svg/Logo.svelte";
	import Dashboard from "$lib/components/svg/Dashboard.svelte";
	import Automation from "$lib/components/svg/Automation.svelte";
	import Devices from "$lib/components/svg/Devices.svelte";
	import Monitoring from "$lib/components/svg/Monitoring.svelte";
	import FileLibrary from "$lib/components/svg/FileLibrary.svelte";
	import type { LayoutData } from "./$types";
	import type { Snippet } from "svelte";
	import { PUBLIC_SOCKET_URL } from "$env/static/public";
	import { io } from "socket.io-client";
	import { browser } from "$app/environment";

	let { data, children }: { data: LayoutData; children: Snippet } = $props();

	let hideDrawer =
		page.url.pathname.startsWith("/monitoring") && page.url.pathname.split("/").length === 3;

	if (browser) {
		socket.socket = io(PUBLIC_SOCKET_URL, {
			transports: ["websocket"],
			auth: { token: data.token }
		});
	}

	$effect(() => {
		socket?.socket?.emit("Users:GetInfo", {}, (user) => {
			console.log(user);
		});
		return () => socket?.socket?.disconnect();
	});
</script>

<div class={"drawer" + (hideDrawer ? "" : " drawer-open")}>
	<input id="main-drawer" type="checkbox" class="drawer-toggle" />
	<div class="drawer-content">
		<!-- Page content here -->
		{@render children()}
		<!-- Page content end here -->
		<!-- <label for="main-drawer" class="btn btn-primary drawer-button lg:hidden">Open drawer</label> -->
	</div>
	<div class="drawer-side">
		<label for="main-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
		<div class="menu flex min-h-full w-60 flex-col gap-8 bg-base-200 p-4 text-base-content">
			<!-- Sidebar content here -->
			<h1 class="text-2xl font-bold">
				<Logo class="inline-block" width="3rem" height="3rem" />logo
			</h1>

			<ul class="flex-grow">
				<li><a href="/dashboard"><Dashboard />Dashboard</a></li>
				<li><a href="/automation"><Automation />Automation</a></li>
				<li><a href="/devices"><Devices />Devices</a></li>
				<li><a href="monitoring"><Monitoring />Monitoring</a></li>
				<li><a href="/files-library"><FileLibrary />Files Library</a></li>
			</ul>

			<div>
				<a class="text-xl" href="/profile">Tester</a>
			</div>
			<!-- sidebar content end here -->
		</div>
	</div>
</div>
