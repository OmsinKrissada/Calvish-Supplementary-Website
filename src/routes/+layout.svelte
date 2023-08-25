<script>
	import Banner from '../components/Banner.svelte';
	import TheNav from '../components/TheNav.svelte';
	import '../app.postcss';

	import { dev } from '$app/environment';
	import { inject } from '@vercel/analytics';
	inject({ mode: dev ? 'development' : 'production' });

	import { fly } from 'svelte/transition';

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
<div style="min-height: 100dvh;" class="fixed min-h-screen w-full bg-black" />
<div
	style="min-height: 100dvh;"
	class="fixed min-h-screen w-full bg-gradient-to-t from-black to-teal-900/50"
/>

<div
	style="min-height: 100dvh;"
	class="flex flex-col lg:flex-row relative min-h-screen p-4 pt-10 sm:p-10 text-slate-200"
>
	<TheNav />
	<div class="relative lg:hidden h-1 w-12 mx-auto my-10 bg-emerald-500 rounded z-10" />
	<div class="relative flex-grow z-10">
		{#key data.currentPath}
			<div in:fly={{ y: -30, duration: 500, delay: 150 }} out:fly={{ y: -30, duration: 250 }}>
				<slot />
			</div>
		{/key}
	</div>
	<Banner />
</div>
<!-- <div class="hidden lg:block lg:fixed bottom-0 h-32 w-full bg-gradient-to-t from-black/40 to-transparent z-10" /> -->
