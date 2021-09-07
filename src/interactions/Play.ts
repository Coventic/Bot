import {
	IInteractionCommand,
	IInteractionConfig,
	IInteractionContext,
	InteractionTypes,
} from '../interfaces/IInteraction'

import { MessageEmbed } from 'discord.js'
import { Music } from '../modules/music/index'
import { convertTime } from '../utils/ConvertTime'
import config from '../config'

export default class Play implements IInteractionCommand {
	constructor() {}

	public config: IInteractionConfig = {
		name: 'play',
		description: 'Toca uma musica no canal de voz.',
		permissions: [],
		maintenance: false,
		disabled: false,
		options: [
			{
				name: 'target',
				description: 'Nome ou link da musica.',
				type: InteractionTypes.STRING,
				required: true,
			},
		],
	}

	public async invoke({
		interaction,
		client,
	}: IInteractionContext): Promise<any> {
		const target = interaction.options.getString('target')

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
			const { tracks } = await manager.play({ options, target, client })

			const playing = new MessageEmbed()
				.setAuthor(
					interaction.user.username,
					interaction.user.displayAvatarURL({ dynamic: true })
				)
				.setColor(config.client.defaultColor)
				.setFooter(`© ${interaction.guild.name}™`)

			if (!tracks[0].thumbnail) {
				playing
					.setDescription(`**Adicionado** ${tracks.length} músicas na fila.`)
					.setThumbnail(
						'https://image.roku.com/developer_channels/prod/01ff04e620e7157e570077460ad8aa9fe1a5b2699f92e00bae7f756cac890013.png'
					)
			} else {
				playing
					.setDescription(
						`**Adicionado** [${tracks[0].title}](${
							tracks[0].uri
						}) \`[${convertTime(tracks[0].duration)}]\``
					)
					.setThumbnail(tracks[0].displayThumbnail('maxresdefault'))
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
