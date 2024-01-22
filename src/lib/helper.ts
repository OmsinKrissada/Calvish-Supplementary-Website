import { formatDuration } from 'date-fns';

function padZero(number: number) {
	return ('00' + number).slice(-2);
}
export function fullDurationString(seconds: number, zero = false) {
	return `${Math.floor(seconds / 60 / 60 / 24)}:${padZero(
		Math.floor((seconds / 60 / 60) % 24)
	)}:${padZero(Math.floor((seconds / 60) % 60))}:${padZero(Math.floor(seconds % 60))}`;
	// return formatDuration(
	// 	{
	// 		days: Math.floor(seconds / 60 / 60 / 24),
	// 		hours: Math.floor((seconds / 60 / 60) % 24),
	// 		minutes: Math.floor((seconds / 60) % 60),
	// 		seconds: Math.floor(seconds % 60)
	// 	},
	// 	{ delimiter: ', ', zero }
	// );
}
