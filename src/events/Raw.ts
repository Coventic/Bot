import { IEvent } from '../interfaces/IEvent'

import Bot from '../entities/Bot'

export default class Ready implements IEvent {
	constructor() {}

	public name = 'raw'
	public async invoke(client: Bot, raw): Promise<any> {
		client.manager.updateVoiceState(raw)
	}
}
