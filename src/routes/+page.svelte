<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import LiquidEmeraldStack from '$lib/components/LiquidEmeraldStack.svelte';
	import { invalidate, invalidateAll } from '$app/navigation';
	import { env } from '$env/dynamic/public';

	export let data;

	const formatterInteger = Intl.NumberFormat('en', { useGrouping: true });
	const formatterDecimal = Intl.NumberFormat('en', {
		useGrouping: true,
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	});

	$: leaderboard = data.guild.members.sort((a, b) => b.contributed - a.contributed);

	$: members = leaderboard.sort((a, b) => b.contributed - a.contributed);

	let totalXp = 0;
	console.log(leaderboard);
	$: {
		totalXp = 0;
		leaderboard.map((m) => (totalXp += m.contributed));
	}

	let interval: number;
	onMount(async () => {
		interval = setInterval(async () => {
			invalidate(env.PUBLIC_ENDPOINT + '/guild');
			console.log('Refreshed!');
		}, 10 * 60 * 1000);
	});

	onDestroy(() => clearInterval(interval));
</script>

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
					{ countdown }
				</p> -->
	</div>

	<div class="my-10">
		<p class="mb-4 font-medium text-center">
			Guild Level: {data.guild.level} ({data.guild.xpPercent}%)
		</p>
		<div class="max-w-md mx-auto bg-white/20 rounded-md">
			<div
				class="h-2 w-0 bg-emerald-500 shadow-[0px_0px_10px_green] rounded-md duration-1000"
				style:width={data.guild.xpPercent + '%'}
				style:transitionProperty="width" />
		</div>
	</div>

	<section>
		<!-- Transition Group -->
		<ul class="sm:hidden mt-4 space-y-2 sm:w-max mx-auto">
			{#each members as m, i (m.uuid)}
				<li
					class="relative flex flex-wrap flex-row items-center justify-between sm:items-center space-x-8 p-2 m-1 bg-black/10 border border-neutral-800 rounded shadow-white/60">
					<div>
						<span class="inline-block w-3 font-bold text-slate-400">{i + 1}</span>
						<img
							src="https://mc-heads.net/avatar/{m.uuid}/8"
							alt=""
							loading="lazy"
							class="inline w-5 ml-8 mr-2 pixelated rounded-sm" />
						<a href="https://wynncraft.com/stats/player/{m.username}" class="font-medium text-md">
							{m.username}
						</a>
					</div>
					<div>
						<span class="right-3 font-mono text-xs text-right text-slate-300">
							{formatterInteger.format(m.contributed)}
							XP
							<p>
								({formatterInteger.format((m.contributed / totalXp) * 100)}%)
							</p>
						</span>
					</div>
				</li>
			{/each}
		</ul>
		<table
			class="hidden sm:table mt-4 mx-auto border-collapse border rounded-lg overflow-hidden text-white">
			<thead>
				<tr class="bg-teal-700/60">
					<th class="py-2 px-4 text-left font-semibold">#</th>
					<th class="py-2 px-4 text-left font-semibold">Member</th>
					<!-- <th class="py-2 px-4 text-left font-semibold">Rank</th> -->
					<th class="py-2 px-4 text-right font-semibold">Contributed XP</th>
					<th class="py-2 px-4 text-right font-semibold">% of Combined XP</th>
				</tr>
			</thead>
			<tbody class="bg-teal-900/30 divide-y divide-teal-700/30">
				{#each members as m, i (m.uuid)}
					<tr class="hover:bg-teal-800/30">
						<td class="py-3 px-4 text-left font-medium">{i + 1}</td>
						<td class="py-3 px-4">
							<div class="flex items-center">
								<img
									src="https://mc-heads.net/avatar/{m.uuid}/8"
									alt=""
									loading="lazy"
									class="w-6 h-6 pixelated rounded-md" />
								<a href="https://wynncraft.com/stats/player/{m.username}" class="ml-3 font-medium">
									{m.username}
								</a>
							</div>
						</td>
						<!-- <td class="py-3 px-4 text-right">
							<span>{m.rank}</span>
						</td> -->
						<td class="py-3 px-4 font-mono text-sm text-right">
							<span>{formatterInteger.format(m.contributed)}</span>
						</td>
						<td class="py-3 px-4 font-mono text-xs text-right">
							<span>
								{#if m.contributed / totalXp > 0 && m.contributed / totalXp < 0.00005}
									{'< 0.01%'}
								{:else if m.contributed / totalXp == 0}
									None
								{:else}
									{formatterDecimal.format((m.contributed / totalXp) * 100)}%
								{/if}
							</span>
							<div class="w-full h-1 mt-1 bg-white/30 rounded-full overflow-hidden">
								<div
									style:width={`${(m.contributed / totalXp) * 100}%`}
									class="h-full ml-auto bg-emerald-500" />
							</div>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</section>
</div>

<!-- <style>
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
</style> -->
