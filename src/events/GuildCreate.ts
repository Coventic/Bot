import { Guild } from 'discord.js'
import { IEvent } from '../interfaces/IEvent'

import Bot from '../entities/Bot'
import GuildRepository from '../data/repositories/guild'
import { log } from '../utils/Logger'

export default class GuildRemove implements IEvent {
	constructor(private guildRepository = new GuildRepository()) {}

	public name = 'guildCreate'
	public async invoke(client: Bot, guild: Guild): Promise<any> {
		try {
			await this.guildRepository.getOrCreate(guild)

			log(`Create guild ${guild.name} (${guild.id})`, 'database')
		} catch (err) {
			return log(`Create guild error: ${err.message}`, 'database')
		}
	}
}
