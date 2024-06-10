// const { data, pending, error, refresh } = await useLazyFetch<PlayerScore[]>(
// 	useRuntimeConfig().public.endpoint + "/event/weekly/score",
// 	{ server: false, key: "weekly/score" }
// );
import { env } from '$env/dynamic/public';

// export const ssr = false;

export async function load({ fetch }) {
	// const scores = (await fetch(env.PUBLIC_ENDPOINT + "/weekly/score")).json() as Promise<PlayerScore[]>;
	const nextReset = fetch(env.PUBLIC_ENDPOINT + '/weekly/nextreset').then((res) =>
		res.json()
	) as Promise<{
		date: string;
	}>;

	return {
		streamed: { nextReset: (async () => new Date((await nextReset).date))() }
	};
}
