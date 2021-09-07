import { IEvent } from '../../interfaces/IEvent'

import Bot from '../../entities/Bot'
import { Player } from 'erela.js'

export default class PlayerMove implements IEvent {
	constructor() {}

	public name = 'playerMove'
	public async invoke(
		client: Bot,
		player: Player,
		oldChannel,
		newChannel
	): Promise<any> {
		player.voiceChannel = client.channels.cache.get(newChannel).id
	}
}
