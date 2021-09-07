import { ValidateContext, ValidatorContent } from '../index'

export default class BanLinks implements ValidatorContent {
	filter = 'BAN_LINKS'

	validate({ message, settings }: ValidateContext): void {
		const banedLinks = settings.banLinks
		const messageArgs = message.content.toLowerCase().split(/ +/g)

		const isInvalid = banedLinks.some((l) => messageArgs.includes(l))
		if (isInvalid) {
			if (settings.autoDeleteMessages) message.delete()

			throw new Error('A mensagem contem links banidos.')
		}
	}
}
