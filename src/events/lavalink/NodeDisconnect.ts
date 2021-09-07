import { IEvent } from '../../interfaces/IEvent'

import Bot from '../../entities/Bot'
import { Node } from 'erela.js'
import { log } from '../../utils/Logger'

export default class NodeDisconnect implements IEvent {
	constructor() {}

	public name = 'nodeDisconnect'
	public async invoke(client: Bot, node: Node, reason): Promise<any> {
		log('Node disconnected', 'lavalink')
	}
}
