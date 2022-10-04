import {formatDuration} from 'date-fns'
export function fullDurationString(seconds: number, zero = false) {
	return formatDuration({
		days: Math.floor(seconds / 60 / 60 / 24),
		hours: Math.floor(seconds / 60 / 60 % 60),
		minutes: Math.floor(seconds / 60 % 60),
		seconds: Math.floor(seconds % 60)
	}, { delimiter: ', ', zero });
}