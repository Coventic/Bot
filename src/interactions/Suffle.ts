import {
	IInteractionCommand,
	IInteractionConfig,
	IInteractionContext,
} from '../interfaces/IInteraction'

import { MessageEmbed } from 'discord.js'
import { Music } from '../modules/music/index'
import config from '../config'

export default class Suffle implements IInteractionCommand {
	constructor() {}

	public config: IInteractionConfig = {
		name: 'suffle',
		description: 'Embaralha as músicas da fila.',
		permissions: [],
		maintenance: false,
		disabled: false,
		options: [],
	}

	public async invoke({
		interaction,
		client,
	}: IInteractionContext): Promise<any> {
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
			await manager.suffle({ options, client })

			const playing = new MessageEmbed()
				.setAuthor(
					interaction.user.username,
					interaction.user.displayAvatarURL({ dynamic: true })
				)
				.setThumbnail(interaction.guild.iconURL({ dynamic: true }))
				.setDescription(`Fila embaralhada.`)
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
