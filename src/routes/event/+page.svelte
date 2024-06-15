<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { invalidate } from '$app/navigation';
	import { env } from '$env/dynamic/public';
	import Loader from '$lib/components/Loader.svelte';
	import ErrorText from '$lib/components/ErrorText.svelte';

	export let data;

	const formatterInteger = Intl.NumberFormat('en', { useGrouping: true });
	const formatter = Intl.NumberFormat('en', {
		useGrouping: true,
		maximumFractionDigits: 2
	});

	let interval: number;
	// onMount(async () => {
	// 	interval = setInterval(async () => {
	// 		invalidate(env.PUBLIC_ENDPOINT + '/guild');
	// 		invalidate(env.PUBLIC_ENDPOINT + '/event');
	// 		console.log('Refreshed!');
	// 	}, 10 * 60 * 1000);
	// });

	// onDestroy(() => clearInterval(interval));
</script>

<div>
	<div class="flex flex-col items-center mx-4">
		<div class="flex flex-col items-center space-y-5 sm:space-x-5 sm:space-y-0">
			<h3 class="font-medium text-2xl text-slate-200">XP Event by Optial</h3>
			<p class="pt-2 text-neutral-200">
				Selecting top 5 members from this list when guild level reaches 81.
			</p>
			<p class="text-neutral-200">
				More info in <a
					href="https://discord.com/channels/973054904392351754/1239537570342502511/1239540106155524146"
					class="text-sky-400 underline">this message</a
				>.
			</p>
		</div>
	</div>

	{#await data.promises}
		<div class="text-center mt-10">
			<Loader />
		</div>
	{:then [members, guild]}
		<section class="mx-4">
			<div class="my-10 text-center">
				<p class="font-bold">GOAL REACHED!</p>
				<p class="text-center text-neutral-400">
					Result below is frozen and will remain for reference
				</p>
			</div>
			<table class="table mx-auto border-white rounded-lg overflow-hidden text-white">
				<thead>
					<tr class="bg-black/60 border-b border-white/30">
						<th class="py-2 px-4 text-left font-semibold">#</th>
						<th class="py-2 px-4 text-left font-semibold">Username</th>
						<!-- <th class="py-2 px-4 text-left font-semibold">Rank</th> -->
						<th class="py-2 px-4 text-right font-semibold">Contributed XP</th>
					</tr>
				</thead>
				<tbody class="bg-black/30 divide-y divide-black/30">
					{#each members as m, i (m.uuid)}
						<tr class="hover:bg-teal-900/30" class:brightness-50={m.diff == 0}>
							<td class="py-3 px-4 text-left font-medium">{m.diff ? i + 1 : ''}</td>
							<td class="py-3 px-4">
								<div class="flex items-center">
									<img
										src="https://mc-heads.net/avatar/{m.uuid}/8"
										alt=""
										loading="lazy"
										class="w-6 h-6 pixelated rounded-md" />
									<a
										href="https://wynncraft.com/stats/player/{m.username}"
										class="ml-3 font-medium">
										{m.username}
									</a>
								</div>
							</td>
							<!-- <td class="py-3 px-4 text-right">
        <span>{m.rank}</span>
    </td> -->
							<td class="py-3 px-4 text-sm text-right">
								<span>{formatter.format(m.diff)}</span>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</section>
	{:catch}
		<div class="mt-8">
			<ErrorText text="Cannot load guild data, please let OmBean know if a reload doesn't work." />
		</div>
	{/await}
</div>
