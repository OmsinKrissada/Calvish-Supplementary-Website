<script lang="ts">
	import { fullDurationString } from '$lib/helper';
	import { timestamp } from '$lib/stores';
	import { format, subDays } from 'date-fns';

	export let to: Date;

	const millisecondsInWeek = 7 * 24 * 60 * 60 * 1000;

	let countdown = '';
	let diff = 0;
	$: percentPassed = (1 - diff / millisecondsInWeek) * 100;
	$: if (to) {
		diff = to.valueOf() - $timestamp.valueOf();

		if (diff >= 0) countdown = `${fullDurationString(diff / 1000)} remaining this week`;
		else countdown = 'Score has been reset. Please refresh.';
	}
</script>

<div class="flex items-center w-11/12 sm:w-full mt-8 mb-8">
	<div class="absolute flex justify-center w-3 h-3 bg-emerald-500 rounded-full">
		<p class="absolute top-full mt-2 text-xs text-neutral-400 whitespace-nowrap">
			{format(subDays(to, 7), 'MMM dd')}
		</p>
	</div>
	<div class="relative w-full h-[3px] bg-white/30">
		<div class="h-[3px] bg-emerald-500" style="width: {percentPassed}%" />
		<div
			class="z-10 absolute flex justify-center top-1/2 -translate-y-1/2 w-3 h-3 bg-emerald-400 rounded-full"
			style="left: {percentPassed}%;">
			<div class="absolute w-3 h-3 bg-emerald-400 rounded-full animate-ping" />
		</div>
	</div>
	<div class="relative flex justify-center w-3 h-3 bg-white/30 rounded-full">
		<p class="absolute bottom-full right-0 mb-2 text-xs text-neutral-400 whitespace-nowrap">
			{countdown}
		</p>
		<p class="absolute top-full mt-2 text-xs text-neutral-400 whitespace-nowrap">
			{format(subDays(to, 1), 'MMM dd')}
		</p>
	</div>
</div>
