<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Banner from './components/icons/Banner.vue';
import LiquidEmeraldStack from './components/icons/LiquidEmeraldStack.vue';

const xp = ref(0);

onMounted(() => {

});
</script>

<template>
  <div class="flex flex-col min-h-screen p-10 bg-teal-800 text-white">

    <Banner />
    <header class="flex flex-col items-center space-y-5">
      <h1 class="font-fira text-5xl">Calvish [bean]</h1>
      <div class="flex space-x-5">
        <LiquidEmeraldStack />
        <h3 class="font-medium text-2xl text-slate-300">Top XP Event <span class="underline text-emerald-200">Season
            1</span></h3>
      </div>
    </header>

  </div>
</template>