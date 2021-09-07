import { ValidateContext, ValidatorContent } from '../index'

export default class MassMentions implements ValidatorContent {
	filter = 'MASS_MENTIONS'

	validate({ message, settings }: ValidateContext) {
		const pattern = /<@[0-9]{18}>/g
		const severity = settings.filterThreshold

		const invalid = message.content.match(pattern)?.length >= severity

		if (invalid) {
			if (settings.autoDeleteMessages) message.delete()

			throw new Error('A mensagem contem muitas menções.')
		}
	}
}
