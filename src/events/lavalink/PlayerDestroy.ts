import { IEvent } from '../../interfaces/IEvent'

import Bot from '../../entities/Bot'
import { Player } from 'erela.js'
import { log } from '../../utils/Logger'

export default class PlayerDestroy implements IEvent {
	constructor() {}

	public name = 'playerDestroy'
	public async invoke(client: Bot, player: Player): Promise<any> {
		log(`Player destroyed: ${player.guild}`, 'lavalink')
	}
}
