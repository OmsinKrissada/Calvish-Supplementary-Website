<script lang="ts">
	import { env } from '$env/dynamic/public';
	import TheNav from '$lib/components/TheNav.svelte';
	import '../app.postcss';
</script>

<svelte:head>
	<title>Calvish Guild</title>
	<!-- <Meta name="twitter:title" content="Calvish Guild" />
		<Meta name="og:type" content="website" />
		<Meta name="og:title" content="Calvish Guild" /> -->
</svelte:head>

<!-- <div class="min-h-screen bg-[#1A202C]"> -->
<!-- <div> -->
<!-- <div style="min-height: 100dvh;" class="fixed min-h-screen w-ful" /> -->

<div style="min-height: 100dvh;" class="flex flex-col relative min-h-screen text-slate-200">
	<slot />
	<!-- <div class="my-10 relative flex-grow z-10">
		{#if !env.PUBLIC_DISABLED}
			{#key data.currentPath}
				<div in:fly={{ y: -30, duration: 500, delay: 250 }} out:fly={{ y: -30, duration: 250 }}>
				</div>
			{/key}
		{:else}
			<div class="font-medium text-center">
				😢 Sorry, I intentionally disabled the site on purpose for the following reason(s):
				<span class="font-normal text-neutral-400"
					>{env.PUBLIC_DISABLE_REASON || '(none given)'}</span>
			</div>
		{/if}
	</div> -->
</div>
