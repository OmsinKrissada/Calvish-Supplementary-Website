<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useNow, useTimestamp } from '@vueuse/core';
import axios from 'axios';
import { formatDuration, formatDistance, formatDistanceStrict } from 'date-fns';
import Banner from './components/icons/Banner.vue';
import LiquidEmeraldStack from './components/icons/LiquidEmeraldStack.vue';
import type { Guild, Member } from './types';
import { fullDurationString } from './helper';

const xp = ref(0);
const guild = ref<Guild>();
const leaderboard = computed(() => {
  return guild.value?.members.sort((a, b) => b.contributed - a.contributed);
});

const formatter_2 = Intl.NumberFormat('en', { useGrouping: true, maximumFractionDigits: 2 });
const formatter_3 = Intl.NumberFormat('en', { useGrouping: true });

const countdown = computed(() => {
  const diff = new Date('2022-10-09T11:30:00Z').valueOf() - useNow().value.valueOf();

  if (diff >= 1)
    return fullDurationString(diff / 1000);
  else
    return 'The event has ended!';
});

const oldContribution: { [name: string]: number; } = {
  closier: 328644470,
  exqlode: 267788568,
  Stivais: 125493747,
  cmosier: 48896580,
  OmBean: 31397513,
  Genues: 30089593,
  sunny_young: 20695955,
  zwheels10: 19268139,
  // Latastrophue: 0,
  ilykookie: 19234144,
  GewoonMel: 17449466,
  GamingReizouko: 12961967,
  hesrightyouknow: 11977679,
  Huruf: 10566744,
  Diz: 6541981,
  Triflame: 5326585,
  Aftershokke: 5023574,
  _imsoap: 4839622,
  Mango_Birbs: 4498349,
  TmanBagged: 2539693,
  imMegu: 2339286,
  ItsObvious: 2024393,
  CptShock: 1782231,
  chi_ming: 1769518,
  __labz: 1508604,
  Swagful: 1115480,
  // sadlucy: 1000000,
  // TwelvenK: 1000000,
};

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
  <div class="min-h-screen p-10 bg-slate-900 text-slate-200">

    <Banner class="mx-auto mb-5" />
    <header class="flex flex-col items-center">
      <h1 class="font-fira text-center text-5xl">Calvish [bean]</h1>
      <div class="h-1 w-12 my-10 bg-emerald-500 rounded" />
      <div class="flex flex-col items-center sm:flex-row space-y-5 sm:space-x-5 sm:space-y-0">
        <LiquidEmeraldStack />
        <h3 class="font-medium text-2xl text-slate-200">Top XP Event <span class="underline text-emerald-200">Season
            1</span>
        </h3>
      </div>
      <p class="mt-5 font-medium text-center text-xl text-emerald-400 font-mono">
        Ends in {{countdown}}
      </p>
    </header>

    <div class="mt-20">
      <p class="mb-2 font-medium text-center">
        Guild Level: {{guild?.level}} ({{guild?.xp}}%)
      </p>
      <div class="max-w-6xl mx-auto bg-white/20 rounded-md">
        <div class="h-2 w-0 bg-emerald-500 rounded-md duration-1000"
          :style="{width: guild?.xp+'%', 'transition-property': 'width'}" />
      </div>
    </div>

    <section>
      <!-- <button @click="fetchGuild">Refresh</button> -->
      <TransitionGroup name="list" tag="ul" class="w-max mt-10 mx-auto">
        <li v-for="m,i in leaderboard" :key="m.uuid"
          class="relative flex flex-col sm:flex-row justify-between sm:items-center space-x-8 p-2 m-1 bg-slate-800 rounded">
          <div>
            <p class="absolute top-1 left-2 font-bold text-slate-400">{{i+1}}</p>
            <img :src="`https://crafatar.com/avatars/${m.uuid}?overlay`"
              class="inline w-5 ml-8 mr-2 pixelated rounded-sm">
            <a :href="`https://wynncraft.com/stats/player/${m.name}`" class="text-lg">
              {{m.name}}
              <span class="hidden sm:inline">
                ({{m.rank}})
              </span>
              <span v-if="m.contributed-(oldContribution[m.name]??1115480)>=0.005"
                class="inline sm:hidden text-emerald-500">
                {{formatter_2.format((m.contributed-(oldContribution[m.name]??1115480))/(oldContribution[m.name]??1115480)*100)}}
                %
                &uarr;
              </span>
            </a>
          </div>
          <div>
            <span class="right-3 font-medium font-mono sm:text-right text-slate-300">
              <span v-if="m.contributed-(oldContribution[m.name]??1115480)>=0.005"
                class="hidden sm:inline text-emerald-500">
                {{formatter_2.format((m.contributed-(oldContribution[m.name]??1115480))/(oldContribution[m.name]??1115480)*100)}}
                %
                &uarr;
              </span>
              {{formatter_3.format(m.contributed)}} XP
              <p class="font-sans text-sm">({{formatter_3.format(m.contributed/total*100)}} %)</p>
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
</style>