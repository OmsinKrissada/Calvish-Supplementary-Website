<script lang="ts">
	import { onMount } from 'svelte';
	import { env } from '$env/dynamic/public';

	let globalTouchCount: number | null = null;

	let touchCounter = 0;
	let globalTouchBuffer = 0;

	let open = false;

	function updateTouchCounter() {
		touchCounter++;
		globalTouchBuffer++;
		localStorage.setItem('touchCounter', `${touchCounter}`);
	}

	onMount(() => {
		const count = +(localStorage.getItem('touchCounter') ?? 0);
		if (!isNaN(count)) {
			touchCounter = count;
		}

		setInterval(async () => {
			if (globalTouchBuffer <= 0) return;
			fetch(env.PUBLIC_ENDPOINT + '/grass', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ count: globalTouchBuffer })
			})
				.then((res) => res.json())
				.then((data) => (globalTouchCount = data.globalCount));
			globalTouchBuffer = 0;
		}, 1000);

		fetch(env.PUBLIC_ENDPOINT + '/grass')
			.then((res) => res.json())
			.then((data) => (globalTouchCount = data.globalCount));
	});
</script>

{#if globalTouchCount !== null}
	<div class="z-30 fixed bottom-0 text-lime-300">
		<div
			class="p-2 bg-lime-950 rounded-tr-md transition-transform ease-out {open
				? ''
				: '-translate-x-full'}">
			<button
				on:click={() => (open = !open)}
				class="absolute bottom-4 right-0 translate-x-full bg-lime-950 px-1 py-2 font-semibold tracking-widest rounded-r-md"
				style="writing-mode: vertical-lr;">
				GRASS
			</button>
			<p class="font-semibold text-center text-xl tracking-widest">
				GRASS <span class="text-xs tracking-normal">(touch it)</span>
			</p>
			{#if touchCounter > 0}
				<p class="text-center text-xs text-lime-200">
					You touched grass {Intl.NumberFormat('en').format(touchCounter)} times
				</p>
				<p class="text-center text-xs text-lime-200">
					Global count: {Intl.NumberFormat('en').format(globalTouchCount)} times
				</p>
			{/if}
			<button on:click={updateTouchCounter}>
				<img
					class="mt-2 rounded-full active:scale-90"
					src="https://images.unsplash.com/photo-1533460004989-cef01064af7e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z3Jhc3N8ZW58MHx8MHx8fDA%3D&w=230&q=80"
					alt="" />
			</button>
		</div>
	</div>
{/if}
