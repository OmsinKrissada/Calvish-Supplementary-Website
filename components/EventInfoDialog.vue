<script setup lang="ts">
import { useLocalStorage } from '@vueuse/core';


const shouldHide = useLocalStorage('hide_event_info', false);
const isOpen = ref(!shouldHide.value);
const persistent = ref(false);

function closeModal() {
	isOpen.value = false;
}

function closeModalButton() {
	if (persistent.value) {
		shouldHide.value = true;
	}
	closeModal();
}

function openModal() {
	isOpen.value = true;
}
</script>

<template>
	<!-- <div class="fixed inset-0 flex items-center justify-center">
		<button type="button" @click="openModal"
			class="rounded-md bg-black bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
			Open dialog
		</button>
	</div> -->
	<ClientOnly>


		<HeadlessTransitionRoot appear :show="isOpen" as="template">
			<HeadlessDialog as="div" @close="closeModal" class="relative z-40">
				<HeadlessTransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0"
					enter-to="opacity-100" leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
					<div class="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm" />
				</HeadlessTransitionChild>
				<div class="fixed inset-0 overflow-y-auto">
					<div class="flex min-h-full items-center justify-center p-4 text-center">
						<HeadlessTransitionChild as="template" enter="duration-300 ease-out"
							enter-from="opacity-0 scale-95" enter-to="opacity-100 scale-100"
							leave="duration-200 ease-in" leave-from="opacity-100 scale-100"
							leave-to="opacity-0 scale-95">

							<HeadlessDialogPanel
								class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
								<HeadlessDialogTitle as="h3" class="mb-4 text-xl font-bold leading-6 text-gray-900">
									How are the scores calculated?
								</HeadlessDialogTitle>
								<div class="mt-2 space-y-2 text-sm">
									<!-- <p class="text-sm text-gray-500"> -->
									<p>
										Your score is calculated from your weekly stats.
									</p>
									<p>
										This includes your <span class="underline">contributed xp</span>, <span
											class="underline">play
											time</span>, and <span class="underline">the number of wars you
											participated</span>.
									</p>
									<p>
										Each category has different weights as follow:
									</p>
									<ol class="list-decimal ml-6">
										<li>Contributed XP &rarr; approx. 1 for each million</li>
										<li>Play time &rarr; 1 point per hour</li>
										<li>War count &rarr; 1 point per time</li>
									</ol>
									<!-- </p> -->
								</div>

								<div class="flex flex-wrap justify-between mt-4">
									<button type="button"
										class="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 font-medium text-sm text-white rounded"
										@click="closeModalButton">
										Got it, thanks!
									</button>
									<div class="mt-2 text-sm">
										<input type="checkbox" name="persistent" id="persistent" v-model="persistent"
											class="mr-2">
										<label for="persistent">Do not show this again.</label>
									</div>
								</div>
							</HeadlessDialogPanel>

						</HeadlessTransitionChild>
					</div>
				</div>
			</HeadlessDialog>
		</HeadlessTransitionRoot>
	</ClientOnly>
</template>
  

  