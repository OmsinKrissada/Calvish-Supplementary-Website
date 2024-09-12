<script lang="ts">
	import Banner from '$lib/components/Banner.svelte';
	import TheNav from '$lib/components/TheNav.svelte';
	import '../app.postcss';

	import { dev } from '$app/environment';
	import { inject } from '@vercel/analytics';
	inject({ mode: dev ? 'development' : 'production' });
	import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';
	injectSpeedInsights();

	import { fly } from 'svelte/transition';
	import { env } from '$env/dynamic/public';
	import Grass from '$lib/components/Grass.svelte';

	export let data;
</script>

<svelte:head>
	<title>Calvish Guild</title>
	<!-- <Meta name="twitter:title" content="Calvish Guild" />
		<Meta name="og:type" content="website" />
		<Meta name="og:title" content="Calvish Guild" /> -->
</svelte:head>

<!-- <div class="min-h-screen bg-[#1A202C]"> -->
<!-- <div> -->
<div
	style="min-height: 100dvh;"
	class="fixed min-h-screen w-full bg-gradient-to-t from-black to-teal-900/50" />

<div style="min-height: 100dvh;" class="flex flex-col relative min-h-screen text-slate-200">
	<TheNav />
	<Grass />

	<!-- <div class="relative lg:hidden h-1 w-12 mx-auto my-10 bg-emerald-500 rounded z-10" /> -->
	<div class="my-10 relative flex-grow z-10">
		{#if !env.PUBLIC_DISABLED}
			{#key data.currentPath}
				<div in:fly={{ y: -30, duration: 500, delay: 250 }} out:fly={{ y: -30, duration: 250 }}>
					<slot />
				</div>
			{/key}
		{:else}
			<div class="font-medium text-center">
				😢 Sorry, I intentionally disabled the site on purpose for the following reason(s):
				<span class="font-normal text-neutral-400"
					>{env.PUBLIC_DISABLE_REASON || '(none given)'}</span>
			</div>
		{/if}
	</div>
	<!-- <Banner /> -->
</div>

<!-- <div class="hidden lg:block lg:fixed bottom-0 h-32 w-full bg-gradient-to-t from-black/40 to-transparent z-10" /> -->
