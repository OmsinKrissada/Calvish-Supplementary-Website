export const ssr = false;

import { env } from '$env/dynamic/public';
import type { Guild } from '$lib/types';

export async function load({ fetch }) {
	const startTime = new Date().valueOf();

	const guild = fetch(env.PUBLIC_ENDPOINT + '/guild').then((res) => res.json()) as Promise<
		Guild & { apiTime: number }
	>;

	const members = guild.then((g) => g.members.sort((a, b) => b.contributed - a.contributed));

	const totalXp = members.then((members) => members.reduce((prev, m) => prev + m.contributed, 0));

	return {
		startTime,
		guild,
		members,
		totalXp
	};
}
