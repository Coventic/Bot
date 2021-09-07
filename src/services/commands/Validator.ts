import { Permissions } from 'discord.js'
import { IInteractionCommand } from '../../interfaces/IInteraction'
import { log } from '../../utils/Logger'

interface IParseMessage {
	args: string[]
}

export class Validator {
	constructor() {
		log('Ready for validations.', 'validator')
	}

	public async findInteractionCommand({
		commandName,
		commands,
	}): Promise<IInteractionCommand> {
		return commands.get(commandName) as IInteractionCommand
	}

	public parseMessage({ message }): IParseMessage {
		const args = message.content.split(/ +/g).slice(1)

		return { args }
	}

	public async checkCommand({ context, command, user, client }): Promise<void> {
		if (!command) throw new Error('O comando não existe.')

		const { permissions } = command.config
		const { isAdmin } = user.settings
		const getMember = (id: string) => context.guild.members.cache.get(id)

		if (command.config.maintenance)
			throw new Error('O comando está em manutenção.')

		if (command.config.disabled) throw new Error('O comando está desativado.')

		if (permissions[0] !== 'OWNER')
			for (const permission of permissions) {
				if (
					!getMember(context.member.user.id).permissions.has(
						Permissions.FLAGS[permission]
					)
				)
					throw new Error(
						`Você precisa das permissões de ${permissions
							.map((e) => e)
							.join(', ')}`
					)

				if (
					!getMember(client.user.id).permissions.has(
						Permissions.FLAGS[permission]
					)
				)
					throw new Error(
						`Eu preciso das permissões de ${permissions
							.map((e) => e)
							.join(', ')}`
					)
			}
		else if (!isAdmin)
			throw new Error('Você não tem permissão para usar esse comando.')
	}
}
