<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import axios from 'axios';
import Banner from './components/icons/Banner.vue';
import LiquidEmeraldStack from './components/icons/LiquidEmeraldStack.vue';
import type { Guild, Member } from './types';

const xp = ref(0);
const guild = ref<Guild>();
const leaderboard = computed(() => {
  return guild.value?.members.sort((a, b) => b.contributed - a.contributed);
});

const formatter = Intl.NumberFormat('en', { useGrouping: true });

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
onMounted(async () => {
  await fetchGuild();
  leaderboard.value?.map(m => total.value += m.contributed);
  console.log(total);
});
</script>

<template>
  <div class="flex flex-col min-h-screen p-10 bg-teal-800 text-white">

    <!-- <Banner /> -->
    <header class="flex flex-col items-center space-y-5">
      <h1 class="font-fira text-5xl">Calvish [bean]</h1>
      <div class="flex space-x-5">
        <LiquidEmeraldStack />
        <h3 class="font-medium text-2xl text-slate-300">Top XP Event <span class="underline text-emerald-200">Season
            1</span></h3>
      </div>
    </header>

    <div>
      <div class="bg-black">
        <div class="h-2 w-0 bg-emerald-500 duration-150"
          :style="{width: guild?.xp+'%', 'transition-property': 'width'}" />
      </div>
    </div>

    <section>
      <button @click="fetchGuild">Refresh</button>
      <div v-for="m,i in leaderboard">
        {{i+1}}
        <img :src="`https://crafatar.com/avatars/${m.uuid}?overlay`" alt="" class="inline w-5 mx-1 pixelated">
        <a :href="`https://wynncraft.com/stats/player/${m.name}`">
          {{m.name}} ({{m.rank}})
        </a> -
        {{formatter.format(m.contributed)}} XP ({{formatter.format(m.contributed/total*100)}}%)
      </div>
    </section>

  </div>
</template>