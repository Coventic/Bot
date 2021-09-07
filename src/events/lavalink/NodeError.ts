import { IEvent } from '../../interfaces/IEvent'

import Bot from '../../entities/Bot'
import { Node } from 'erela.js'
import { log } from '../../utils/Logger'

export default class NodeError implements IEvent {
	constructor() {}

	public name = 'nodeError'
	public async invoke(client: Bot, node: Node, error): Promise<any> {
		log(`Node ${node.options?.identifier} error: ${error.message}`, 'lavalink')
	}
}
