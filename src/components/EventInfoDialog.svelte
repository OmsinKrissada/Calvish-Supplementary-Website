<script setup lang="ts">
	// import { useLocalStorage } from "@vueuse/core";
	import { browser } from '$app/environment';
	import {
		TransitionRoot as HeadlessTransitionRoot,
		TransitionChild as HeadlessTransitionChild,
		Dialog as HeadlessDialog,
		DialogTitle as HeadlessDialogTitle
	} from '@rgossiaux/svelte-headlessui';

	// current dialog id counter: 2
	$: isOpen = browser && +(localStorage.getItem('seen_event_dialog') ?? 0) < 2;
	let persistent = false;

	function closeModal() {
		isOpen = false;
	}

	function closeModalButton() {
		if (persistent) {
			localStorage.setItem('seen_event_dialog', '2');
		}
		closeModal();
	}

	function openModal() {
		isOpen = true;
	}
</script>

<!-- <div class="fixed inset-0 flex items-center justify-center">
		<button type="button" @click="openModal"
			class="rounded-md bg-black bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
			Open dialog
		</button>
	</div> -->
<HeadlessTransitionRoot appear bind:show={isOpen} as="div">
	<HeadlessDialog as="div" on:close={closeModal} class="relative z-40">
		<HeadlessTransitionChild
			as="div"
			enter="duration-300 ease-out"
			enterFrom="opacity-0"
			enterTo="opacity-100"
			leave="duration-200 ease-in"
			leaveFrom="opacity-100"
			leaveTo="opacity-0"
		>
			<div class="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm" />
		</HeadlessTransitionChild>
		<div class="fixed inset-0 overflow-y-auto">
			<div class="flex min-h-full items-center justify-center p-4 text-center">
				<HeadlessTransitionChild
					as="div"
					enter="duration-300 ease-out"
					enterFrom="opacity-0 scale-95"
					enterTo="opacity-100 scale-100"
					leave="duration-200 ease-in"
					leaveFrom="opacity-100 scale-100"
					leaveTo="opacity-0 scale-95"
				>
					<!-- The following div was once a DialogPanel -->
					<div
						class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
					>
						<HeadlessDialogTitle as="h3" class="mb-4 text-xl font-bold leading-6 text-gray-900">
							How are the scores calculated?
							<!-- <p>** 2 Jan UPDATE</p> -->
						</HeadlessDialogTitle>
						<div class="mt-2 space-y-2 text-sm">
							<!-- <p class="text-sm text-gray-500"> -->
							<p>Your score is calculated from your weekly stats.</p>
							<p>
								This includes your
								<span class="underline">contributed xp</span>
								and
								<span class="underline">play time</span>.
								<!-- This includes your <span class="underline">contributed xp</span>, <span
											class="underline">play
											time</span>, and <span class="underline">the number of wars you
											participated</span>. -->
							</p>
							<!-- <p>Each category has different weight:</p> -->
							<ol class="list-decimal list-inside">
								<li>Contributed XP &rarr; 1 point per million xp</li>
								<li>Play time &rarr; 0.5 point per hour</li>
								<!-- <li>War count &rarr; 1 point per round</li> -->
							</ol>
							<!-- </p> -->
						</div>

						<div class="flex flex-col gap-4 mt-8">
							<div class="flex items-center text-sm">
								<input
									type="checkbox"
									name="persistent"
									id="persistent"
									bind:checked={persistent}
									class="mr-2"
								/>
								<label for="persistent">Do not show this again.</label>
							</div>
							<button
								type="button"
								class="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 font-medium text-sm text-white rounded"
								on:click={closeModalButton}
							>
								Got it, thanks!
							</button>
						</div>
					</div>
				</HeadlessTransitionChild>
			</div>
		</div>
	</HeadlessDialog>
</HeadlessTransitionRoot>
