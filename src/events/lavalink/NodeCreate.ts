import { IEvent } from '../../interfaces/IEvent'

import Bot from '../../entities/Bot'
import { Node } from 'erela.js'
import { log } from '../../utils/Logger'

export default class NodeCreate implements IEvent {
	constructor() {}

	public name = 'nodeCreate'
	public async invoke(client: Bot, node: Node): Promise<any> {
		log(`Node created: ${node.options?.identifier}`, 'lavalink')
	}
}
