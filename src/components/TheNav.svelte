<script lang="ts">
	import { page } from '$app/stores';

	const redirects = [
		{ name: 'All-time XP Contribution', path: '/' },
		{ name: 'Weekly Progress', path: '/weekly' }
	];
</script>

<header class="lg:sticky lg:h-full lg:w-fit top-10 lg:mr-8 z-50">
	<h1 class="font-fira text-center lg:text-left text-3xl">Calvish [bean]</h1>
	<div class="mt-2 pt-4 lg:pl-4 space-y-2 border-slate-500">
		{#each redirects as item}
			<a
				href={item.path}
				class="{$page.url.pathname === item.path
					? 'bg-white/20 text-white'
					: ''} block relative px-4 py-2 hover:bg-white/10 font-medium text-center lg:text-left text-neutral-400 hover:text-white rounded transition-all"
			>
				{item.name}
			</a>
		{/each}
	</div>
</header>
