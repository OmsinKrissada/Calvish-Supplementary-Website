<script lang="ts">
	import {
		Chart as ChartJS,
		Title,
		Tooltip,
		Legend,
		BarController,
		BarElement,
		CategoryScale,
		LinearScale
	} from 'chart.js';
	import type { ChartOptions, ChartData } from 'chart.js';
	import type { MinimalPlayerScore } from '$lib/types';
	import { onMount } from 'svelte';

	export let scores: MinimalPlayerScore[];

	ChartJS.register(Title, Tooltip, Legend, BarController, BarElement, CategoryScale, LinearScale);

	const chartOptions: ChartOptions<'bar'> = {
		responsive: true,
		backgroundColor: '#2dd4bf',
		aspectRatio: 0,
		color: '#2dd4bf',
		animation: {
			duration: 0
		},
		animations: {
			x: {
				duration: 0
			},
			radius: {
				duration: 0
			},
			y: {
				duration: 1000
			},
			tension: {
				duration: 0
			}
		},
		scales: {
			x: {
				grid: {
					display: false
				},
				// labels: {

				// },
				border: {
					display: false
				},
				ticks: {
					color: 'white',
					font: {
						family: 'Inter'
					}
				}
			},
			y: {
				grid: {
					// display: false
					color: '#737373'
				},
				border: {
					display: false
				},
				ticks: {
					color: '#737373'
				}
			}
		},
		plugins: {
			legend: {
				display: false
			}
		}
	};

	let chartCanvas: HTMLCanvasElement;
	let chart: ChartJS<'bar'>;
	let chartData: ChartData<'bar', number[]>;
	$: {
		const filtered = scores.filter((d) => d.score > 0) ?? [];
		if (!chartData) {
			chartData = {
				labels: filtered.map((d) => d.username) ?? [],
				datasets: [{ label: 'score', data: filtered.map((d) => d.score) ?? [] }]
			};
		} else {
			chartData.labels = filtered.map((d) => d.username);
			chartData.datasets[0].data = filtered.map((d) => d.score);
		}
		if (chart) chart.update();
	}
	onMount(() => {
		const ctx = chartCanvas.getContext('2d');
		if (!ctx) throw 'ctx is not defined';
		chart = new ChartJS(ctx, {
			type: 'bar',
			data: chartData,
			options: chartOptions
		});
	});
</script>

<canvas bind:this={chartCanvas} />
