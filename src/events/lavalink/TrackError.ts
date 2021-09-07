import { IEvent } from '../../interfaces/IEvent'

import Bot from '../../entities/Bot'
import { Player } from 'erela.js'
import { TextChannel } from 'discord.js'

export default class TrackError implements IEvent {
	constructor() {}

	public name = 'trackError'
	public async invoke(client: Bot, player: Player): Promise<any> {
		const channel = client.channels.cache.get(player.textChannel) as TextChannel

		channel.send({
			content: 'Erro ao adicionar a musica.',
		})

		if (!player.voiceChannel) player.destroy()
	}
}
