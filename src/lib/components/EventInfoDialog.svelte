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
	$: isOpen = browser && +(localStorage.getItem('seen_event_dialog') ?? 0) < 4;
	let persistent = false;

	function closeModal() {
		isOpen = false;
	}

	function closeModalButton() {
		if (persistent) {
			localStorage.setItem('seen_event_dialog', '4');
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
			leaveTo="opacity-0">
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
					leaveTo="opacity-0 scale-95">
					<!-- The following div was once a DialogPanel -->
					<div
						class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
						<div class="mt-2 space-y-2 text-sm">
							<p class="font-medium text-green-600 text-lg">
								<span class="underline text-green-800">What's new</span>: Now defaults to WebSocket
								connection for real time data instead of constant polling. Updated data is pushed to
								you when available. You really don't have to hit refresh to update them..
							</p>

							<div class="border-b border-black border-dashed"></div>

							<HeadlessDialogTitle as="h3" class="mb-4 text-xl font-bold leading-6 text-gray-900">
								How are the scores calculated?
							</HeadlessDialogTitle>
							<p>Your score is calculated from your weekly stats.</p>
							<p>
								This includes your
								<span class="underline">contributed xp</span>,
								<span class="underline">play time</span>
								and
								<span class="underline">the number of time you war</span>.
							</p>
							<ol class="list-decimal list-inside">
								<li>Contributed XP &rarr; 1 point per million xp</li>
								<li>Play time &rarr; 1 point per hour</li>
								<li>Wars &rarr; 2 points per war</li>
							</ol>
							<p class="font-bold">Resets at noon every Monday (UTC)</p>
						</div>

						<div class="flex flex-col gap-4 mt-4">
							<div class="flex items-center text-sm">
								<input
									type="checkbox"
									name="persistent"
									id="persistent"
									bind:checked={persistent}
									class="mr-2" />
								<label for="persistent">Do not show this again.</label>
							</div>
							<button
								type="button"
								class="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 font-medium text-sm text-white rounded"
								on:click={closeModalButton}>
								Got it, thanks!
							</button>
						</div>
					</div>
				</HeadlessTransitionChild>
			</div>
		</div>
	</HeadlessDialog>
</HeadlessTransitionRoot>
