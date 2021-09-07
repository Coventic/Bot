import { CommandInteraction } from 'discord.js'
import { IEvent } from '../interfaces/IEvent'

import Bot from '../entities/Bot'

export default class InteractionCreate implements IEvent {
	constructor() {}

	public name = 'interactionCreate'
	public async invoke(
		client: Bot,
		interaction: CommandInteraction
	): Promise<any> {
		await client.interactionCommandManager.invoke(interaction)
	}
}
