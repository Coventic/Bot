import { ValidateContext, ValidatorContent } from '../index'

export default class MassAttachments implements ValidatorContent {
	filter = 'MASS_ATTACHMENTS'

	validate({ message, settings }: ValidateContext) {
		const attachments = message.attachments.size
		const severity = settings.filterThreshold

		const invalid = attachments >= severity

		if (invalid) {
			if (settings.autoDeleteMessages) message.delete()

			throw new Error('A mensagem contem muitos anexos.')
		}
	}
}
