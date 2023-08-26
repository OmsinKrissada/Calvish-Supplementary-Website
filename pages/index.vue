<script setup lang="ts">
import { useNow, useTimestamp } from '@vueuse/core';
import { TransitionGroup } from 'vue';
import { Guild } from '../utils/types';
// import { members as oldMembers } from 'xp_before_season2.json';

const preSeason2Members = xp_before_season2.members;
const postSeason2Members = xp_after_season2.members;

const formatter_3 = Intl.NumberFormat('en', { useGrouping: true });

const preSeason2Contrib = preSeason2Members.reduce(
	(r, c) => r.set(c.name, c.contributed),
	new Map<string, number>()
);
const postSeason2Contrib = postSeason2Members.reduce(
	(r, c) => r.set(c.name, c.contributed),
	new Map<string, number>()
);

const {
	data: guild,
	pending,
	error,
	refresh: refreshGuild
} = await useLazyFetch<Guild>(
	'https://api.wynncraft.com/public_api.php?action=guildStats&command=Calvish',
	{ server: false, key: 'xp' }
);
const leaderboard = computed(() => {
	return guild.value?.members.sort((a, b) => b.contributed - a.contributed);
});

const route = useRoute();
const view = ref<string>((route.query.view as string) ?? 'all');

const members = computed(() => {
	if (view.value === 'season')
		return leaderboard.value
			?.filter(
				(m) => (postSeason2Contrib.get(m.name) ?? 0) - (preSeason2Contrib.get(m.name) ?? 0) > 0
			)
			.sort(
				(a, b) =>
					(postSeason2Contrib.get(b.name) ?? 0) -
					(preSeason2Contrib.get(b.name) ?? 0) -
					((postSeason2Contrib.get(a.name) ?? 0) - (preSeason2Contrib.get(a.name) ?? 0))
			);
	else return leaderboard.value?.sort((a, b) => b.contributed - a.contributed);
});

const total = ref(0);
leaderboard.value?.map((m) => (total.value += m.contributed));

const gridView = ref(false);

let interval: NodeJS.Timer;
onMounted(async () => {
	// await fetchGuild();
	interval = setInterval(async () => {
		await refreshGuild();
		console.log('Refreshed!');
	}, 10000);
});

function handleViewSelect(path: string) {
	const router = useRouter();
	router.replace(path);
}

onUnmounted(() => clearInterval(interval));
</script>

<template>
	<div>
		<div class="flex flex-col items-center">
			<div class="flex flex-col items-center sm:flex-row space-y-5 sm:space-x-5 sm:space-y-0">
				<LiquidEmeraldStack />
				<h3 class="font-medium text-2xl text-slate-200">
					XP Contribution
					<!-- <span class="underline text-emerald-200">Season 2</span> -->
				</h3>
			</div>
			<!-- <p class="mt-5 font-medium text-center text-xl text-emerald-400 font-mono">
				{{ countdown }}
			</p> -->
		</div>

		<div class="my-10">
			<p class="mb-2 font-medium text-center">Guild Level: {{ guild?.level }} ({{ guild?.xp }}%)</p>
			<div class="max-w-md mx-auto bg-white/20 rounded-md">
				<div
					class="h-2 w-0 bg-emerald-500 shadow-[0px_0px_10px_green] rounded-md duration-1000"
					:style="{
						width: guild?.xp + '%',
						'transition-property': 'width'
					}" />
			</div>
		</div>

		<section>
			<!-- <button @click="fetchGuild">Refresh</button> -->

			<!-- <ul class="flex items-center space-x-2 w-max mx-auto mt-8 text-sm font-medium text-center rounded-xl">
				<li>
					<NuxtLink to="/" class="inline-block py-3 px-4 bg-black text-neutral-400 rounded-lg transition-all"
						:class="{ 'bg-white text-black selected-btn': view === 'all' }" aria-current="page"
						@click="handleViewSelect('/')">
						All Time View
					</NuxtLink>
				</li>
				<li>
					<NuxtLink to="?view=season"
						class="inline-block py-3 px-4 bg-black text-neutral-400 rounded-lg transition-all"
						:class="{ 'bg-white text-black selected-btn': view === 'season' }"
						@click="handleViewSelect('?view=season')">
						Season View
					</NuxtLink>
				</li>
			</ul> -->

			<!-- <div class="my-8">
				<p v-if="view === 'all'" class="text-center">Number in <span
						class="font-medium text-emerald-500">green</span>
					text indicates
					percentage since
					the start of this season</p>
				<p v-if="view === 'all'" class="text-center"><span class="font-mono text-emerald-500">∞</span> means
					player
					previously had no
					contribution</p>
				<p v-if="view === 'season'" class="text-center">Displayed here are the XP each player gained during
					the 2<sup>nd</sup> season</p>
			</div> -->

			<!-- <input type="checkbox" id="gridView" v-model="gridView">
			<label for="gridView">Grid View?</label> -->

			<TransitionGroup
				name="list"
				tag="ul"
				class="mt-4"
				:class="
					gridView
						? 'grid gap-1 grid-cols-[repeat(auto-fit,minmax(500px,1fr))] sm:w-full'
						: 'space-y-2 sm:w-max mx-auto'
				">
				<li
					v-for="(m, i) in members"
					:key="m.uuid"
					class="relative flex flex-wrap flex-row justify-between sm:items-center space-x-8 p-2 m-1 bg-black/10 border border-neutral-800 rounded shadow-white/60"
					:class="{
						'bg-gradient-to-r from-orange-800/60 to-yellow-600/60 border-yellow-600 winner-shadow':
							view === 'season' && i === 0
					}">
					<div>
						<span class="inline-block w-3 font-bold text-slate-400">{{ i + 1 }}</span>
						<img
							:src="`https://mc-heads.net/avatar/${m.uuid}/8`"
							loading="lazy"
							class="inline w-5 ml-8 mr-2 pixelated rounded-sm" />
						<a :href="`https://wynncraft.com/stats/player/${m.name}`" class="font-medium text-md">
							{{ m.name }}
							<!-- <span class="hidden sm:inline">
                ({{ m.rank }})
              </span> -->
						</a>
					</div>
					<div>
						<span class="right-3 font-mono text-right text-slate-300">
							<!-- <span v-if="view === 'all' && m.contributed - (preSeason2Contrib.get(m.name) ?? 0) >= 0.005"
								class="hidden sm:inline text-emerald-500">
								+{{ formatter_2.format((m.contributed - (preSeason2Contrib.get(m.name) ?? 0)) /
		(preSeason2Contrib.get(m.name) ?? 0) * 100)
}}%
							</span> -->
							{{
								formatter_3.format(
									view === 'all'
										? m.contributed
										: (postSeason2Contrib.get(m.name) ?? 0) - (preSeason2Contrib.get(m.name) ?? 0)
								)
							}}
							XP
							<p v-if="view === 'all'" class="text-sm">
								({{ formatter_3.format((m.contributed / total) * 100) }}%)
							</p>
						</span>
					</div>
				</li>
			</TransitionGroup>
		</section>
	</div>
</template>

<style scoped>
.list-move,
/* apply transition to moving elements */
.list-enter-active,
.list-leave-active {
	transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
	opacity: 0;
	transform: translateX(30px);
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.list-leave-active {
	position: absolute;
}

.winner-shadow {
	box-shadow: 0px 0px 20px rgba(218, 165, 32, 0.6);
}

.selected-btn {
	box-shadow: 0px 0px 12px rgba(255, 255, 255, 0.6);
}
</style>
