import {
	IInteractionCommand,
	IInteractionConfig,
	IInteractionContext,
	InteractionTypes,
} from '../interfaces/IInteraction'

import { MessageEmbed } from 'discord.js'
import { Music } from '../modules/music/index'
import config from '../config'

export default class Remove implements IInteractionCommand {
	constructor() {}

	public config: IInteractionConfig = {
		name: 'remove',
		description: 'Remove á música desejada da fila.',
		permissions: [],
		maintenance: false,
		disabled: false,
		options: [
			{
				name: 'value',
				description: 'Posição da música que deseja remover.',
				type: InteractionTypes.INTEGER,
				required: true,
			},
		],
	}

	public async invoke({
		interaction,
		client,
	}: IInteractionContext): Promise<any> {
		const target = interaction.options.getInteger('value')

		const voiceChannel = interaction.guild.members.cache.get(
			interaction.user.id
		).voice.channel.id

		const textChannel = interaction.guild.channels.cache.get(
			interaction.channel.id
		).id

		const options = {
			guild: interaction.guild.id,
			textChannel,
			voiceChannel,
		}

		const manager = new Music()

		try {
			await manager.remove({ options, target, client })

			const playing = new MessageEmbed()
				.setAuthor(
					interaction.user.username,
					interaction.user.displayAvatarURL({ dynamic: true })
				)
				.setThumbnail(interaction.guild.iconURL({ dynamic: true }))
				.setDescription('Música removida com sucesso.')
				.setColor(config.client.defaultColor)
				.setFooter(`© ${interaction.guild.name}™`)

			interaction.reply({
				embeds: [playing],
			})
		} catch (err) {
			return interaction.reply({
				content: err.message,
			})
		}
	}
}
