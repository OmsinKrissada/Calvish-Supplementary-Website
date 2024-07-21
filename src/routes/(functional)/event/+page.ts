import { env } from '$env/dynamic/public';
import { browser } from '$app/environment';
import type { Guild } from '$lib/types.js';

export async function load({ fetch }) {
	const members = fetch(env.PUBLIC_ENDPOINT + '/event').then((res) => res.json()) as Promise<
		{ uuid: string; username: string; diff: number }[]
	>;

	return {
		promises: members,
		browser
	};
}
