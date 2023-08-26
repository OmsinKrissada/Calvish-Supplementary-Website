import { readable, writable } from 'svelte/store';
import type { PlayerScore } from './types';
import { env } from '$env/dynamic/public';

export const timestamp = readable(new Date(), (set, update) => {
	const interval = setInterval(() => {
		set(new Date());
	}, 1000);
	return () => clearInterval(interval);
});

export const calvishScores = writable<PlayerScore[]>([], (set, update) => {});

// export const localStorageStore = writable(localStorage.getItem())
