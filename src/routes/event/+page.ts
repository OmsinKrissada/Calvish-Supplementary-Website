import { env } from '$env/dynamic/public';
import { browser } from '$app/environment';
import type { Guild } from '$lib/types.js';

export async function load({ fetch }) {
	const members = fetch(env.PUBLIC_ENDPOINT + '/event').then((res) => res.json()) as Promise<
		{ uuid: string; username: string; diff: number }[]
	>;
	const guild = fetch(env.PUBLIC_ENDPOINT + '/guild').then((res) => res.json()) as Promise<
		Guild & { apiTime: number }
	>;

	return {
		promises: Promise.all([members, guild]),
		browser
	};
}
