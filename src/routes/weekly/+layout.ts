// const { data, pending, error, refresh } = await useLazyFetch<PlayerScore[]>(
// 	useRuntimeConfig().public.endpoint + "/event/weekly/score",
// 	{ server: false, key: "weekly/score" }
// );
import { env } from '$env/dynamic/public';


export async function load({ fetch }) {
	// const scores = (await fetch(env.PUBLIC_ENDPOINT + "/event/weekly/score")).json() as Promise<PlayerScore[]>;
	const nextReset = (await fetch(env.PUBLIC_ENDPOINT + "/event/weekly/nextreset")).json() as Promise<{ date: string; }>;

	return {
		streamed: { nextReset: (async () => new Date((await nextReset).date))() }
	};
}