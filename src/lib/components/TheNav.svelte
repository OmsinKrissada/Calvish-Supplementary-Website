<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	const redirects = [
		{ name: 'All-time XP Contribution', path: '/' },
		{ name: 'Weekly Progress', path: '/weekly' }
	];

	let touchCounter = 0;

	function updateTouchCounter() {
		touchCounter++;
		localStorage.setItem('touchCounter', `${touchCounter}`);
	}
	onMount(() => {
		const count = +(localStorage.getItem('touchCounter') ?? 0);
		if (!isNaN(count)) {
			touchCounter = count;
		}
	});
</script>

<header class="lg:sticky lg:h-screen lg:w-fit top-10 bottom-10 lg:mr-8 z-50">
	<h1 class="font-fira text-center lg:text-left text-3xl">Calvish [bean]</h1>
	<div class="mt-2 pt-4 lg:pl-4 space-y-2 border-slate-500">
		{#each redirects as item}
			<a
				href={item.path}
				class="{$page.url.pathname === item.path
					? 'bg-white/20 text-white'
					: ''} block relative px-4 py-2 hover:bg-white/10 font-medium text-center lg:text-left text-neutral-400 hover:text-white rounded transition-all">
				{item.name}
			</a>
		{/each}
	</div>
	<div class="absolute bottom-20">
		<p class="font-semibold text-center text-xl text-green-300 tracking-widest">
			GRASS <span class="text-xs tracking-normal">(touch it)</span>
		</p>
		{#if touchCounter > 0}
			<p class="text-center text-green-300">You touched grass {touchCounter} times</p>
		{/if}
		<button on:click={updateTouchCounter}>
			<img
				class="mt-4 shadow-2xl shadow-green-500 rounded-full"
				src="https://images.unsplash.com/photo-1533460004989-cef01064af7e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z3Jhc3N8ZW58MHx8MHx8fDA%3D&w=230&q=80"
				alt="" />
		</button>
	</div>
</header>
