<script lang="ts">
	import { fullDurationString } from '$lib/helper';
	import { timestamp } from '$lib/stores';

	export let to: Date;

	let countdown = '';
	$: if (to) {
		// return nextResetDate.value ? formatDistanceToNowStrict() : 'Error';
		const diff = to.valueOf() - $timestamp.valueOf();

		if (diff >= 0) countdown = `Next reset in ${fullDurationString(diff / 1000)}`;
		else countdown = 'Score has been reset. Please refresh.';
	}
</script>

<div class="text-xl mb-8">{countdown}</div>
