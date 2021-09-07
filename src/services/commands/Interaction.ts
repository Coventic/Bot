import { CommandInteraction } from 'discord.js'
import { IInteractionCommand } from '../../interfaces/IInteraction'
import { Validator } from './Validator'
import { readdir as read } from 'fs'
import { promisify } from 'util'

import Bot from '../../entities/Bot'
import MemberRepository from '../../data/repositories/member'
import UserRepository from '../../data/repositories/user'
import GuildRepository from '../../data/repositories/guild'
import { log } from '../../utils/Logger'

const readdir = promisify(read)

export default class InteractionCommandManager {
	constructor(
		private client: Bot,
		private memberRepository = new MemberRepository(),
		private userRepository = new UserRepository(),
		private guildRepository = new GuildRepository()
	) {}

	private commands = new Map<string, IInteractionCommand>()
	public interactions = new Array<any>()
	private validator = new Validator()

	public async handle(): Promise<void> {
		const props = await readdir('./src/interactions')

		for (const prop of props) {
			const { default: Command } = await import(`../../interactions/${prop}`)
			const command = new Command()

			this.interactions.push({
				name: command.config.name,
				description: command.config.description,
				options: command.config.options,
				invoke: command.invoke,
			})

			this.commands.set(command.config.name, {
				config: {
					name: command.config.name,
					description: command.config.description,
					permissions: command.config.permissions,
					options: command.config.options,
					maintenance: command.config.maintenance,
					disabled: command.config.disabled,
				},
				invoke: command.invoke,
			})

			log(`Interaction Command: ${command.config.name}`, 'loading')
		}
	}

	public async invoke(interaction: CommandInteraction): Promise<any> {
		if (!interaction.isCommand()) return
		await this.guildRepository.getOrCreate(interaction.guild)
		await this.memberRepository.getOrCreate(
			interaction.guild.members.cache.get(interaction.user.id)
		)
		const user = await this.userRepository.getOrCreate(interaction.user)
		const command = await this.validator.findInteractionCommand({
			commandName: interaction.commandName,
			commands: this.commands,
		})

		if (!command)
			return interaction.reply({
				content: 'O comando não existe.',
				ephemeral: true,
			})

		try {
			this.validator.checkCommand({
				context: interaction,
				client: this.client,
				command,
				user,
			})
		} catch (err) {
			return interaction.reply({
				content: err.message,
				ephemeral: true,
			})
		}

		await command.invoke({ client: this.client, interaction })
	}
}
