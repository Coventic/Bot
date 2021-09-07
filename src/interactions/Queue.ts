import {
	IInteractionCommand,
	IInteractionConfig,
	IInteractionContext,
	InteractionTypes,
} from '../interfaces/IInteraction'

import { MessageEmbed } from 'discord.js'
import { Music } from '../modules/music/index'
import config from '../config'

export default class Queue implements IInteractionCommand {
	constructor() {}

	public config: IInteractionConfig = {
		name: 'queue',
		description: 'Mostra á lista de músicas.',
		permissions: [],
		maintenance: false,
		disabled: false,
		options: [
			{
				name: 'value',
				description: 'Número da pagina que deseja visualizar.',
				type: InteractionTypes.INTEGER,
				required: false,
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
			const { queue, track } = await manager.queue({ options, target, client })

			const playing = new MessageEmbed()
				.setAuthor(
					interaction.user.username,
					interaction.user.displayAvatarURL({ dynamic: true })
				)
				.setThumbnail(interaction.guild.iconURL({ dynamic: true }))
				.setDescription(
					`**Lista de músicas**\n${queue.current}\nPagina ${queue.currentPage} de ${queue.maxPages}`
				)
				.setColor(config.client.defaultColor)
				.setFooter(`© ${interaction.guild.name}™`)

			if (!track.thumbnail) {
				playing.addField(
					'Tocando agora',
					`[${track.title}](https://m.spotify.com/author/${track.author}) \`[${track.time}]\``
				)
			} else {
				playing.addField(
					'Tocando agora',
					`[${track.title}](${track.uri}) \`[${track.time}]\``
				)
			}

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
