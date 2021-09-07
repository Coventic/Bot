import { IEvent } from '../../interfaces/IEvent'

import Bot from '../../entities/Bot'
import { Player, WebSocketClosedEvent } from 'erela.js'
import { log } from '../../utils/Logger'

export default class SocketClosed implements IEvent {
	constructor() {}

	public name = 'socketClosed'
	public async invoke(
		client: Bot,
		player: Player,
		payload: WebSocketClosedEvent
	): Promise<any> {
		if (payload.byRemote) player.destroy()

		log(`Socket closed: ${payload.reason}`, 'lavalink')
	}
}
