<script lang="ts">
	import { PUBLIC_ENDPOINT } from '$env/static/public';
	import Loader from '$lib/components/Loader.svelte';
	import {
		Chart as ChartJS,
		Title,
		Tooltip,
		Legend,
		LineController,
		LineElement,
		CategoryScale,
		LinearScale,
		PointElement
	} from 'chart.js';
	import type { ChartOptions, ChartData } from 'chart.js';
	import { onMount } from 'svelte';

	export let data: {
		labels: (string | number)[];
		values: { [key in 'contribution' | 'playtime' | 'wars']: number[] };
	};
	export let uuid: string;

	let selectedView: 'xp' | 'playtime' | 'war' = 'xp';

	ChartJS.register(
		Title,
		Tooltip,
		Legend,
		LineController,
		LineElement,
		CategoryScale,
		LinearScale,
		PointElement
	);

	const tickColor = '#999999';
	const gridColor = '#282828';
	const borderColor = '#666666';
	const skipped = (ctx: CanvasRenderingContext2D, value: string | any[]) =>
		ctx.p0.skip || ctx.p1.skip ? value : undefined;
	const chartOptions: ChartOptions<'line'> = {
		responsive: true,
		backgroundColor: '#2dd4bf',
		aspectRatio: 0,
		color: '#2dd4bf',
		borderColor: '#2dd4bf',
		animation: {
			duration: 0
		},
		// normalized: true,
		segment: {
			borderColor: (ctx) => skipped(ctx, 'rgb(255,255,255,0.5)'),
			borderDash: (ctx) => skipped(ctx, [6, 6])
		},
		spanGaps: true,
		scales: {
			x: {
				grid: {
					color: gridColor
				},
				border: {
					color: borderColor
				},
				ticks: {
					color: tickColor
				},
				title: {
					display: true,
					text: 'End of week'
				}
			},
			y: {
				grid: {
					color: gridColor
				},
				border: {
					color: borderColor
				},
				ticks: {
					color: tickColor
				},
				min: 0
			}
		},

		plugins: {
			legend: {
				display: false
			}
		}
	};

	let chartCanvas: HTMLCanvasElement;
	let chart: ChartJS<'line'>;
	let chartData: ChartData<'line', number[]>;
	$: if (data.values) {
		let selectedData;
		if (selectedView === 'xp') selectedData = data.values.contribution;
		else if (selectedView === 'playtime') selectedData = data.values.playtime;
		else selectedData = data.values.wars;

		if (!chartData) {
			chartData = {
				labels: data.labels,
				datasets: [{ data: selectedData }]
			};
		} else {
			chartData.labels = data.labels;
			chartData.datasets[0].data = selectedData;
		}
		if (chart) chart.update();
	}

	let username: string;
	let guildRank: string;
	let badgeUri: string;
	// let online: boolean;
	// let server: string | null;
	onMount(async () => {
		if (data.values) {
			const ctx = chartCanvas.getContext('2d');
			if (!ctx) throw 'ctx is not defined';
			chart = new ChartJS(ctx, {
				type: 'line',
				data: chartData,
				options: chartOptions
			});
		}

		const res = await fetch(PUBLIC_ENDPOINT + `/player/${uuid}`).then((r) => r.json());
		console.log;
		username = res.username;
		guildRank = res.guild.rank;
		badgeUri = res.rankBadge;
		// online = res.online;
		// server = res.server;
	});
</script>

<div
	class="hidden lg:block fixed inset-0 top-20 lg:inset-36 bg-black/90 border-2 border-teal-900 backdrop-blur-md rounded-lg z-40">
	<div class="h-full flex items-center">
		<div class="flex items-center w-full h-full">
			<div class="flex flex-col items-center gap-6 p-10 lg:w-1/4">
				<img
					src="https://mc-heads.net/body/{uuid}"
					alt={username}
					loading="lazy"
					class="h-64 rounded-sm object-scale-down" />
				<div class="h-12">
					{#if username}
						<p class="font-semibold text-center text-sm text-neutral-400">{guildRank ?? ''}</p>
						<div class="flex items-center w-max mx-auto font-bold text-xl">
							<!-- <p class="text-center font-normal text-base">{online ? server : 'Currently offline'}</p> -->
							{#if badgeUri}
								<img src="https://cdn.wynncraft.com/{badgeUri}" alt="" class="h-4 mr-2" />
							{/if}
							<p class="text-center">{username}</p>
						</div>
					{:else}
						<Loader />
					{/if}
				</div>
			</div>

			{#if data.values}
				<div class="w-full h-full p-10">
					<li class="flex gap-2 text-xs xl:text-sm">
						{#each [['xp', 'XP Contribution'], ['playtime', 'Playtime (hours)'], ['war', 'Wars']] as [view, title]}
							<ul>
								<button
									class="px-3 py-2 {selectedView === view
										? 'bg-teal-900'
										: 'bg-teal-950/60'} rounded transition-colors"
									on:click={() => (selectedView = view)}>{title}</button>
							</ul>
						{/each}
						<div class="flex gap-2 ml-auto font-medium">
							<a
								target="_blank"
								href="https://wynncraft.com/stats/player/{uuid}"
								class="flex items-center gap-2 ml-auto px-3 py-1 rounded-md transition-colors hover:bg-white/10">
								View on wynncraft.com
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="1.5"
									stroke="currentColor"
									class="inline size-5">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
								</svg>
							</a>
							<a
								data-sveltekit-noscroll
								href="?"
								class="flex items-center gap-2 px-3 py-1 bg-white text-black rounded-md">
								Back
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="1.5"
									stroke="currentColor"
									class="inline size-5">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
								</svg>
							</a>
						</div>
					</li>
					<canvas bind:this={chartCanvas} class="my-10"></canvas>
				</div>
			{:else}
				<div class="flex w-full h-full justify-center items-center">
					<p class="text-center text-xl">No record</p>
				</div>
			{/if}
		</div>
	</div>
</div>
