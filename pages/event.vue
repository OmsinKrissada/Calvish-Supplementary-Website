<script setup lang="ts">
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ChartOptions, ChartData } from 'chart.js';

type PlayerScore = {
	uuid: string;
	username: string;
	score: number;
	progress: {
		playtime: number;
		contributed: number;
		wars: 0;
	};
};

const { data, pending, error, refresh } = await useLazyFetch<PlayerScore[]>('https://krissada.com/api/calvish/event/weekly/score', { server: false, key: 'weekly/score' });

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const chartData = computed<ChartData<'bar'>>(() => {
	const filtered = data.value?.filter(d => d.score > 0) ?? [];
	return {
		labels: filtered.map(d => d.username) ?? [],
		datasets: [{ label: 'score', data: filtered.map(d => d.score) ?? [] }]
	};
});

const chartOptions: ChartOptions<'bar'> = {
	responsive: true,
	backgroundColor: '#c084fc',
	aspectRatio: 0,
	scales: {
		x: {
			grid: {
				display: false
			},
			border: {
				display: false
			},
		},
		y: {
			grid: {
				// display: false
				color: '#525252'
			},
			border: {
				display: false
			},
		}
	},
	plugins: {
		legend: {
			display: false
		},
	},
};

const formatter = Intl.NumberFormat('en', { useGrouping: true, maximumFractionDigits: 2 });
</script>

<template>
	<div class="flex flex-col items-center max-w-6xl mx-auto">
		<EventInfoDialog />
		<div class="w-full h-80 lg:w-10/12 mb-8">
			<Bar v-if="data" :options="chartOptions" :data="chartData" />
		</div>
		<div v-if="!data" class="grid gap-6 grid-cols-[repeat(auto-fit,minmax(300px,1fr))] w-full">
			<div v-for="i in 40" class="relative space-y-[0.625rem] p-2 bg-black border border-neutral-500 rounded">

				<!-- player head -->
				<div class="absolute top-4 right-4 w-8 h-8 my-[3px] bg-neutral-500 rounded-md animate-pulse"></div>

				<div class="w-20 min-h-[14px] my-[3px] bg-neutral-500 rounded-md animate-pulse"></div>
				<div class="w-40 min-h-[14px] my-[3px] bg-neutral-600 text-neutral-400 rounded-md animate-pulse">
				</div>
				<div class="w-full min-h-[14px] my-[3px] bg-neutral-600 text-neutral-400 rounded-md animate-pulse">
				</div>
				<div class="w-full min-h-[14px] my-[3px] bg-neutral-600 text-neutral-400 rounded-md animate-pulse">
				</div>
				<div class="w-full min-h-[14px] my-[3px] bg-neutral-600 text-neutral-400 rounded-md animate-pulse">
				</div>
			</div>
		</div>
		<div v-else class="grid gap-6 grid-cols-[repeat(auto-fit,minmax(300px,1fr))] w-full">
			<div v-for="player, i in data" class="relative p-2 bg-black border border-neutral-500 rounded"
				:class="{ 'brightness-50': player.score == 0, 'shadow-[0px_0px_12px] shadow-amber-400': i == 0 && player.score > 0 }">
				<img :src="`https://crafatar.com/avatars/${player.uuid}?overlay`"
					class="absolute top-4 right-4 w-8 ml-8 mr-2 pixelated rounded-sm">
				<span class="inline w-3 mr-2 font-medium text-white border-b border-sky-400">{{ i + 1 }}</span>
				<p class="inline font-medium"> {{ player.username }} </p>

				<p class="text-emerald-400"> {{ formatter.format(player.score) }} points</p>
				<p class="text-neutral-400">
					Contributed
					<span class="text-white">{{ formatter.format(player.progress.contributed) }}</span>
					XP
				</p>
				<p class="text-neutral-400"> Play time:
					<span class="text-white">{{ player.progress.playtime }}</span>
					hrs
				</p>
				<p class="text-neutral-400"> War:
					<span class="text-white">{{ player.progress.wars }}</span>
					times
				</p>
			</div>
		</div>
	</div>
</template>