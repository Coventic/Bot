import { cyan, grey } from 'chalk'

export function log(message: string, module?: string): void {
	function getDate(date: Date): string {
		return `${grey.bold(
			`${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
		)}`
	}

	console.log(
		`[${cyan(module.toUpperCase())}] ${getDate(new Date())} ${message.replace(
			/[:]/,
			''
		)}`
	)
}
