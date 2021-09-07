import { Message } from 'discord.js'
import { AutoModModule, MessageFilter } from '../../data/models/Guild'
import { readdir as read } from 'fs'
import { promisify } from 'util'

import GuildRepository from '../../data/repositories/guild'

const readdir = promisify(read)

export interface IAutomodContext {
	message: Message
}

export interface ValidateContext {
	message: Message
	settings: AutoModModule
}

export interface ValidatorContent {
	filter: string
	validate({ message, settings }: ValidateContext): void | Promise<void>
}

export default class Automod {
	constructor(private guildRepository: GuildRepository) {}

	private validators = new Map<string, ValidatorContent>()

	public async handle({ message }: IAutomodContext): Promise<void> {
		const { autoModModule } = await this.guildRepository.getOrCreate(
			message.guild
		)
		const files = await readdir(`${__dirname}/validators`)

		for (const file of files) {
			const { default: Validator } = await import(`./validators/${file}`)

			const validator = new Validator()

			this.validators.set(validator.filter, validator)
		}

		await this.validate({
			message,
			settings: autoModModule,
		})
	}

	private async validate({
		message,
		settings,
	}: ValidateContext): Promise<void> {
		const filters = settings.filters

		for (const filter of filters) {
			try {
				this.validators.get(filter)?.validate({ message, settings })
			} catch (validator) {
				message.channel.send(validator.message)
			}
		}
	}
}
