<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { env } from '$env/dynamic/public';
	import { onMount } from 'svelte';
	import Banner from './Banner.svelte';

	const redirects = [
		{ name: 'All-time XP Contribution', path: '/' },
		{ name: 'Weekly Progress', path: '/weekly' }
	];
</script>

<header class="z-30 md:sticky w-full top-0 px-4 font-fira backdrop-blur-md">
	<div class="flex items-center w-full max-w-7xl mx-auto py-4 border-b border-teal-800/30">
		<!-- <Banner /> -->
		<h1 class="ml-2 font-fira text-xl">Calvish [bean]</h1>
		<div class="flex gap-2 ml-auto border-slate-500">
			{#each redirects as item}
				<a
					href={item.path}
					class="{$page.url.pathname === item.path
						? 'bg-white/20 text-white'
						: ''} block relative px-4 py-2 hover:bg-white/10 font-medium text-sm text-center text-neutral-400 hover:text-white rounded transition-all">
					{item.name}
				</a>
			{/each}
		</div>
	</div>
</header>
