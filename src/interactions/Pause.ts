import {
	IInteractionCommand,
	IInteractionConfig,
	IInteractionContext,
} from '../interfaces/IInteraction'

import { MessageEmbed } from 'discord.js'
import { Music } from '../modules/music/index'
import config from '../config'

export default class Pause implements IInteractionCommand {
	constructor() {}

	public config: IInteractionConfig = {
		name: 'pause',
		description: 'Pausa a música tocando no momento.',
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
			await manager.pause({ options, client })

			const playing = new MessageEmbed()
				.setAuthor(
					interaction.user.username,
					interaction.user.displayAvatarURL({ dynamic: true })
				)
				.setThumbnail(interaction.guild.iconURL({ dynamic: true }))
				.setDescription('Pausado com sucesso.')
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
