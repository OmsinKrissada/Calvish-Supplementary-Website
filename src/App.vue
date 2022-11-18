<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch, watchEffect } from 'vue';
import { useNow, useTimestamp } from '@vueuse/core';
import axios from 'axios';
import { formatDuration, formatDistance, formatDistanceStrict } from 'date-fns';
import Banner from './components/icons/Banner.vue';
import LiquidEmeraldStack from './components/icons/LiquidEmeraldStack.vue';
import type { Guild, Member } from './types';
import { fullDurationString } from './helper';
import { useHead } from '@vueuse/head';
import { members as oldMembers } from './xp_before_season2.json';


useHead({
  title: 'Top XP Event | Calvish'
});

const xp = ref(0);
const guild = ref<Guild>();
const leaderboard = computed(() => {
  return guild.value?.members.sort((a, b) => b.contributed - a.contributed);
});

const formatter_2 = Intl.NumberFormat('en', { useGrouping: true, maximumFractionDigits: 2 });
const formatter_3 = Intl.NumberFormat('en', { useGrouping: true });

const countdown = computed(() => {
  const diff = new Date('2022-11-22T00:50:00Z').valueOf() - useNow().value.valueOf();

  if (diff >= 1)
    return fullDurationString(diff / 1000);
  else
    return 'The event has ended!';
});

const oldContribution = oldMembers.reduce((r, c) => r.set(c.name, c.contributed), new Map<string, number>());
console.log(oldContribution);

async function fetchGuild() {
  try {
    const res = await axios.get('https://api.wynncraft.com/public_api.php?action=guildStats&command=Calvish');
    console.log(res.data);
    guild.value = res.data;
  } catch (e) {
    console.error('Error decoding guild data response');
    if (axios.isAxiosError(e)) {
      console.error('axios');
      console.error(e);
    } else console.error(e);
  }
}

const view = ref<'all' | 'season'>('season');

const members = computed(() => {
  console.log(view);
  if (view.value === 'season') return leaderboard.value?.filter(m => m.contributed - (oldContribution.get(m.name) ?? 0) > 0).sort((a, b) => (b.contributed - (oldContribution.get(b.name) ?? 0)) - (a.contributed - (oldContribution.get(a.name) ?? 0)));
  else return leaderboard.value?.sort((a, b) => b.contributed - a.contributed);
});
watch(view, (view, oldView) => {
});



const total = ref(0);
let interval: number;
onMounted(async () => {
  await fetchGuild();
  leaderboard.value?.map(m => total.value += m.contributed);
  console.log(total);
  interval = setInterval(() => {
    fetchGuild();
    console.log('Fetched!');
  }, 3000);
});

onUnmounted(() => clearInterval(interval));
</script>

<template>
  <div class="min-h-screen p-4 sm:p-10 bg-black text-slate-200">

    <Banner class="mx-auto mb-5" />
    <header class="flex flex-col items-center">
      <h1 class="font-fira text-center text-5xl">Calvish [bean]</h1>
      <div class="h-1 w-12 my-10 bg-emerald-500 rounded" />
      <div class="flex flex-col items-center sm:flex-row space-y-5 sm:space-x-5 sm:space-y-0">
        <LiquidEmeraldStack />
        <h3 class="font-medium text-2xl text-slate-200">Top XP Event
          <span class="underline text-emerald-200">Season 2</span>
        </h3>
      </div>
      <p class="mt-5 font-medium text-center text-xl text-emerald-400 font-mono">
        Ends in {{ countdown }}
      </p>
    </header>

    <div class="mt-10">
      <p class="mb-2 font-medium text-center">
        Guild Level: {{ guild?.level }} ({{ guild?.xp }}%)
      </p>
      <div class="max-w-2xl mx-auto bg-white/20 rounded-md">
        <div class="h-2 w-0 bg-emerald-500 rounded-md duration-1000"
          :style="{ width: guild?.xp + '%', 'transition-property': 'width' }" />
      </div>
    </div>

    <section>
      <!-- <button @click="fetchGuild">Refresh</button> -->


      <ul class="flex items-center space-x-2 w-max mx-auto mt-8 text-sm font-medium text-center rounded-xl">
        <!-- <p class="m-4 text-lg text-white">Select View</p> -->
        <li>
          <button @click="view = 'all'"
            class="inline-block py-3 px-4 border-[1px] border-neutral-700 text-neutral-400 rounded-lg transition-all"
            :class="{ 'bg-white text-black selected-btn': view === 'all' }" aria-current="page">
            All Time View
          </button>
        </li>
        <li>
          <button @click="view = 'season'"
            class="inline-block py-3 px-4 border-[1px] border-neutral-700 text-neutral-400 rounded-lg transition-all"
            :class="{ 'bg-white text-black selected-btn': view === 'season' }">
            Season View
          </button>
        </li>
      </ul>


      <p v-if="view === 'all'" class="mt-8 text-center">Number in <span
          class="font-medium text-emerald-500">green</span>
        text indicates
        percentage since
        the start of this season</p>
      <p v-if="view === 'all'" class="text-center"><span class="font-mono text-emerald-500">∞</span> means player
        previously had no
        contribution</p>

      <TransitionGroup name="list" tag="ul" class="sm:w-max mt-4 mx-auto space-y-2">
        <li v-for="m, i in members" :key="m.uuid"
          class="relative flex flex-wrap flex-row justify-between sm:items-center space-x-8 p-2 m-1 border-2 border-neutral-800 rounded  shadow-white/60"
          :class="{ 'bg-gradient-to-r from-orange-800/60 to-yellow-600/60 border-yellow-600 winner-shadow': view === 'season' && i === 0 }">
          <div>
            <span class="font-bold text-slate-400">{{ i + 1 }}</span>
            <img :src="`https://crafatar.com/avatars/${m.uuid}?overlay`"
              class="inline w-5 ml-8 mr-2 pixelated rounded-sm">
            <a :href="`https://wynncraft.com/stats/player/${m.name}`" class="font-medium text-md">
              {{ m.name }}
              <!-- <span class="hidden sm:inline">
                ({{ m.rank }})
              </span> -->
            </a>
          </div>
          <div>
            <span class="right-3 font-mono sm:text-right text-slate-300">
              <span v-if="view === 'all' && m.contributed - (oldContribution.get(m.name) ?? 0) >= 0.005"
                class="hidden sm:inline text-emerald-500">
                {{ formatter_2.format((m.contributed - (oldContribution.get(m.name) ?? 0)) /
                    (oldContribution.get(m.name) ?? 0) * 100)
                }}
                %
                &uarr;
              </span>
              {{ formatter_3.format(view === 'all' ? m.contributed : m.contributed - (oldContribution.get(m.name) ?? 0))
              }}
              XP
              <p v-if="view === 'all'" class="font-sans text-sm">({{ formatter_3.format(m.contributed / total * 100) }}
                %)
              </p>
            </span>
          </div>
        </li>
      </TransitionGroup>
    </section>

  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

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