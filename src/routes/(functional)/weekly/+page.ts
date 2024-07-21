// const { data, pending, error, refresh } = await useLazyFetch<PlayerScore[]>(
// 	useRuntimeConfig().public.endpoint + "/event/weekly/score",
// 	{ server: false, key: "weekly/score" }
// );
import { env } from '$env/dynamic/public';

// export const ssr = false;

export async function load({ fetch, url }) {
	// const scores = (await fetch(env.PUBLIC_ENDPOINT + "/weekly/score")).json() as Promise<PlayerScore[]>;
	const nextReset = fetch(env.PUBLIC_ENDPOINT + '/weekly/nextreset').then((res) =>
		res.json()
	) as Promise<{
		date: string;
	}>;

	const uuid = url.searchParams.get('expand');
	let player = null;
	if (uuid) {
		player = fetch(env.PUBLIC_ENDPOINT + `/weekly/player/${uuid}?graph_format`).then((r) =>
			r.json()
		);
	}

	return {
		streamed: { nextReset: (async () => new Date((await nextReset).date))() },
		player: player,
		uuid
	};
}
