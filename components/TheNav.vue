<script setup lang="ts">
const route = useRoute();
const redirects = [
	{ name: 'Leaderboard', path: '/' },
	{ name: 'Event', path: '/event' },
];
</script>

<template>
	<header class="lg:h-full lg:w-fit z-50">
		<h1 class="font-fira text-center text-3xl">Calvish [bean]</h1>
		<div class="mt-2 pt-4 lg:pl-4 space-y-2 border-slate-500">
			<NuxtLink v-for="item in redirects" :href="item.path"
				class="block relative px-4 py-2 hover:bg-neutral-800 text-center lg:text-left text-neutral-400 hover:text-white rounded transition-all">
				{{ item.name }}
			</NuxtLink>
		</div>
	</header>
</template>

<style scoped>
.router-link-active {
	@apply underline underline-offset-8 font-medium text-white
}
</style>