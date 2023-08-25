<script lang="ts">
	import { invalidate, invalidateAll } from '$app/navigation';
	import { timestamp } from '$lib/stores';
	import { onDestroy, onMount } from 'svelte';
	import Chart from '../../components/Chart.svelte';
	import Countdown from '../../components/Countdown.svelte';
	import { env } from '$env/dynamic/public';
	import type { PlayerScore } from '$lib/types';
	import EventInfoDialog from '../../components/EventInfoDialog.svelte';

	export let data;

	// invalidate();

	const formatter = Intl.NumberFormat('en', {
		useGrouping: true,
		maximumFractionDigits: 2
	});

	function getNth(n: number) {
		if ((n - 1) % 10 === 0) return 'st';
		if ((n - 2) % 10 === 0) return 'nd';
		if ((n - 3) % 10 === 0) return 'rd';
		return 'th';
	}

	let interval: number;
	let scores: PlayerScore[];
	async function fetchScore() {
		return (await (
			await fetch(env.PUBLIC_ENDPOINT + '/event/weekly/score')
		).json()) as PlayerScore[];
	}
	onMount(async () => {
		scores = await fetchScore();
		interval = setInterval(async () => {
			scores = await fetchScore();
		}, 3000);
	});

	onDestroy(() => clearInterval(interval));
</script>

<div class="flex flex-col items-center max-w-6xl mx-auto">
	<EventInfoDialog />

	{#await data.streamed.nextReset}
		<div />
	{:then nextReset}
		<Countdown to={nextReset} />
	{/await}

	<div class="w-full h-48 lg:w-10/12 mb-2">
		{#if scores}
			<Chart {scores} />
		{/if}
	</div>

	<p class="ml-auto mb-4 text-neutral-400">Data automatically refreshes!</p>

	<!-- skeleton -->
	{#if !scores}
		<div class="grid gap-6 grid-cols-[repeat(auto-fit,minmax(300px,1fr))] w-full">
			{#each { length: 40 } as _, i}
				<div
					class="relative flex items-center px-6 py-2 bg-black/10 border-2 border-neutral-700 rounded"
				>
					<!-- player head -->
					<div class="h-28 w-14 mr-6 my-2 bg-neutral-700 rounded-md animate-pulse" />

					<div class="space-y-[0.625rem]">
						<div class="w-20 min-h-[14px] my-[3px] bg-neutral-500 rounded-md animate-pulse" />
						<div
							class="w-16 min-h-[14px] my-[3px] bg-emerald-800 text-neutral-400 rounded-md animate-pulse"
						/>

						<div
							class="w-32 min-h-[14px] my-[3px] bg-neutral-600 text-neutral-400 rounded-md animate-pulse"
						/>

						<div
							class="w-28 min-h-[14px] my-[3px] bg-neutral-600 text-neutral-400 rounded-md animate-pulse"
						/>

						<!-- <div
						class="w-20 min-h-[14px] my-[3px] bg-neutral-600 text-neutral-400 rounded-md animate-pulse" /> -->
					</div>
				</div>
			{/each}
		</div>
	{:else}
		<!-- actual one -->
		<div class="grid gap-6 grid-cols-[repeat(auto-fit,minmax(300px,1fr))] w-full">
			{#each scores as player, i (player.uuid)}
				<div
					class="relative flex items-center px-6 py-2 bg-black/10 border-2 border-neutral-700 rounded"
					class:brightness-50={player.score == 0}
				>
					<!-- absolutely positioned box -->
					{#if player.score > 0}
						<div class="absolute md:-top-4 md:-left-4 -top-2 -left-2">
							{#if i == 0}
								<img
									src="https://lh3.googleusercontent.com/0CHvIkhgSfKcZp0CLKqjfv-mLiXZUlVu8LGNm7SIsFfL6HCdZhZsySLv6pbSOBQZ667r6BAAp_lJVbwMhtSkRaikqEMBk8TuI1Y=s400"
									alt=""
									class="w-10 -rotate-12"
								/>
							{:else}
								<div
									class="flex justify-center items-center w-[2.25rem] h-[2.25rem] mr-2 font-medium text-center bg-sky-800 rounded-full"
								>
									<p>
										{i + 1}<span class="align-super text-xs">{getNth(i + 1)}</span>
									</p>
								</div>
							{/if}
						</div>
					{/if}

					{#if player.online}
						<div class="absolute top-4 right-4 flex items-center">
							<img
								src="https://static.wikia.nocookie.net/minecraft_gamepedia/images/3/38/Experience_Orb.gif"
								class="w-5 mr-1"
								alt=""
							/>
							<p>
								{player.online}
							</p>
						</div>
					{/if}

					<img
						src="https://mc-heads.net/body/{player.uuid}"
						alt=""
						loading="lazy"
						class="h-32 mr-6 rounded-sm"
					/>
					<div>
						<div class="font-bold text-xs text-neutral-500">
							{player.rank}
						</div>

						<p class="inline font-medium">
							{player.username}
						</p>

						<p class="text-emerald-400">
							{formatter.format(player.score)} points
						</p>
						<p class="text-neutral-400">
							Contributed
							<span class="text-white">{formatter.format(player.progress.contributed)}</span>
							XP
						</p>
						<p class="text-neutral-400">
							Play time:
							<span class="text-white">{player.progress.playtime}</span>
							hrs
						</p>
						<!-- <p class="text-neutral-400">
							War:
							<span class="text-white">{{
								player.progress.wars
							}}</span>
							times
						</p> -->
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
