import { ValidateContext, ValidatorContent } from '../index'

export default class BanWords implements ValidatorContent {
	filter = 'BAN_WORDS'

	validate({ message, settings }: ValidateContext) {
		const banWords = settings.banWords
		const messageArgs = message.content.toLowerCase().split(/ +/g)

		const isInvalid = banWords.some((w) => messageArgs.includes(w))
		if (isInvalid) {
			if (settings.autoDeleteMessages) message.delete()

			throw new Error('A mensagem contem palavras banidas.')
		}
	}
}
