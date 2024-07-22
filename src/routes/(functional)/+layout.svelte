<script lang="ts">
	import Banner from '$lib/components/Banner.svelte';

	import { dev } from '$app/environment';
	import { inject } from '@vercel/analytics';
	inject({ mode: dev ? 'development' : 'production' });

	import { fly } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { env } from '$env/dynamic/public';
	import TheNav from '$lib/components/TheNav.svelte';

	export let data;

	let touchCounter = 0;
	let globalTouchBuffer = 0;

	let globalTouchCount: number | null = null;

	function updateTouchCounter() {
		touchCounter++;
		globalTouchBuffer++;
		localStorage.setItem('touchCounter', `${touchCounter}`);
	}

	onMount(() => {
		const count = +(localStorage.getItem('touchCounter') ?? 0);
		if (!isNaN(count)) {
			touchCounter = count;
		}

		setInterval(async () => {
			if (globalTouchBuffer <= 0) return;
			fetch(env.PUBLIC_ENDPOINT + '/grass', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ count: globalTouchBuffer })
			})
				.then((res) => res.json())
				.then((data) => (globalTouchCount = data.globalCount));
			globalTouchBuffer = 0;
		}, 1000);

		fetch(env.PUBLIC_ENDPOINT + '/grass')
			.then((res) => res.json())
			.then((data) => (globalTouchCount = data.globalCount));
	});
</script>

<!-- <div class="min-h-screen bg-[#1A202C]"> -->
<!-- <div> -->
<div
	style="min-height: 100dvh;"
	class="fixed min-h-screen w-full bg-black/50 bg-[url('/balloon.webp')] bg-blend-darken" />

<div style="min-height: 100dvh;" class="flex flex-col relative min-h-screen text-slate-200">
	<TheNav />
	<!-- <slot /> -->
	{#if globalTouchCount !== null}
		<div class="z-30 hidden xl:block fixed left-6 bottom-4">
			<p class="font-semibold text-center text-xl text-lime-300 tracking-widest">
				GRASS <span class="text-xs tracking-normal">(touch it)</span>
			</p>
			{#if touchCounter > 0}
				<p class="text-center text-xs text-lime-200">
					You touched grass {Intl.NumberFormat('en').format(touchCounter)} times
				</p>
				<p class="text-center text-xs text-lime-200">
					Global count: {Intl.NumberFormat('en').format(globalTouchCount)} times
				</p>
			{/if}
			<button on:click={updateTouchCounter}>
				<img
					class="mt-2 shadow-2xl shadow-lime-500/30 rounded-full active:scale-90"
					src="https://images.unsplash.com/photo-1533460004989-cef01064af7e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z3Jhc3N8ZW58MHx8MHx8fDA%3D&w=230&q=80"
					alt="" />
			</button>
		</div>
	{/if}

	<div
		class="relative flex-grow w-full max-w-7xl py-10 my-8 mx-auto rounded-xl z-10 bg-gray-950/70 backdrop-blur-lg shadow-lg shadow-black/30">
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
</div>

<!-- <div class="hidden lg:block lg:fixed bottom-0 h-32 w-full bg-gradient-to-t from-black/40 to-transparent z-10" /> -->
