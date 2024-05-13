import { env } from '$env/dynamic/public';
import { browser } from '$app/environment';
import type { Guild } from '$lib/types.js';

export async function load({ fetch }) {

    let res = await fetch(env.PUBLIC_ENDPOINT + '/event');
    const members = (await res.json()) as { uuid: string, username: string, diff: number }[];

    res = await fetch(env.PUBLIC_ENDPOINT + '/guild');
    const guild = (await res.json()) as Guild & { apiTime: number };


    return {
        members,
        guild,
        browser
    };
}
