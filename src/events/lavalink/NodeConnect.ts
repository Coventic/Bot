import { IEvent } from '../../interfaces/IEvent'

import Bot from '../../entities/Bot'
import { Node } from 'erela.js'
import { log } from '../../utils/Logger'

export default class NodeConnect implements IEvent {
	constructor() {}

	public name = 'nodeConnect'
	public async invoke(client: Bot, node: Node): Promise<any> {
		log('Node connected', 'lavalink')
	}
}
