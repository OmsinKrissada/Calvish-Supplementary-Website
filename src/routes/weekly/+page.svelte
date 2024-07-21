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
		Switch,
		SwitchGroup,
		SwitchLabel,
		Transition
	} from '@rgossiaux/svelte-headlessui';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { CheckCircle, ChevronUpDown } from '@steeze-ui/heroicons';
	import { format, subDays } from 'date-fns';
	import { fade } from 'svelte/transition';
	import ErrorText from '$lib/components/ErrorText.svelte';
	import Loader from '$lib/components/Loader.svelte';
	import PlayerExpanded from './PlayerExpanded.svelte';
	import { io } from 'socket.io-client';
	import { PUBLIC_ENDPOINT } from '$env/static/public';

	export let data;

	// invalidate();

	const formatter = Intl.NumberFormat('en', {
		useGrouping: true,
		maximumFractionDigits: 2
	});
	const compactFormatter = Intl.NumberFormat('en', {
		notation: 'compact',
		// minimumSignificantDigits: 3,
		maximumSignificantDigits: 3
	});

	function getNth(n: number) {
		if ([11, 12, 13].includes(n)) return 'th';
		if ((n - 1) % 10 === 0) return 'st';
		if ((n - 2) % 10 === 0) return 'nd';
		if ((n - 3) % 10 === 0) return 'rd';
		return 'th';
	}

	// let interval: number;
	let currentScores: PlayerScore[];
	let displayScores: MinimalPlayerScore[] | null = null;
	let onlineOnly = false;

	let weeks: { id: number; start: string; end: string }[];
	let selectedWeek: { id: any; start: string; end: string };
	let error = '';

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
				})
				.catch((err) => (error = err));
		}
	}

	let tileView = true;

	const socket = io(`${PUBLIC_ENDPOINT.replaceAll('http', 'ws')}`, {
		path: '/api/calvish/socket.io'
	});
	let socketStatus = 'Connecting ...';
	onMount(async () => {
		socket.on('weekly', (data) => {
			currentScores = data;
			console.log('received');
		});

		socket.on('connect', () => {
			socketStatus = 'Connected';
		});

		socket.on('disconnect', () => {
			socketStatus = 'Reconnecting ...';
		});

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
					end: w.endAt ? format(subDays(new Date(w.endAt), 1), 'MMM dd') : 'Now'
				};
			})
			.reverse();
		selectedWeek = weeks[0];
	});

	$: scores = (displayScores?.map((s, i) => ({ ...s, ranking: i + 1 })) ||
		currentScores
			?.map((s, i) => ({ ...s, ranking: i + 1 }))
			.filter((s) => !(!displayScores && onlineOnly) || s.online)) as ((
		| PlayerScore
		| MinimalPlayerScore
	) & { ranking: number })[];

	onDestroy(() => {
		socket.disconnect();
	});

	// let enableHistoryChart = false;
	// const points = [0, 10, 20, 30, 30];
	// setInterval(() => {
	// 	points[0] += 1;
	// }, 1000);
</script>

<div class="flex flex-col items-center max-w-6xl mx-auto px-4 lg:px-0">
	<EventInfoDialog />
	{#if data.player && data.uuid}
		{#await data.player}
			<Loader />
		{:then player}
			<PlayerExpanded data={player} uuid={data.uuid} />
		{/await}
	{/if}

	{#await data.streamed.nextReset}
		<div />
	{:then nextReset}
		<Countdown to={nextReset} class="flex items-center w-full mt-6 mb-12 px-4" />
	{/await}

	<div class="w-full h-48 mb-4">
		{#if scores}
			<Chart {scores} />
		{/if}
	</div>
	<div class="flex flex-col items-end gap-4 w-full">
		<!-- {#if showingCurrentWeek && tileView}
			<div class="hidden lg:block text-sm border-neutral-800 rounded-md">
				<SwitchGroup as="div" class="ml-auto">
					<Switch
						class="{enableHistoryChart
							? 'bg-gradient-to-l from-teal-600 to-teal-400'
							: 'bg-white/20'} relative inline-flex h-4 w-9 mr-2 shrink-0 cursor-pointer rounded-full p-[2px] border-transparent transition-colors duration-200 ease-in-out"
						id="history-chart-checkbox"
						bind:checked={enableHistoryChart}>
						<span
							aria-hidden="true"
							class={`${enableHistoryChart ? 'translate-x-5' : 'translate-x-0'}
				  pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`} />
					</Switch>
					<SwitchLabel
						>Enable history shadow <span class="text-xs text-neutral-400">(experimental)</span
						></SwitchLabel>
				</SwitchGroup>
			</div>
		{/if} -->
		<div class="font-medium text-sm lg:text-base border-neutral-800 rounded-md">
			{#if !displayScores}
				<SwitchGroup as="div" class="flex items-center">
					<Switch
						class="{onlineOnly
							? 'bg-gradient-to-l from-teal-600 to-teal-400'
							: 'bg-white/20'} relative inline-flex h-5 w-10 mr-2 shrink-0 cursor-pointer rounded-full p-[2px] border-transparent transition-colors duration-200 ease-in-out"
						id="history-chart-checkbox"
						bind:checked={onlineOnly}>
						<span
							aria-hidden="true"
							class={`${onlineOnly ? 'translate-x-5' : 'translate-x-0'}
			  pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`} />
					</Switch>
					<SwitchLabel>Only show online players</SwitchLabel>
				</SwitchGroup>
			{/if}
		</div>
		<div class="flex flex-wrap-reverse justify-end lg:justify-betwee w-full items-center mb-4">
			<div class="flex gap-2 font-medium mr-auto">
				<p class="hidden md:block">Real time connection:</p>
				<div class="flex items-center">
					{#if socketStatus === 'Connected'}
						<img
							src="https://static.wikia.nocookie.net/minecraft_gamepedia/images/3/38/Experience_Orb.gif"
							class="mr-1 w-5"
							alt="" />
					{:else}
						<div
							class="mr-1 inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
							role="status">
						</div>
					{/if}
					<span class={socketStatus === 'Connected' ? 'text-lime-500' : ''}>
						{socketStatus}
					</span>
				</div>
			</div>
			<div class="flex gap-2 items-center">
				<div class="hidden sm:flex border border-white/30 rounded-md">
					<button
						on:click={() => {
							tileView = false;
						}}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="w-9 p-2 rounded {!tileView
								? 'fill-white bg-white/20'
								: 'fill-neutral-600 hover:fill-neutral-400'}"
							viewBox="0 0 24 24"
							><title>table</title><path
								d="M22 20V4C22 2.9 21.1 2 20 2H4C2.9 2 2 2.9 2 4V20C2 21.1 2.9 22 4 22H20C21.1 22 22 21.1 22 20M4 6.5V4H20V6.5H4M4 11V8.5H20V11H4M4 15.5V13H20V15.5H4M4 20V17.5H20V20H4Z" /></svg>
					</button>
					<button
						on:click={() => {
							tileView = true;
						}}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="w-9 p-2 rounded {tileView
								? 'fill-white bg-white/20'
								: 'fill-neutral-600 hover:fill-neutral-400'}"
							viewBox="0 0 24 24"
							><title>tile</title><path
								d="M4,2H20A2,2 0 0,1 22,4V20A2,2 0 0,1 20,22H4C2.92,22 2,21.1 2,20V4A2,2 0 0,1 4,2M4,4V11H11V4H4M4,20H11V13H4V20M20,20V13H13V20H20M20,4H13V11H20V4Z" /></svg>
					</button>
				</div>
				<Listbox class="relative text-sm" disabled={!selectedWeek} bind:value={selectedWeek}>
					<ListboxButton
						class="relative w-48 px-3 py-2 bg-neutral-100 text-left focus:ring-0 rounded-md">
						<span class="font-medium text-black truncate"
							>{selectedWeek
								? `${selectedWeek.start} - ${selectedWeek.end}`
								: 'Loading records...'}</span>
						<span class="absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-500">
							<Icon src={ChevronUpDown} size="24" />
						</span>
					</ListboxButton>
					<Transition
						as="div"
						enter="relative opacity-0 transition duration-150 z-50"
						enterFrom="opacity-0 -translate-y-2"
						enterTo="opacity-100"
						leave="relative opacity-100 transition duration-150 z-50"
						leaveFrom="opacity-100"
						leaveTo="opacity-0 -translate-y-2">
						<ListboxOptions
							class="absolute inset-x-0 h-96 overflow-auto mt-2 py-1 bg-neutral-950 border border-neutral-700 rounded-md z-10">
							{#each weeks as week (week.id)}
								<ListboxOption let:selected value={week}>
									<div
										class="flex items-center px-3 py-2 hover:bg-teal-950 hover:text-teal-300 focus:ring-0 cursor-pointer"
										class:font-medium={selected}
										class:text-teal-300={selected}
										class:text-white={!selected}>
										<p class="inline">
											{week.start} - {week.end}
											{week.id === 42 ? '(cursed)' : ''}
										</p>
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
		</div>
	</div>

	<!-- skeleton -->
	{#if error}
		<ErrorText
			text={`Unable to fetch data: ${error}, please let OmBean know if a reload doesn't help.`} />
	{:else if !scores || scores.length == 0}
		<div class="grid gap-6 grid-cols-[repeat(auto-fit,minmax(300px,1fr))] w-full">
			{#each { length: 40 } as _, i}
				<div
					class="relative flex items-center px-6 py-2 bg-black/10 border-2 border-neutral-700 rounded">
					<!-- player head -->
					<div class="h-32 w-14 mr-6 my-0 bg-neutral-700 rounded-md animate-pulse" />

					<div class="space-y-[0.625rem]">
						<div class="w-20 min-h-[14px] my-[3px] bg-neutral-500 rounded-md animate-pulse" />
						<div
							class="w-16 min-h-[14px] my-[3px] bg-emerald-800 text-neutral-400 rounded-md animate-pulse" />

						<div
							class="w-32 min-h-[12px] my-[3px] bg-neutral-600 text-neutral-400 rounded-md animate-pulse" />

						<div
							class="w-28 min-h-[12px] my-[3px] bg-neutral-600 text-neutral-400 rounded-md animate-pulse" />
						<div
							class="w-24 min-h-[12px] my-[3px] bg-neutral-600 text-neutral-400 rounded-md animate-pulse" />

						<!-- <div
						class="w-20 min-h-[14px] my-[3px] bg-neutral-600 text-neutral-400 rounded-md animate-pulse" /> -->
					</div>
				</div>
			{/each}
		</div>
	{:else}
		<!-- actual one -->
		{#key displayScores}
			{#if tileView}
				<div
					class="grid gap-6 grid-cols-[repeat(auto-fit,minmax(300px,1fr))] w-full"
					in:fade={{ duration: 250, delay: 250 }}
					out:fade={{ duration: 250 }}>
					{#each scores as player, i (player.uuid)}
						<a
							data-sveltekit-noscroll
							href="?expand={player.uuid}"
							class="relative flex items-center px-6 py-2 bg-black/10 border-2 border-neutral-500/50 rounded"
							class:brightness-50={player.score == 0}>
							<!-- absolutely positioned box -->
							{#if player.score > 0}
								<div class="absolute md:-top-4 md:-left-4 -top-2 -left-2">
									{#if player.ranking === 1}
										<img
											src="https://lh3.googleusercontent.com/0CHvIkhgSfKcZp0CLKqjfv-mLiXZUlVu8LGNm7SIsFfL6HCdZhZsySLv6pbSOBQZ667r6BAAp_lJVbwMhtSkRaikqEMBk8TuI1Y=s400"
											alt=""
											class="w-10 -rotate-12" />
									{:else}
										<div
											class="flex justify-center items-center w-10 leading-none mr-2 py-0.5 font-fira text-center bg-sky-800 border border-sky-600 rounded-full">
											<p>
												{player.ranking}<span class="align-super text-xs"
													>{getNth(player.ranking)}</span>
											</p>
										</div>
									{/if}
								</div>
							{/if}

							<div class="absolute top-4 right-4 flex flex-col gap-1 items-end">
								{#if player.online}
									<div class="flex items-center">
										<img
											src="https://static.wikia.nocookie.net/minecraft_gamepedia/images/3/38/Experience_Orb.gif"
											class="w-5 mr-1"
											alt="" />
										<p>
											{player.online}
										</p>
									</div>
								{/if}
							</div>

							<div class="absolute top-8 right-4" />

							<img
								src="https://mc-heads.net/body/{player.uuid}"
								alt=""
								loading="lazy"
								class="h-32 mr-6 rounded-sm" />
							<div class="">
								{#if player.rank}
									<div class="font-bold text-xs text-neutral-500">
										{player.rank.toUpperCase()}
									</div>
								{/if}

								<p class="inline font-medium">
									{player.username}
								</p>

								<div class="text-emerald-400">
									{formatter.format(player.score)} points
									<!-- <span class="ml-1" title="Change from previous week">
										{#if player.history.at(-1) && player.score != player.history.at(-1)}
											{@const percent =
												((player.score - player.history.at(-1)) / player.history.at(-1)) * 100}
											{@const absolutePercent = Math.abs(percent)}
											<span class="text-neutral-400">-</span>
											<span
												class="text-sm"
												class:text-red-400={percent < 0}
												class:text-green-400={percent > 0}
												>{percent > 0 ? '▲' : '▼'}
												{absolutePercent > 1
													? Math.round(absolutePercent)
													: new Intl.NumberFormat('en', { maximumFractionDigits: 2 }).format(
															absolutePercent
														)}%</span>
										{/if}
									</span> -->

									<!-- {#if enableHistoryChart && player.rank}
										<div class="absolute top-0 -left-1 -bottom-2 -right-1 -z-10">
											<ShadowChart points={[...player.history, player.score]} />
										</div>
									{/if} -->
								</div>
								<p
									class="{!selectedWeek || selectedWeek.id >= 43
										? 'text-sm'
										: ''} text-neutral-400">
									Contributed
									<span
										class="text-white"
										title={Intl.NumberFormat('en').format(player.progress.contributed)}
										>{compactFormatter.format(player.progress.contributed)}</span>
									XP
								</p>
								<p
									class="{!selectedWeek || selectedWeek.id >= 43
										? 'text-sm'
										: ''} text-neutral-400">
									Play time:
									<span class="text-white">{player.progress.playtime}</span>
									hrs
								</p>
								{#if !selectedWeek || selectedWeek.id >= 43}
									<p
										class="{!selectedWeek || selectedWeek.id >= 43
											? 'text-sm'
											: ''} text-neutral-400">
										War:
										<span class="text-white">
											{player.progress.wars}
										</span>
										times
									</p>
								{/if}
							</div>
						</a>
					{/each}
				</div>
			{:else}
				<table class="table w-full border-white rounded-lg overflow-hidden text-white">
					<thead>
						<tr class="bg-black/60 border-b border-white/30">
							<th class="py-2 px-4 text-left font-semibold">#</th>
							<th class="py-2 px-4 text-left font-semibold">Username</th>
							<!-- <th class="py-2 px-4 text-left font-semibold">Rank</th> -->
							<th class="py-2 px-4 text-right font-semibold">Score</th>
							<th class="py-2 px-4 text-right font-semibold">Contributed XP</th>
							<th class="py-2 px-4 text-right font-semibold">Play time (hr)</th>
							{#if !selectedWeek || selectedWeek.id >= 43}
								<th class="py-2 px-4 text-right font-semibold">Wars</th>
							{/if}
						</tr>
					</thead>
					<tbody class="bg-black/30 divide-y divide-black/30">
						{#each scores.filter((s) => s.score > 0) as player, i (player.uuid)}
							<tr class="hover:bg-teal-900/30">
								<td class="py-3 px-4 text-left font-medium">{i + 1}</td>
								<td class="py-3 px-4">
									<div class="flex items-center">
										<img
											src="https://mc-heads.net/avatar/{player.uuid}/8"
											alt=""
											loading="lazy"
											class="w-6 h-6 pixelated rounded-md" />
										<a href="?expand={player.uuid}" class="ml-3 font-medium">
											{player.username}
										</a>
									</div>
								</td>
								<!-- <td class="py-3 px-4 text-right">
				<span>{m.rank}</span>
			</td> -->
								<td class="py-3 px-4 text-sm text-right text-emerald-400">
									<span>{formatter.format(player.score)}</span>
								</td><td class="py-3 px-4 text-sm text-right">
									<span>{formatter.format(player.progress.contributed)}</span>
								</td>
								<td class="py-3 px-4 text-sm text-right">
									<span>{player.progress.playtime}</span>
								</td>
								{#if !selectedWeek || selectedWeek.id >= 43}
									<td class="py-3 px-4 text-sm text-right">
										<span>{player.progress.wars}</span>
									</td>
								{/if}
							</tr>
						{/each}
					</tbody>
				</table>
			{/if}
		{/key}
	{/if}
</div>
