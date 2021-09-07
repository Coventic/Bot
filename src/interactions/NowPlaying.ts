import {
	IInteractionCommand,
	IInteractionConfig,
	IInteractionContext,
} from '../interfaces/IInteraction'

import { MessageEmbed } from 'discord.js'
import { Music } from '../modules/music/index'
import config from '../config'

export default class NowPlaying implements IInteractionCommand {
	constructor() {}

	public config: IInteractionConfig = {
		name: 'nowplaying',
		description: 'Mostra a musica tocando no momento.',
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
			const { track, progressbar } = await manager.nowPlaying({
				options,
				client,
			})

			const playing = new MessageEmbed()
				.setAuthor(
					interaction.user.username,
					interaction.user.displayAvatarURL({ dynamic: true })
				)
				.setColor(config.client.defaultColor)
				.setFooter(`© ${interaction.guild.name}™`)

			if (!track.thumbnail) {
				playing
					.setDescription(
						`**Tocando agora** [${track.title}](https://m.spotify.com/author/${track.author}) \`[${track.time}]\`\n${progressbar}`
					)
					.setThumbnail(
						'https://image.roku.com/developer_channels/prod/01ff04e620e7157e570077460ad8aa9fe1a5b2699f92e00bae7f756cac890013.png'
					)
			} else {
				playing
					.setDescription(
						`**Tocando agora** [${track.title}](${track.uri}) \`[${track.time}]\`\n${progressbar}`
					)
					.setThumbnail(track.displayThumbnail('maxresdefault'))
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
