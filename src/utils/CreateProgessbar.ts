export function createProgressbar(
	total: number,
	current: number,
	size: number
): string {
	if (current > total) return '▬'.repeat(size + 2)

	const progressText = '▬'
		.repeat(Math.round((size * current) / total))
		.replace(/.$/, '🔘')
	const emptyProgressText = '▬'.repeat(
		size - Math.round((size * current) / total)
	)

	return progressText + emptyProgressText
}
