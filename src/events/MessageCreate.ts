import { IEvent } from '../interfaces/IEvent'
import { Message } from 'discord.js'
import Bot from '../entities/Bot'
import AutoModModule from '../modules/automod/index'
import GuildRepository from '../data/repositories/guild'

export default class MessageCreate implements IEvent {
	constructor(
		private autoModModule = new AutoModModule(new GuildRepository())
	) {}

	public name = 'messageCreate'
	public async invoke(client: Bot, message: Message): Promise<any> {
		try {
			await this.autoModModule.handle({ message })
		} catch (err) {
			return message.channel.send(err.message)
		}
	}
}
