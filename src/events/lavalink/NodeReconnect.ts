import { IEvent } from '../../interfaces/IEvent'

import Bot from '../../entities/Bot'
import { Node } from 'erela.js'
import { log } from '../../utils/Logger'

export default class NodeReconnect implements IEvent {
	constructor() {}

	public name = 'nodeReconnect'
	public async invoke(client: Bot, node: Node): Promise<any> {
		log('Node reconnected', 'lavalink')
	}
}
