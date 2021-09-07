import { IEvent } from '../../interfaces/IEvent'

import Bot from '../../entities/Bot'
import { Player } from 'erela.js'
import { log } from '../../utils/Logger'

export default class PlayerCreate implements IEvent {
	constructor() {}

	public name = 'playerCreate'
	public async invoke(client: Bot, player: Player): Promise<any> {
		log(`Player created: ${player.guild}`, 'lavalink')
	}
}
