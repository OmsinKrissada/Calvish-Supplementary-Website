import { env } from '$env/dynamic/public';
import type { Guild } from '$lib/types';

export async function load({ fetch }) {
	const startTime = new Date().valueOf();

	const res = await fetch(env.PUBLIC_ENDPOINT + '/guild');
	const guild = (await res.json()) as Guild & { apiTime: number };

	const overallTime = new Date().valueOf() - startTime;
	const calvishApiTime = overallTime - guild.apiTime;

	return {
		guild,
		calvishApiTime,
		wynnApiTime: overallTime - calvishApiTime,
		overallTime,
	};
}
