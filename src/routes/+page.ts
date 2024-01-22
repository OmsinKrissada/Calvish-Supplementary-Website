import { env } from '$env/dynamic/public';
import type { Guild } from '$lib/types';

export async function load({ fetch }) {
	const res = await fetch(env.PUBLIC_ENDPOINT + '/guild');
	const guild = (await res.json()) as Guild;

	return {
		guild
	};
}
