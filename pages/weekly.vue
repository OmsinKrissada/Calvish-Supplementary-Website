<script setup lang="ts">
import { Bar } from 'vue-chartjs';
import {
	Chart as ChartJS,
	Title,
	Tooltip,
	Legend,
	BarElement,
	CategoryScale,
	LinearScale,
	ChartOptions,
	ChartData
} from 'chart.js';
import { useNow } from '@vueuse/core';

type PlayerScore = {
	uuid: string;
	username: string;
	rank: string;
	score: number;
	online: string | null;
	progress: {
		playtime: number;
		contributed: number;
		wars: 0;
	};
};

const { data, pending, error, refresh } = await useLazyFetch<PlayerScore[]>(
	useRuntimeConfig().public.endpoint + '/event/weekly/score',
	{ server: false, key: 'weekly/score' }
);

let interval: NodeJS.Timer;
onMounted(() => {
	interval = setInterval(refresh, 10000);
});

onUnmounted(() => {
	clearInterval(interval);
});

// ------ Chart ------

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const chartData = computed<ChartData<'bar'>>(() => {
	const filtered = data.value?.filter((d) => d.score > 0) ?? [];
	return {
		labels: filtered.map((d) => d.username) ?? [],
		datasets: [{ label: 'score', data: filtered.map((d) => d.score) ?? [] }]
	};
});

const chartOptions: ChartOptions<'bar'> = {
	responsive: true,
	backgroundColor: '#2dd4bf',
	aspectRatio: 0,
	color: '#2dd4bf',
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

// ------ Countdown ------
const { data: nextResetDate } = await useLazyFetch<{ date: string }>(
	useRuntimeConfig().public.endpoint + '/event/weekly/nextreset'
);
const countdown = computed(() => {
	// return nextResetDate.value ? formatDistanceToNowStrict() : 'Error';
	if (!nextResetDate.value) return '';
	const diff =
		new Date(nextResetDate.value.date).valueOf() - useNow({ interval: 200 }).value.valueOf();

	if (diff >= 0) return `Next reset in ${fullDurationString(diff / 1000)}`;
	else return 'Score has been reset. Please refresh.';
});

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
</script>

<template>
	<div class="flex flex-col items-center max-w-6xl mx-auto">
		<EventInfoDialog />

		<div class="text-xl mb-8">{{ countdown }}</div>

		<div class="w-full h-48 lg:w-10/12 mb-2">
			<Bar v-if="data" :options="chartOptions" :data="chartData" />
		</div>

		<p class="ml-auto mb-4 text-neutral-400">Data automatically refreshes!</p>

		<!-- skeleton -->
		<div v-if="!data" class="grid gap-6 grid-cols-[repeat(auto-fit,minmax(300px,1fr))] w-full">
			<div
				v-for="i in 40"
				class="relative flex items-center px-6 py-2 bg-black/10 border-2 border-neutral-700 rounded"
				:key="i">
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
		</div>
		<!-- actual one -->
		<div v-else class="grid gap-6 grid-cols-[repeat(auto-fit,minmax(300px,1fr))] w-full">
			<div
				v-for="(player, i) in data"
				:key="player.uuid"
				class="relative flex items-center px-6 py-2 bg-black/10 border-2 border-neutral-700 rounded"
				:class="{ 'brightness-50': player.score == 0 }">
				<!-- absolutely positioned box -->
				<div v-if="player.score > 0" class="absolute md:-top-4 md:-left-4 -top-2 -left-2">
					<img
						v-if="i === 0"
						src="https://lh3.googleusercontent.com/0CHvIkhgSfKcZp0CLKqjfv-mLiXZUlVu8LGNm7SIsFfL6HCdZhZsySLv6pbSOBQZ667r6BAAp_lJVbwMhtSkRaikqEMBk8TuI1Y=s400"
						class="w-10 -rotate-12" />
					<div
						v-else
						class="flex justify-center items-center w-[2.25rem] h-[2.25rem] mr-2 font-medium text-center bg-sky-800 rounded-full">
						<p>
							{{ i + 1 }}<span class="align-super text-xs">{{ getNth(i + 1) }}</span>
						</p>
					</div>
				</div>

				<div v-if="player.online" class="absolute top-4 right-4 flex items-center">
					<img
						src="https://static.wikia.nocookie.net/minecraft_gamepedia/images/3/38/Experience_Orb.gif"
						class="w-5 mr-1"
						alt="" />
					<p>
						{{ player.online }}
					</p>
				</div>

				<img
					:src="`https://mc-heads.net/body/${player.uuid}`"
					loading="lazy"
					class="h-32 mr-6 rounded-sm" />
				<div>
					<div class="font-bold text-xs text-neutral-500">
						{{ player.rank }}
					</div>

					<p class="inline font-medium">
						{{ player.username }}
					</p>

					<p class="text-emerald-400">{{ formatter.format(player.score) }} points</p>
					<p class="text-neutral-400">
						Contributed
						<span class="text-white">{{ formatter.format(player.progress.contributed) }}</span>
						XP
					</p>
					<p class="text-neutral-400">
						Play time:
						<span class="text-white">{{ player.progress.playtime }}</span>
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
		</div>
	</div>
</template>
