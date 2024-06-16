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
	class="fixed inset-0 top-20 lg:inset-36 bg-black/90 border-2 border-teal-900 backdrop-blur-md rounded-lg z-40">
	<div class="h-full flex items-center">
		<a data-sveltekit-noscroll href="?" class="absolute flex items-center gap-2 top-6 left-6"
			><svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="inline size-6">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
			</svg>
			Back</a>
		<div class="flex flex-col items-center gap-6 p-10 w-1/4">
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
				<li class="flex gap-2">
					{#each [['xp', 'XP Contribution'], ['playtime', 'Playtime (hours)'], ['war', 'Wars']] as [view, title]}
						<ul>
							<button
								class="px-3 py-2 {selectedView === view
									? 'bg-teal-900'
									: 'bg-teal-950/60'} text-sm rounded transition-colors"
								on:click={() => (selectedView = view)}>{title}</button>
						</ul>
					{/each}
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
