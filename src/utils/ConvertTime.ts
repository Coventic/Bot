export function convertTime(milliseconds: number): string {
	const roundTowardsZero = milliseconds > 0 ? Math.floor : Math.ceil

	const parsed = {
		days: roundTowardsZero(milliseconds / 86400000),
		hours: roundTowardsZero(milliseconds / 3600000) % 24,
		minutes: roundTowardsZero(milliseconds / 60000) % 60,
		seconds: roundTowardsZero(milliseconds / 1000) % 60,
		milliseconds: roundTowardsZero(milliseconds) % 1000,
		microseconds: roundTowardsZero(milliseconds * 1000) % 1000,
		nanoseconds: roundTowardsZero(milliseconds * 1e6) % 1000,
	}

	if (milliseconds < 3600000) {
		return parsed.minutes + ':' + parsed.seconds
	} else {
		return parsed.hours + ':' + parsed.minutes + ':' + parsed.seconds
	}
}
