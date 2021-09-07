import { IEvent } from '../../interfaces/IEvent'

import Bot from '../../entities/Bot'
import { Player } from 'erela.js'
import { TextChannel } from 'discord.js'

export default class QueueEnd implements IEvent {
	constructor() {}

	public name = 'queueEnd'
	public async invoke(client: Bot, player: Player): Promise<any> {
		const channel = client.channels.cache.get(player.textChannel) as TextChannel

		channel.send({
			content: 'A fila acabou.',
		})
	}
}
