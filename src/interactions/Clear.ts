import {
	IInteractionCommand,
	IInteractionConfig,
	IInteractionContext,
	InteractionTypes,
} from '../interfaces/IInteraction'

import { MessageEmbed, TextChannel } from 'discord.js'
import config from '../config'

export default class Clear implements IInteractionCommand {
	constructor() {}

	public config: IInteractionConfig = {
		name: 'clear',
		description:
			'Apaga as mensagens do canal de acordo a quantidade escolhida.',
		permissions: ['MANAGE_MESSAGES'],
		maintenance: false,
		disabled: false,
		options: [
			{
				name: 'amount',
				description: 'Digite á quantidade.',
				type: InteractionTypes.STRING,
				required: true,
			},
		],
	}

	public async invoke({ interaction }: IInteractionContext): Promise<any> {
		const amount = Number(interaction.options.getString('amount'))

		const channel = interaction.channel as TextChannel

		if (isNaN(amount))
			return interaction.reply({
				content: 'Por favor, digite um número válido.',
				ephemeral: true,
			})

		const cleanedMessages = await channel.bulkDelete(amount)

		const cleaned = new MessageEmbed()
			.setAuthor(
				interaction.user.username,
				interaction.user.displayAvatarURL({ dynamic: true })
			)
			.setThumbnail(interaction.guild.iconURL({ dynamic: true }))
			.setDescription(`${cleanedMessages.size} mensagens apagadas!`)
			.setColor(config.client.defaultColor)
			.setFooter(`© ${interaction.guild.name}™`)

		await interaction.reply({
			embeds: [cleaned],
			ephemeral: true,
		})
	}
}
