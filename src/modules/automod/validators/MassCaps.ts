import { ValidateContext, ValidatorContent } from '../index'

export default class MassCaps implements ValidatorContent {
	filter = 'MASS_CAPS'

	validate({ message, settings }: ValidateContext) {
		const pattern = /[A-Z]/g
		const severity = settings.filterThreshold

		const invalid =
			message.content.length > 5 &&
			message.content.match(pattern)?.length / message.content.length >=
				severity / 10

		if (invalid) {
			if (settings.autoDeleteMessages) message.delete()

			throw new Error('A mensagem contem muitas palavras maíusculas.')
		}
	}
}
