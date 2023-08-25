import type { Guild } from '$lib/types';

export async function load({ fetch }) {
	const res = await fetch(
		"https://api.wynncraft.com/public_api.php?action=guildStats&command=Calvish"
	);
	const guild = await res.json() as Guild;

	return {
		guild
	};
}