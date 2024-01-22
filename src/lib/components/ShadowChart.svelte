<script lang="ts">
	import { env } from '$env/dynamic/public';
	import {
		Chart as ChartJS,
		Title,
		Tooltip,
		Legend,
		LineController,
		LineElement,
		CategoryScale,
		LinearScale,
		PointElement,
		Filler,
		LogarithmicScale
	} from 'chart.js';
	import type { ChartOptions, ChartData } from 'chart.js';
	import { onMount } from 'svelte';

	// export let points: number[];
	export let points: number[];
	// export let name: string;

	ChartJS.register(
		Title,
		Tooltip,
		Legend,
		LineController,
		LineElement,
		CategoryScale,
		LinearScale,
		PointElement,
		Filler,
		LogarithmicScale
	);

	const chartOptions: ChartOptions<'line'> = {
		responsive: true,
		// backgroundColor: '#2dd4bf',
		aspectRatio: 0,
		// color: '#2dd4bf',
		animation: {
			duration: 0
		},
		animations: {
			// x: {
			// 	duration: 0
			// },
			// radius: {
			// 	duration: 0
			// },
			// y: {
			// 	duration: 1000
			// },
			// tension: {
			// 	duration: 0
			// }
		},
		scales: {
			x: {
				grid: {
					display: false
				},
				// labels: {},
				border: {
					display: false
				},
				ticks: {
					display: false
				}
			},
			y: {
				grid: {
					display: false
					// color: '#737373',
				},
				border: {
					display: false
				},
				ticks: {
					display: false
				},
				beginAtZero: true,
				max: 7148.170354
				// type: 'logarithmic'
			}
		},
		plugins: {
			legend: {
				display: false
			},
			filler: {
				propagate: true
			},
			tooltip: {
				enabled: false
			}
		}
	};

	let chartCanvas: HTMLCanvasElement;
	let chart: ChartJS<'line'>;
	let chartData: ChartData<'line', number[]>;
	let gradient: CanvasGradient;
	$: {
		if (!chartData) {
			// console.log('no chartdata');
			// console.log(gradient);
		} else {
			// console.log('has chart data');
			chartData.datasets[0].data = points;
		}
		if (chart) chart.update();
	}
	onMount(async () => {
		// points = await (await fetch(env.PUBLIC_ENDPOINT + `/weekly/player/${name}`)).json();
		let ctx = chartCanvas.getContext('2d');
		if (!ctx) throw 'ctx is not defined';
		gradient = ctx.createLinearGradient(0, 0, 0, chartCanvas.height);
		gradient.addColorStop(0, '#2dd4bf88');
		gradient.addColorStop(1, '#2dd4bf22');
		// console.log(gradient);

		chartData = {
			labels: points,
			datasets: [
				{
					label: 'score',
					data: points ?? [],
					// borderColor: '#2dd4bf88',
					backgroundColor: gradient,
					pointStyle: false,
					fill: 'start',
					borderWidth: 1,
					tension: 0
				}
			]
		};
		chart = new ChartJS(ctx, {
			type: 'line',
			data: chartData,
			options: chartOptions
		});
	});
</script>

<canvas bind:this={chartCanvas} />
