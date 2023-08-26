<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import Chart from '$lib/components/Chart.svelte';
	import Countdown from '$lib/components/Countdown.svelte';
	import { env } from '$env/dynamic/public';
	import type { MinimalPlayerScore, PlayerScore } from '$lib/types';
	import EventInfoDialog from '$lib/components/EventInfoDialog.svelte';
	import {
		Listbox,
		ListboxButton,
		ListboxOption,
		ListboxOptions,
		Transition
	} from '@rgossiaux/svelte-headlessui';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { CheckCircle, ChevronUpDown } from '@steeze-ui/heroicons';
	import { format, subDays } from 'date-fns';
	import { fade, fly } from 'svelte/transition';

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
	let currentScores: PlayerScore[];
	let displayScores: MinimalPlayerScore[] | null = null;
	$: scores = (displayScores || currentScores) as (PlayerScore | MinimalPlayerScore)[];

	let weeks: { id: number; start: string; end: string }[];
	let selectedWeek: { id: any; start: string; end: string };
	$: if (selectedWeek) {
		if (selectedWeek.id === weeks[0].id) {
			displayScores = null;
		} else {
			const id = selectedWeek.id;
			// displayScores = [];
			fetch(env.PUBLIC_ENDPOINT + `/weekly/score/${selectedWeek.id}`)
				.then((res) => res.json())
				.then((data) => {
					if (selectedWeek.id === id) return (displayScores = data);
				});
		}
	}
	async function fetchScore() {
		return (await (await fetch(env.PUBLIC_ENDPOINT + '/weekly/score')).json()) as PlayerScore[];
	}
	onMount(async () => {
		currentScores = await fetchScore();
		interval = setInterval(async () => {
			currentScores = await fetchScore();
		}, 10000);

		const weeksRes = (await (await fetch(env.PUBLIC_ENDPOINT + '/weekly/weeks')).json()) as {
			id: number;
			createdAt: string;
			endAt: string;
		}[];
		weeks = weeksRes
			.map((w) => {
				return {
					id: w.id,
					start: format(new Date(w.createdAt), 'MMM dd'),
					end: w.endAt ? format(subDays(new Date(w.endAt), 1), 'MMM dd') : 'Now (Real-time)'
				};
			})
			.reverse();
		selectedWeek = weeks[0];
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

	<div class="w-full h-48 mb-4">
		{#if scores}
			<Chart {scores} />
		{/if}
	</div>

	<div class="flex items-center ml-auto mb-4">
		<!-- <p class="text-neutral-400">Data automatically refreshes!</p> -->
		<Listbox class="relative text-sm" disabled={!selectedWeek} bind:value={selectedWeek}>
			<ListboxButton class="relative w-56 px-3 py-2 bg-white text-left rounded-md">
				<span class="font-medium text-gray-600 truncate"
					>{selectedWeek
						? `${selectedWeek.start} - ${selectedWeek.end}`
						: 'Loading records...'}</span>
				<span class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
					<Icon src={ChevronUpDown} size="24" />
				</span>
			</ListboxButton>
			<Transition
				enter="transition ease-in duration-100"
				enterFrom="opacity-0 -translate-y-2"
				enterTo="opacity-100"
				leave="transition ease-in duration-100"
				leaveFrom="opacity-100"
				leaveTo="opacity-0 -translate-y-2">
				<ListboxOptions class="absolute inset-x-0 mt-2 py-1 bg-white rounded-md z-10">
					{#each weeks as week (week.id)}
						<ListboxOption let:selected value={week}>
							<div
								class="flex items-center px-3 py-2 hover:bg-teal-100 text-black hover:text-teal-800 cursor-pointer"
								class:font-medium={selected}
								class:text-teal-600={selected}>
								<p class="inline">{week.start} - {week.end}</p>
								{#if selected}
									<Icon src={CheckCircle} size="24" class="ml-auto" />
								{/if}
							</div>
						</ListboxOption>
					{/each}
				</ListboxOptions>
			</Transition>
		</Listbox>
	</div>

	<!-- skeleton -->
	{#if !scores || scores.length == 0}
		<div class="grid gap-6 grid-cols-[repeat(auto-fit,minmax(300px,1fr))] w-full">
			{#each { length: 40 } as _, i}
				<div
					class="relative flex items-center px-6 py-2 bg-black/10 border-2 border-neutral-700 rounded">
					<!-- player head -->
					<div class="h-28 w-14 mr-6 my-2 bg-neutral-700 rounded-md animate-pulse" />

					<div class="space-y-[0.625rem]">
						<div class="w-20 min-h-[14px] my-[3px] bg-neutral-500 rounded-md animate-pulse" />
						<div
							class="w-16 min-h-[14px] my-[3px] bg-emerald-800 text-neutral-400 rounded-md animate-pulse" />

						<div
							class="w-32 min-h-[14px] my-[3px] bg-neutral-600 text-neutral-400 rounded-md animate-pulse" />

						<div
							class="w-28 min-h-[14px] my-[3px] bg-neutral-600 text-neutral-400 rounded-md animate-pulse" />

						<!-- <div
						class="w-20 min-h-[14px] my-[3px] bg-neutral-600 text-neutral-400 rounded-md animate-pulse" /> -->
					</div>
				</div>
			{/each}
		</div>
	{:else}
		<!-- actual one -->
		{#key displayScores}
			<div
				class="grid gap-6 grid-cols-[repeat(auto-fit,minmax(300px,1fr))] w-full"
				in:fade={{ x: 30, duration: 250, delay: 250 }}
				out:fade={{ x: -30, duration: 250 }}>
				{#each scores as player, i (player.uuid)}
					<div
						class="relative flex items-center px-6 py-2 bg-black/10 border-2 border-neutral-700 rounded"
						class:brightness-50={player.score == 0}>
						<!-- absolutely positioned box -->
						{#if player.score > 0}
							<div class="absolute md:-top-4 md:-left-4 -top-2 -left-2">
								{#if i == 0}
									<img
										src="https://lh3.googleusercontent.com/0CHvIkhgSfKcZp0CLKqjfv-mLiXZUlVu8LGNm7SIsFfL6HCdZhZsySLv6pbSOBQZ667r6BAAp_lJVbwMhtSkRaikqEMBk8TuI1Y=s400"
										alt=""
										class="w-10 -rotate-12" />
								{:else}
									<div
										class="flex justify-center items-center w-[2.25rem] h-[2.25rem] mr-2 font-medium text-center bg-sky-800 rounded-full">
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
									alt="" />
								<p>
									{player.online}
								</p>
							</div>
						{/if}

						<img
							src="https://mc-heads.net/body/{player.uuid}"
							alt=""
							loading="lazy"
							class="h-32 mr-6 rounded-sm" />
						<div>
							{#if player.rank}
								<div class="font-bold text-xs text-neutral-500">
									{player.rank}
								</div>
							{/if}

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
		{/key}
	{/if}
</div>
