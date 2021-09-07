import { IEvent } from '../../interfaces/IEvent'
import { Player } from 'erela.js'
import { MessageEmbed, TextChannel } from 'discord.js'

import Bot from '../../entities/Bot'
import config from '../../config'

export default class TrackEnd implements IEvent {
	constructor() {}

	public name = 'trackEnd'
	public async invoke(client: Bot, player: Player): Promise<any> {
		const autoPlay = player.get('autoplay')
		const channel = client.channels.cache.get(player.textChannel) as TextChannel

		if (autoPlay) {
			const requester = player.get('requester')
			const identifier = player.queue.current.identifier
			const search = `https://www.youtube.com/watch?v=${identifier}&list=RD${identifier}`
			const response = await player.search(search, requester)

			player.queue.add(response.tracks[2])
		}

		if (!player.queue.current)
			return channel.send({
				content: 'As músicas acabaram.',
			})

		const playing = new MessageEmbed()
			.setAuthor(
				client.user.username,
				client.user.displayAvatarURL({ dynamic: true })
			)
			.setDescription(
				`Tocando [${player.queue.current.title}](${player.queue.current.uri}) \`[${player.queue.current.duration}]\``
			)
			.setColor(config.client.defaultColor)
			.setFooter(`© ${channel.guild.name}™`)

		channel.send({
			embeds: [playing],
		})
	}
}
